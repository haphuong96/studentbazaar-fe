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
    if (e instanceof AxiosError) {
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
      const err = e.response?.data;
      if (e.response?.status === 400) {
        switch (err.fieldCode) {
          case "EMAIL_ADDRESS":
            signUpFormErr.value.emailAddress = err.errMessage;
            break;
          case "USERNAME":
            signUpFormErr.value.username = err.errMessage;
            break;
          case "PASSWORD":
            signUpFormErr.value.password = err.errMessage;
            break;
          case "FULLNAME":
            signUpFormErr.value.fullname = err.errMessage;
            break;
          default:
            console.log(e);
        }
      } else {
        message.error(err.message);
        console.log(e);
      }
    } else {
      console.log(e);
    }
  }
};
</script>

<template>
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
    <div class="pt-80">
      Already have an account? Click 
      <a
        type="link"
        @click="() => router.push({ name: routeNames.LOGIN })"
        >here</a
      > to login!
    </div>
  </div>
  <div v-else>
    <div class="pb-32">Your account details ...</div>
    <a-descriptions
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
        <div class="my-16"><b>Full Name</b></div>
        <a-input v-model:value="signUpForm.fullname" placeholder="Full Name" />
      </a-form-item>
      <a-form-item>
        <div class="my-16"><b>Username</b></div>
        <a-input
          v-model:value="signUpForm.username"
          placeholder="Username"
          @change="
            () => {
              if (signUpFormErr.username) signUpFormErr.username = undefined;
            }
          "
        />
        <div v-if="signUpFormErr.username" class="error-label">
          {{ signUpFormErr.username }}
        </div>
      </a-form-item>
      <a-form-item>
        <div class="my-16"><b>Password</b></div>
        <a-input-password
          v-model:value="signUpForm.password"
          placeholder="Password"
        />
      </a-form-item>
      <a-form-item>
        <div class="my-16">
          <a-button type="primary" html-type="submit" @click="register"
            >Register!</a-button
          >
        </div>
      </a-form-item>
    </a-form>
    <div class="d-flex justify-right">
      <a-button type="link" @click="goBackToCheckEmailAddress"
        ><arrow-left-outlined />Back</a-button
      >
    </div>
  </div>
</template>
<style></style>
