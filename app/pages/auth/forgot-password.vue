<template>
  <UCard>
    <template #header>
      <h2 class="text-2xl font-bold text-center">Welcome Back</h2>
      <p class="text-gray-600 text-center mt-2">Sign in to your account</p>
    </template>

    <UAlert
      v-if="error"
      color="red"
      variant="soft"
      :title="error"
      class="mb-4"
      @close="error = ''"
    />

    <UForm :schema="schema" :state="state" @submit="onSubmit" class="space-y-4">
      <UFormGroup label="Email" name="email" required>
        <UInput
          v-model="state.email"
          type="email"
          placeholder="Enter your email"
          icon="i-heroicons-envelope"
          :disabled="loading"
          autocomplete="email"
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
          class="text-sm text-blue-600 hover:underline"
        >
          Forgot password?
        </NuxtLink>
      </div>

      <UButton type="submit" block :loading="loading" size="lg">
        Sign In
      </UButton>
    </UForm>

    <template #footer>
      <div class="text-center">
        <p class="text-gray-600">
          Don't have an account?
          <NuxtLink
            to="/auth/register"
            class="text-blue-600 hover:underline font-medium"
          >
            Sign up
          </NuxtLink>
        </p>
      </div>
    </template>
  </UCard>
</template>

<script setup lang="ts">
import { z } from 'zod';
import type { User } from '~/composables/useAuth';

definePageMeta({
  layout: 'auth',
  middleware: 'guest',
});

useSeoMeta({
  title: 'Login',
  description:
    'Sign in to your BookHub account to access your personalized book recommendations and reading lists.',
  robots: 'noindex, nofollow',
});

const schema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
});

const state = reactive({
  email: '',
  password: '',
  remember: false,
});

const loading = ref(false);
const error = ref('');

const { login } = useApi();
const { setAuth } = useAuth();

async function onSubmit() {
  error.value = '';
  loading.value = true;

  try {
    const response = await login({
      email: state.email,
      password: state.password,
    });

    // Assuming API returns { user, token }
    // Adjust based on your actual API response structure
    const user: User = response.user || {
      id: response.id,
      name: response.name || state.email.split('@')[0],
      email: state.email,
    };
    const token = response.token || response.access_token;

    setAuth(user, token);

    // Show success message
    const toast = useToast();
    toast.add({
      title: 'Welcome back!',
      description: `Logged in as ${user.name}`,
      color: 'green',
    });

    // Redirect to home or intended page
    const redirect = (useRoute().query.redirect as string) || '/';
    await navigateTo(redirect);
  } catch (err: any) {
    error.value = err.message || 'Invalid email or password. Please try again.';
    console.error('Login failed:', err);
  } finally {
    loading.value = false;
  }
}
</script>
