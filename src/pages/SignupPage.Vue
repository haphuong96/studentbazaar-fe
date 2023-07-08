<script setup lang="ts">
import { ref } from "vue";
import { AuthService } from "../services/auth.service";
import { AxiosError } from "axios";
import { message } from "ant-design-vue";
import { University } from "../interfaces/market.interface";

const inputEmail = ref<string>();
const inputEmailErr = ref();

const checkEmailAddress = async () => {
  try {
    const data: University = await AuthService.checkEmailAddress(
      inputEmail.value
    );

    message.success(`Valid email! University: ${data.universityName}`);
  } catch (e) {
    if (e instanceof AxiosError) {
      inputEmailErr.value = e.response?.data;
    } else {
      console.log(e);
    }
  }
};
</script>

<template>
  <h2>Sign Up</h2>
  <a-input
    v-model:value="inputEmail"
    @pressEnter="checkEmailAddress"
    @change="
      () => {
        if (inputEmailErr) inputEmailErr = undefined;
      }
    "
    placeholder="Your university email address"
  />
  <div v-if="inputEmailErr" class="error-label">
    {{ inputEmailErr.message }}
  </div>
</template>
