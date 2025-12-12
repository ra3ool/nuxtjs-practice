<template>
  <UCard class="max-w-md mx-auto">
    <template #header>
      <div class="text-center">
        <h1 class="text-3xl font-bold text-gray-900">Create Account</h1>
        <p class="text-gray-600 mt-2">
          Join BookHub and discover amazing books
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

    <UForm :schema="schema" :state="state" @submit="onSubmit" class="space-y-6">
      <UFormGroup label="Full Name" name="name" required>
        <UInput
          v-model="state.name"
          placeholder="Enter your full name"
          icon="i-heroicons-user"
          :disabled="loading"
          autocomplete="name"
          size="lg"
        />
      </UFormGroup>

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
          placeholder="Create a strong password"
          icon="i-heroicons-lock-closed"
          :disabled="loading"
          autocomplete="new-password"
          size="lg"
        />
      </UFormGroup>

      <UFormGroup label="Confirm Password" name="confirmPassword" required>
        <UInput
          v-model="state.confirmPassword"
          type="password"
          placeholder="Confirm your password"
          icon="i-heroicons-lock-closed"
          :disabled="loading"
          autocomplete="new-password"
          size="lg"
        />
      </UFormGroup>

      <UFormGroup name="terms" required>
        <UCheckbox v-model="state.terms" :disabled="loading">
          <template #label>
            <span class="text-sm">
              I agree to the
              <NuxtLink
                to="/terms"
                class="text-primary-600 hover:text-primary-500 font-medium"
                >Terms of Service</NuxtLink
              >
              and
              <NuxtLink
                to="/privacy"
                class="text-primary-600 hover:text-primary-500 font-medium"
                >Privacy Policy</NuxtLink
              >
            </span>
          </template>
        </UCheckbox>
      </UFormGroup>

      <UButton
        type="submit"
        block
        :loading="loading"
        size="lg"
        :disabled="loading"
        class="font-semibold"
      >
        <span v-if="!loading">Create Account</span>
        <span v-else>Creating Account...</span>
      </UButton>
    </UForm>

    <template #footer>
      <div class="text-center pt-4 border-t border-gray-200">
        <p class="text-gray-600">
          Already have an account?
          <NuxtLink
            to="/auth/login"
            class="text-primary-600 hover:text-primary-500 font-semibold ml-1"
          >
            Sign in
          </NuxtLink>
        </p>
      </div>
    </template>
  </UCard>
</template>

<script setup lang="ts">
import { z } from 'zod';
import type { RegisterResponse } from '~/composables/useApi';

definePageMeta({
  layout: 'auth',
  middleware: 'guest',
});

useSeoMeta({
  title: 'Create Account - BookHub',
  description:
    'Create your BookHub account to start discovering amazing books and building your personal library.',
  robots: 'noindex, nofollow',
});

const schema = z
  .object({
    name: z
      .string()
      .min(1, 'Name is required')
      .min(2, 'Name must be at least 2 characters')
      .max(50, 'Name must be less than 50 characters')
      .regex(/^[a-zA-Z\s]+$/, 'Name can only contain letters and spaces'),
    email: z
      .string()
      .min(1, 'Email is required')
      .email('Please enter a valid email address'),
    password: z
      .string()
      .min(1, 'Password is required')
      .min(8, 'Password must be at least 8 characters')
      .regex(/[A-Z]/, 'Password must contain at least one uppercase letter')
      .regex(/[a-z]/, 'Password must contain at least one lowercase letter')
      .regex(/[0-9]/, 'Password must contain at least one number')
      .regex(
        /[^A-Za-z0-9]/,
        'Password must contain at least one special character',
      ),
    confirmPassword: z.string().min(1, 'Please confirm your password'),
    terms: z
      .boolean()
      .refine(
        (val) => val === true,
        'You must accept the Terms of Service and Privacy Policy',
      ),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'Passwords do not match',
    path: ['confirmPassword'],
  });

type FormData = z.infer<typeof schema>;

const state = reactive<FormData>({
  name: '',
  email: '',
  password: '',
  confirmPassword: '',
  terms: false,
});

const loading = ref(false);
const error = ref('');

const { register } = useApi();
const toast = useToast();

async function onSubmit() {
  if (loading.value) return;

  error.value = '';
  loading.value = true;

  try {
    const response: RegisterResponse = await register({
      name: state.name.trim(),
      email: state.email.toLowerCase().trim(),
      password: state.password,
    });

    toast.add({
      title: 'Account Created Successfully!',
      description: 'Welcome to BookHub! Please sign in to continue.',
      color: 'success',
    });

    await navigateTo('/auth/login?message=account-created');
  } catch (err: any) {
    const errorMessage =
      err.message || 'Registration failed. Please try again.';
    error.value = errorMessage;

    toast.add({
      title: 'Registration Failed',
      description: errorMessage,
      color: 'error',
    });

    console.error('Registration failed:', err);
  } finally {
    loading.value = false;
  }
}
</script>
