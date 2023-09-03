<template>
  <div class="p-80 d-flex flex-col align-center login__container">
    <h2>Login</h2>
    <div v-if="credentialsError" class="error-label">
      {{ credentialsError }}
    </div>
    <a-form layout="vertical" :model="loginDto">
      <a-form-item label="Username or email" name="Username or email">
        <a-input
          v-model:value="loginDto.usernameOrEmail"
          @change="
            () => {
              if (credentialsError) credentialsError = undefined;
            }
          "
        />
      </a-form-item>

      <a-form-item label="Password" name="Password">
        <a-input-password
          v-model:value="loginDto.password"
          @change="
            () => {
              if (credentialsError) credentialsError = undefined;
            }
          "
        />
      </a-form-item>

      <a-form-item name="remember">
        <a-checkbox v-model:checked="loginDto.remember">Remember me</a-checkbox>
      </a-form-item>

      <a-form-item>
        <a-button type="primary" html-type="submit" @click="login"
          >Submit</a-button
        >
      </a-form-item>
    </a-form>
    <div>
      Don't have an account yet?
      <a
        @click="
          () => {
            router.push({ name: routeNames.SIGNUP_ACCOUNT_DETAILS });
          }
        "
        >Sign Up!</a
      >
    </div>
  </div>
</template>
<script lang="ts" setup>
import { ref } from "vue";
import {
  localStorageKeys,
  sessionStorageKeys,
} from "../../common/storage-keys";
import { UserService } from "../../services/user.service";
import { routeNames } from "../../router/route-names";
import router from "../../router";
import { AxiosError } from "axios";
import { LoginDto } from "../../interfaces/login.interface";
import { AuthService } from "../../services/auth.service";
import { socket } from "../../socket";
import { User } from "../../interfaces/user.interface";

const loginDto = ref<LoginDto>({
  usernameOrEmail: "",
  password: "",
  remember: true,
});

const credentialsError = ref<string | undefined>(undefined);

const login = async () => {
  if (loginDto.value.usernameOrEmail && loginDto.value.password) {
    try {
      await AuthService.login(loginDto.value);

      // get user info and store in local storage
      const user: User = await UserService.getMyProfile();
      if (user.campus && user.university) {
        localStorage.setItem(
          localStorageKeys.USER_SEARCH_CAMPUS_LOCATION,
          user.campus.id.toString()
        );
        localStorage.setItem(
          localStorageKeys.USER_SEARCH_UNIVERSITY,
          user.university.id.toString()
        );
      }
      // login successfully, connect to socket
      console.log('auth ',socket.auth);
      socket.connect();

      router.push({ name: routeNames.MARKETPLACE_HOME });
    } catch (err) {
      if (err instanceof AxiosError) {
        if (err.response?.status === 401) {
          credentialsError.value =
            "Invalid username/email or password. Please try again.";
        } else if (err.response?.status === 403) {
          const emailAddress: string = err.response?.data.data.emailAddress;
          sessionStorage.setItem(
            sessionStorageKeys.EMAIL_ADDRESS,
            emailAddress
          );
          router.push({ name: routeNames.EMAIL_VERIFICATION_SEND });
        }
      } else {
        console.log(err);
      }
    }
  }
};
</script>
<style>
/* .login__container { */
/* min-width: 450px;
  max-width: 50%; */
/* } */
</style>
