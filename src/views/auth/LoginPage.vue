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
      Don't have an account yet? <a @click="() => {router.push({name: routeNames.SIGNUP})}">Sign Up!</a>
    </div>
  </div>
</template>
<script lang="ts" setup>
import { ref } from "vue";
import { localStorageKeys } from "../../common/storage-keys";
import { AuthService } from "../../services/auth.service";
import { routeNames } from "../../router/route-names";
import router from "../../router";
import { AxiosError } from "axios";
import { LoginDto } from "../../interfaces/login.interface";

const loginDto = ref<LoginDto>({
  usernameOrEmail: "",
  password: "",
  remember: true,
});

const credentialsError = ref<string | undefined>(undefined);

const login = async () => {
  if (loginDto.value.usernameOrEmail && loginDto.value.password) {
    try {
      const data = await AuthService.login(loginDto.value);
      localStorage.setItem(localStorageKeys.ACCESS_TOKEN, data.accessToken);
      localStorage.setItem(localStorageKeys.REFRESH_TOKEN, data.refreshToken);
      localStorage.setItem(localStorageKeys.USER_FULLNAME, data.fullname);
      localStorage.setItem(localStorageKeys.USERNAME, data.username);
      router.push({ name: routeNames.MARKETPLACE });
      console.log("check error");
    } catch (err) {
      if (err instanceof AxiosError && err.response?.status === 401) {
        credentialsError.value =
          "Invalid username/email or password. Please try again.";
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