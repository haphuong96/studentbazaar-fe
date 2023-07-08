<script setup lang="ts">
import { ref } from 'vue';
import { axiosInstance } from '../services/base.service';

const emailAddress = ref<string>();

const checkEmailAddress = async() => {
    const data = axiosInstance.get('signup', {
        params: {
            email: emailAddress.value
        }
    });

    console.log(data);
}
</script>
<template>
    <h2>Sign Up</h2>
    <a-input v-model:value="emailAddress" @pressEnter="checkEmailAddress" placeholder="Your university email address" />
</template>