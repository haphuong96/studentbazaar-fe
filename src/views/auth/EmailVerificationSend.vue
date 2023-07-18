<script setup lang="ts">
import { localStorageKeys } from "../../common/local-storage-keys";
import { ref, Ref, computed, ComputedRef } from "vue";

const emailAddress: ComputedRef<string | null> = computed(() => {
  return localStorage.getItem(localStorageKeys.EMAIL_ADDRESS);
});
</script>

<template>
  <div>
    <h1>Check your email box!</h1>
    <p>We sent an account verification email to {{ emailAddress }}.</p>
    <p>
      Please click the link in the email in order to verify your account and
      continue. The link expires in 1 hour. If the link already expired, please
      click the button below to resend the verification email.
    </p>
    <p>You can close this page now.</p>
  </div>
  <div class="d-flex justify-right">
    <a-button type="link">Resend verification email</a-button>
  </div>
</template>
<style></style>
