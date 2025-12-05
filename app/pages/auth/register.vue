<template>
  <UCard>
    <template #header>
      <h2 class="text-2xl font-bold text-center">Create Account</h2>
      <p class="text-gray-600 text-center mt-2">Join BookHub today</p>
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
      <UFormGroup label="Full Name" name="name" required>
        <UInput
          v-model="state.name"
          placeholder="Enter your full name"
          icon="i-heroicons-user"
          :disabled="loading"
          autocomplete="name"
        />
      </UFormGroup>

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
          placeholder="Create a password (min. 6 characters)"
          icon="i-heroicons-lock-closed"
          :disabled="loading"
          autocomplete="new-password"
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
        />
      </UFormGroup>

      <UCheckbox
        v-model="state.terms"
        label="I agree to the Terms of Service and Privacy Policy"
        required
        :disabled="loading"
      />

      <UButton type="submit" block :loading="loading" size="lg">
        Create Account
      </UButton>
    </UForm>

    <template #footer>
      <div class="text-center">
        <p class="text-gray-600">
          Already have an account?
          <NuxtLink
            to="/auth/login"
            class="text-blue-600 hover:underline font-medium"
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

definePageMeta({
  layout: 'auth',
  middleware: 'guest',
});

useSeoMeta({
  title: 'Register',
  description:
    'Create your BookHub account to start discovering amazing books and building your personal library.',
  robots: 'noindex, nofollow',
});

const schema = z
  .object({
    name: z
      .string()
      .min(2, 'Name must be at least 2 characters')
      .max(50, 'Name is too long'),
    email: z.string().email('Invalid email address'),
    password: z
      .string()
      .min(6, 'Password must be at least 6 characters')
      .regex(/[A-Z]/, 'Password must contain at least one uppercase letter')
      .regex(/[a-z]/, 'Password must contain at least one lowercase letter')
      .regex(/[0-9]/, 'Password must contain at least one number'),
    confirmPassword: z.string(),
    terms: z
      .boolean()
      .refine(
        (val) => val === true,
        'You must accept the terms and conditions',
      ),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ['confirmPassword'],
  });

const state = reactive({
  name: '',
  email: '',
  password: '',
  confirmPassword: '',
  terms: false,
});

const loading = ref(false);
const error = ref('');

const { register } = useApi();

async function onSubmit() {
  error.value = '';
  loading.value = true;

  try {
    const response = await register({
      name: state.name,
      email: state.email,
      password: state.password,
    });

    // Show success message
    const toast = useToast();
    toast.add({
      title: 'Account created!',
      description:
        'Your account has been created successfully. Please sign in.',
      color: 'green',
    });

    // Redirect to login page
    await navigateTo('/auth/login');
  } catch (err: any) {
    error.value = err.message || 'Registration failed. Please try again.';
    console.error('Registration failed:', err);
  } finally {
    loading.value = false;
  }
}
</script>
