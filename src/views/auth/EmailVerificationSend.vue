<script setup lang="ts">
import { sessionStorageKeys } from "../../common/storage-keys";
import { computed, ComputedRef } from "vue";
import { AuthService } from "../../services/auth.service";
import { message } from "ant-design-vue";

const emailAddress: ComputedRef<string | null> = computed(() => {
  return sessionStorage.getItem(sessionStorageKeys.EMAIL_ADDRESS);
});

const resendVerificationEmail = async () => {
  await AuthService.resendVerificationEmail(emailAddress.value!);
  message.success("Verification email sent!");
};
</script>

<template>
  <div>
    <div>
      <h1>Check your email box!</h1>
      <p>
        We sent an account verification email to <b>{{ emailAddress }}</b
        >.
      </p>
      <p>
        Please click the link in the email in order to verify your account and
        continue. The link expires in 1 hour. If the link already expired,
        please click the button below to resend the verification email.
      </p>
      <p>You can close this page now.</p>
    </div>
    <div class="d-flex justify-right">
      <a-button type="link" @click="resendVerificationEmail"
        >Resend verification email</a-button
      >
    </div>
  </div>
</template>
<style></style>
