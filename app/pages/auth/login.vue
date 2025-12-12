<template>
  <UCard class="max-w-md mx-auto">
    <template #header>
      <div class="text-center">
        <h1 class="text-3xl font-bold text-gray-900">Welcome Back</h1>
        <p class="text-gray-600 mt-2">Sign in to your BookHub account</p>
      </div>
    </template>

    <UAlert
      v-if="error"
      color="error"
      variant="soft"
      :title="error"
      class="mb-6"
      :close-button="{
        icon: 'i-heroicons-x-mark-20-solid',
        color: 'gray',
        variant: 'link',
        padded: false,
      }"
      @close="error = ''"
    />

    <UForm :schema="schema" :state="state" @submit="onSubmit" class="space-y-6">
      <UFormGroup label="Email Address" name="email" required>
        <UInput
          v-model="state.email"
          type="email"
          placeholder="Enter your email address"
          icon="i-heroicons-envelope"
          :disabled="loading"
          autocomplete="email"
          size="lg"
        />
      </UFormGroup>

      <UFormGroup label="Password" name="password" required>
        <UInput
          v-model="state.password"
          type="password"
          placeholder="Enter your password"
          icon="i-heroicons-lock-closed"
          :disabled="loading"
          autocomplete="current-password"
          size="lg"
        />
      </UFormGroup>

      <div class="flex items-center justify-between">
        <UCheckbox
          v-model="state.remember"
          label="Remember me"
          :disabled="loading"
        />
        <NuxtLink
          to="/auth/forgot-password"
          class="text-sm text-primary-600 hover:text-primary-500 font-medium"
        >
          Forgot password?
        </NuxtLink>
      </div>

      <UButton
        type="submit"
        block
        :loading="loading"
        size="lg"
        :disabled="loading"
        class="font-semibold"
      >
        <span v-if="!loading">Sign In</span>
        <span v-else>Signing In...</span>
      </UButton>
    </UForm>

    <template #footer>
      <div class="text-center pt-4 border-t border-gray-200">
        <p class="text-gray-600">
          Don't have an account?
          <NuxtLink
            to="/auth/register"
            class="text-primary-600 hover:text-primary-500 font-semibold ml-1"
          >
            Create account
          </NuxtLink>
        </p>
      </div>
    </template>
  </UCard>
</template>

<script setup lang="ts">
import { z } from 'zod';
import type { LoginResponse } from '~/composables/useApi';
import type { User } from '~/composables/useAuth';

definePageMeta({
  layout: 'auth',
  middleware: 'guest',
});

useSeoMeta({
  title: 'Sign In - BookHub',
  description:
    'Sign in to your BookHub account to access your personalized book recommendations and reading lists.',
  robots: 'noindex, nofollow',
});

const schema = z.object({
  email: z
    .string()
    .min(1, 'Email is required')
    .email('Please enter a valid email address'),
  password: z
    .string()
    .min(1, 'Password is required')
    .min(6, 'Password must be at least 6 characters'),
});

type FormData = z.infer<typeof schema>;

const state = reactive<FormData & { remember: boolean }>({
  email: '',
  password: '',
  remember: false,
});

const loading = ref(false);
const error = ref('');

const { login } = useApi();
const { setAuth } = useAuth();
const toast = useToast();
const route = useRoute();

async function onSubmit() {
  if (loading.value) return;

  error.value = '';
  loading.value = true;

  try {
    const response: LoginResponse = await login({
      email: state.email,
      password: state.password,
    });

    const user: User = {
      id: response.user.id,
      name: response.user.name,
      email: response.user.email,
      avatar: response.user.avatar,
    };

    const token = response.token || response.access_token;

    if (!token) {
      throw new Error('No authentication token received');
    }

    setAuth(user, token);

    toast.add({
      title: 'Welcome back!',
      description: `Successfully signed in as ${user.name}`,
      color: 'success',
    });

    const redirect = (route.query.redirect as string) || '/';
    await navigateTo(redirect);
  } catch (err: any) {
    const errorMessage =
      err.message || 'Invalid email or password. Please try again.';
    error.value = errorMessage;

    toast.add({
      title: 'Sign In Failed',
      description: errorMessage,
      color: 'error',
    });

    console.error('Login failed:', err);
  } finally {
    loading.value = false;
  }
}
</script>
