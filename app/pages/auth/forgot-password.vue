<template>
  <UCard class="max-w-md mx-auto">
    <template #header>
      <div class="text-center">
        <h1 class="text-3xl font-bold text-gray-900">Reset Password</h1>
        <p class="text-gray-600 mt-2">
          Enter your email to receive reset instructions
        </p>
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

    <UAlert
      v-if="success"
      color="success"
      variant="soft"
      :title="success"
      class="mb-6"
      :close-button="{
        icon: 'i-heroicons-x-mark-20-solid',
        color: 'gray',
        variant: 'link',
        padded: false,
      }"
      @close="success = ''"
    />

    <UForm :schema="schema" :state="state" @submit="onSubmit" class="space-y-6">
      <UFormGroup label="Email Address" name="email" required>
        <UInput
          v-model="state.email"
          type="email"
          placeholder="Enter your email address"
          icon="i-heroicons-envelope"
          :disabled="loading || emailSent"
          autocomplete="email"
          size="lg"
        />
      </UFormGroup>

      <UButton
        type="submit"
        block
        :loading="loading"
        size="lg"
        :disabled="loading || emailSent"
        class="font-semibold"
      >
        <span v-if="!loading && !emailSent">Send Reset Instructions</span>
        <span v-else-if="loading">Sending...</span>
        <span v-else>Instructions Sent</span>
      </UButton>
    </UForm>

    <template #footer>
      <div class="text-center pt-4 border-t border-gray-200 space-y-2">
        <p class="text-gray-600">
          Remember your password?
          <NuxtLink
            to="/auth/login"
            class="text-primary-600 hover:text-primary-500 font-semibold ml-1"
          >
            Sign in
          </NuxtLink>
        </p>
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
import type { ForgotPasswordResponse } from '~/composables/useApi';

definePageMeta({
  layout: 'auth',
  middleware: 'guest',
});

useSeoMeta({
  title: 'Reset Password - BookHub',
  description:
    'Reset your BookHub account password. Enter your email to receive password reset instructions.',
  robots: 'noindex, nofollow',
});

const schema = z.object({
  email: z
    .string()
    .min(1, 'Email is required')
    .email('Please enter a valid email address'),
});

type FormData = z.infer<typeof schema>;

const state = reactive<FormData>({
  email: '',
});

const loading = ref(false);
const error = ref('');
const success = ref('');
const emailSent = ref(false);

const { forgotPassword } = useApi();
const toast = useToast();
const route = useRoute();

// Pre-fill email if provided in query params
onMounted(() => {
  const email = route.query.email as string;
  if (email) {
    state.email = email;
  }
});

async function onSubmit() {
  if (loading.value || emailSent.value) return;

  error.value = '';
  success.value = '';
  loading.value = true;

  try {
    const response: ForgotPasswordResponse = await forgotPassword(
      state.email.toLowerCase().trim(),
    );

    success.value =
      response.message ||
      'Password reset instructions have been sent to your email.';
    emailSent.value = true;

    toast.add({
      title: 'Reset Instructions Sent',
      description: 'Check your email for password reset instructions.',
      color: 'success',
    });

    // Auto redirect to login after 10 seconds
    setTimeout(() => {
      navigateTo('/auth/login');
    }, 10000);
  } catch (err: any) {
    const errorMessage =
      err.message || 'Failed to send reset instructions. Please try again.';
    error.value = errorMessage;

    toast.add({
      title: 'Reset Failed',
      description: errorMessage,
      color: 'error',
    });

    console.error('Forgot password failed:', err);
  } finally {
    loading.value = false;
  }
}
</script>
