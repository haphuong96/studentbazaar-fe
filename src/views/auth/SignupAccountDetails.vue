<script setup lang="ts">
import { ref, Ref } from "vue";
import { AuthService } from "../../services/auth.service";
import { AxiosError } from "axios";
import { message } from "ant-design-vue";
import { University } from "../../interfaces/market.interface";
import { EmailValidation } from "../../interfaces/email.interface";
import { SignUpDto, SignUpDtoErr } from "../../interfaces/signup.interface";
import { ArrowRightOutlined, ArrowLeftOutlined } from "@ant-design/icons-vue";
import router from "../../router";
import { routeNames } from "../../router/route-names";
import { sessionStorageKeys } from "../../common/storage-keys";
import { ErrorCode } from "../../common/error-code";

const emailValidation = ref<EmailValidation>({
  isVerified: false,
  universityVerified: "",
  inputEmail: "",
  inputEmailErr: undefined,
});

const signUpForm: Ref<SignUpDto> = ref<SignUpDto>({
  emailAddress: "",
  username: "",
  password: "",
  fullname: "",
});

const signUpFormErr: Ref<SignUpDtoErr> = ref<SignUpDtoErr>({
  emailAddress: undefined,
  username: undefined,
  password: undefined,
  fullname: undefined,
});

const checkEmailAddress = async () => {
  try {
    const data: University = await AuthService.checkEmailAddress(
      emailValidation.value.inputEmail
    );

    emailValidation.value.isVerified = true;
    emailValidation.value.universityVerified = data.universityName;
    signUpForm.value.emailAddress = emailValidation.value.inputEmail;
    message.success(`Valid email!`);
  } catch (e) {
    if (e instanceof AxiosError && e.response?.status === 403) {
      emailValidation.value.inputEmailErr = e.response?.data;
    } else {
      console.log(e);
    }
  }
};

const onEmailValidationSubmit = async () => {
  if (emailValidation.value.inputEmail) {
    checkEmailAddress();
  }
};

const goBackToCheckEmailAddress = () => {
  emailValidation.value.isVerified = false;
  emailValidation.value.universityVerified = "";
  emailValidation.value.inputEmailErr = undefined;
};

const register = async () => {
  try {
    const newUser = await AuthService.register(signUpForm.value);
    sessionStorage.setItem(
      sessionStorageKeys.EMAIL_ADDRESS,
      newUser.emailAddress
    );
    router.push({ name: routeNames.EMAIL_VERIFICATION_SEND });
    message.success(`Registered successfully!`);
  } catch (e) {
    if (e instanceof AxiosError) {
      const err = e.response;
      if (err?.status === 403) {
        switch (err.data.errorCode) {
          case ErrorCode.FORBIDDEN_INVALID_USERNAME:
            signUpFormErr.value.username = err.data.message;
            console.log("signUpFormErr ", signUpFormErr.value);
            break;
          default:
            console.log(e);
        }
      }
    } else {
      console.log(e);
    }
  }
};
</script>

<template>
  <div class="signup-form">
    <h2>Sign Up</h2>
    <div v-if="!emailValidation.isVerified">
      <div class="pb-32">Enter your university email address</div>
      <a-input-search
        v-model:value="emailValidation.inputEmail"
        placeholder="Your university email address"
        size="large"
        @search="onEmailValidationSubmit"
        @pressEnter="onEmailValidationSubmit"
        @change="
          () => {
            if (emailValidation.inputEmailErr)
              emailValidation.inputEmailErr = undefined;
          }
        "
      >
        <template #enterButton>
          <a-button><arrow-right-outlined /></a-button>
        </template>
      </a-input-search>

      <!-- <a-input
      v-model:value="emailValidation.inputEmail"
      @pressEnter="onSubmit"
      @change="
        () => {
          if (emailValidation.inputEmailErr) emailValidation.inputEmailErr = undefined;
        }
      "
      placeholder="Your university email address"
    /> -->
      <div v-if="emailValidation.inputEmailErr" class="error-label">
        {{ emailValidation.inputEmailErr.message }}
      </div>
      <div class="my-32">
        Already have an account? Click
        <a type="link" @click="() => router.push({ name: routeNames.LOGIN })"
          >here</a
        >
        to sign in!
      </div>
    </div>
    <div v-else>
      <div>Your account details ...</div>
      <a-descriptions
        class="mt-32"
        :labelStyle="{ 'font-weight': 'bold' }"
        layout="vertical"
        :colon="false"
      >
        <a-descriptions-item label="Email Address" span="2">{{
          emailValidation.inputEmail
        }}</a-descriptions-item>
        <a-descriptions-item label="University" span="2">{{
          emailValidation.universityVerified
        }}</a-descriptions-item>
      </a-descriptions>

      <a-form
        :labelStyle="{ 'font-weight': 'bold' }"
        layout="vertical"
        :model="signUpForm"
      >
        <a-form-item>
          <div class="mt-16 mb-8"><b>Full Name</b></div>
          <a-input
            v-model:value="signUpForm.fullname"
            placeholder="Full Name"
            size="large"
          />
        </a-form-item>
        <a-form-item>
          <div class="mt-16 mb-8"><b>Username</b></div>
          <a-input
            v-model:value="signUpForm.username"
            placeholder="Username"
            @change="
              () => {
                if (signUpFormErr.username) signUpFormErr.username = undefined;
              }
            "
            size="large"
          />
          <div v-if="signUpFormErr.username" class="error-label">
            {{ signUpFormErr.username }}
          </div>
        </a-form-item>
        <a-form-item>
          <div class="mt-16 mb-8"><b>Password</b></div>
          <a-input-password
            v-model:value="signUpForm.password"
            placeholder="Password"
            size="large"
          />
        </a-form-item>
        <a-button
          class="mt-16"
          type="primary"
          html-type="submit"
          @click="register"
          style="width: 100%"
          size="large"
          >Register!</a-button
        >
      </a-form>
      <div class="d-flex justify-right mt-16">
        <a-button type="link" @click="goBackToCheckEmailAddress"
          ><arrow-left-outlined />Back</a-button
        >
      </div>
    </div>
  </div>
</template>
<style scoped>
.signup-form {
  border: 1px solid lightgray;
  padding: 32px 32px 32px 32px;
  width: 360px;
  height: fit-content;
  align-items: center;
  width: 40%;
}
</style>
