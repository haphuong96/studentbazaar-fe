<script setup lang="ts">
import { useRoute } from "vue-router";
import { ref, Ref } from "vue";
import { RouteLocationNormalizedLoaded } from "vue-router";
import { AuthService } from "../../services/auth.service";
import { onMounted } from "vue";
import router from "../../router";
import { routeNames } from "../../router/route-names";
import { AxiosError } from "axios";

const route: RouteLocationNormalizedLoaded = useRoute();
const emailToken: any = route.query.token;
const isVerifiedSuccess: Ref<boolean> = ref<boolean>(false);
const isLoading: Ref<boolean> = ref<boolean>(false);
const isError: Ref<boolean> = ref<boolean>(false);

const verifyEmailToken = async () => {
  console.log(emailToken);
  isLoading.value = true;
  try {
    await AuthService.verifyEmailToken(emailToken);
    isVerifiedSuccess.value = true;
  } catch (e) {
    if (e instanceof AxiosError && e.response?.status === 403) {
      isVerifiedSuccess.value = false;
    } else {
      isError.value = true;
    }
  } finally {
    isLoading.value = false;
  }
};

onMounted(async () => {
  await verifyEmailToken();
});
</script>

<template>
  <a-spin v-if="isLoading" size="large" />
  <div v-else>
    <div class="p-80" v-if="isVerifiedSuccess">
      <h1>Email verification successful!</h1>
      <p>
        You are now a member of the Student Bazaar community.
        <a @click="() => router.push({name: routeNames.LOGIN})"
          >Login to your account now!</a
        >
      </p>
    </div>
    <div class="p-80" v-else-if="!isVerifiedSuccess">
      <a-result status="warning" title="Invalid token."></a-result>
    </div>
    <div class="p-80" v-else>
      <a-result status="error" title="Something went wrong."></a-result>
    </div>
  </div>
</template>
<style></style>
