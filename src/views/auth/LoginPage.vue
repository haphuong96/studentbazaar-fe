<template>
    <a-form
      :model="formState"
      name="basic"
      :label-col="{ span: 8 }"
      :wrapper-col="{ span: 16 }"
      autocomplete="off"
      @submit="login"
      @finishFailed="onFinishFailed"
    >
      <a-form-item
        label="Username"
        name="username"
        :rules="[{ required: true, message: 'Please input your username!' }]"
      >
        <a-input v-model:value="formState.usernameOrEmail" />
      </a-form-item>
  
      <a-form-item
        label="Password"
        name="password"
        :rules="[{ required: true, message: 'Please input your password!' }]"
      >
        <a-input-password v-model:value="formState.password" />
      </a-form-item>
  
      <a-form-item name="remember" :wrapper-col="{ offset: 8, span: 16 }">
        <a-checkbox v-model:checked="formState.remember">Remember me</a-checkbox>
      </a-form-item>
  
      <a-form-item :wrapper-col="{ offset: 8, span: 16 }">
        <a-button type="primary" html-type="submit">Submit</a-button>
      </a-form-item>
    </a-form>
  </template>
  <script lang="ts" setup>
  import { ref } from 'vue';
  import { localStorageKeys } from '../../common/local-storage-keys';
import { AuthService } from '../../services/auth.service';
  interface FormState {
    usernameOrEmail: string;
    password: string;
    remember: boolean;
  }
  
  const formState = ref<FormState>({
    usernameOrEmail: '',
    password: '',
    remember: true,
  });
//   const onFinish = (values: any) => {
//     localStorage.setItem(localStorageKeys.ACCESS_TOKEN, values.username);
//   };
  
  const onFinishFailed = (errorInfo: any) => {
    console.log('Failed:', errorInfo);
  };

  const login = async () => {
    try {
      const data = await AuthService.login(formState.value.usernameOrEmail, formState.value.password);
      localStorage.setItem(localStorageKeys.ACCESS_TOKEN, data.accessToken);
      localStorage.setItem(localStorageKeys.REFRESH_TOKEN, data.refreshToken);
    } catch (err) {
      console.log(err);
    }
  };
  </script>
  
  