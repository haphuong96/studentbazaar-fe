<template>
  <div class="login__container">
    <div class="login-form">
      <h2 style="text-align: center">Sign In</h2>
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
            size="large"
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
            size="large"
          />
        </a-form-item>

        <a-form-item name="remember">
          <a-checkbox v-model:checked="loginDto.remember"
            >Remember me</a-checkbox
          >
        </a-form-item>
        <a-button
          type="primary"
          html-type="submit"
          @click="login"
          size="large"
          class="login-form__login-button"
          >Submit</a-button
        >
      </a-form>
    </div>
    <div class="signup-form">
      <h2>Welcome back!</h2>
      <div style="text-align: center;">
        <!-- 🛒🛍️ 🛒👚 🛍️🛒 -->
        🌻🌻🌻🌻🌻🌻
        <!-- 🌳🌳🌳🌳🌳🌳 -->
      </div>
      <div class="mt-16" style="text-align: justify;">Sign in now and start selling your unused item.</div>

      <a-button
        class="mt-16"
        type="default"
        size="large"
        @click="
          () => {
            router.push({ name: routeNames.SIGNUP_ACCOUNT_DETAILS });
          }
        "
        >No account yet? Sign Up!</a-button
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
      console.log("auth ", socket.auth);
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
<style scoped>
.login__container {
  display: flex;
  justify-content: center;
  height: 100vh;
  padding-top: calc((100vh - 480px) * 0.2);
}

.login-form {
  border: 1px solid lightgray;
  padding: 32px;
  width: 360px;
  height: 480px;
  align-items: center;
}

.login-form__login-button {
  width: 100%;
}

.signup-form {
  border: 1px solid lightgray;
  padding: 32px;
  width: 360px;
  height: 480px;
  background-image: linear-gradient(to bottom right, #369eff, #5aafff);
  display: flex;
  flex-direction: column;
  justify-content: center;
  color: white;
}

.signup-form > h2 {
  text-align: center;
  color: white;
}
</style>
