<script setup lang="ts">
import { ref, Ref } from "vue";
import { onMounted } from "vue";
import { UserService } from "../../services/user.service";
import { Campus, University } from "../../interfaces/market.interface";
import router from "../../router";
import { routeNames } from "../../router/route-names";
import { localStorageKeys } from "../../common/storage-keys";

const welcome = ref<{ university: string; campuses: Campus[] | undefined }>({
  university: "",
  campuses: undefined,
});

const selectCampus: Ref<number | undefined> = ref<number>();

const getUniversity = async () => {
  try {
    const university: University = await UserService.getMyUniversity();

    welcome.value.university = university.universityName;
    welcome.value.campuses = university.campuses;
    selectCampus.value = university.campuses[0].id;
  } catch (e) {
    console.log(e);
  }
};

const activateUser = async () => {
  try {
    const [user, _isActivatedSuccess] = await Promise.all([
      UserService.updateMyProfile({
        campusId: selectCampus.value,
      }),
      UserService.activateUser(),
    ]);

    // store user default search in local storage
    localStorage.setItem(
      localStorageKeys.USER_SEARCH_CAMPUS_LOCATION,
      user.campus.id.toString()
    );
    localStorage.setItem(
      localStorageKeys.USER_SEARCH_UNIVERSITY,
      user.university.id.toString()
    );
    // redirect to marketplace home
    router.push({ name: routeNames.MARKETPLACE_HOME });
  } catch (e) {
    console.log(e);
  }
};

onMounted(async () => {
  await getUniversity();
  console.log(welcome.value.campuses);
});
</script>

<template>
  <div class="welcome-container" v-if="welcome.university && welcome.campuses">
    <h1>Welcome to Student Bazaar!</h1>
    <a-descriptions
      :labelStyle="{ 'font-weight': 'bold' }"
      layout="vertical"
      :colon="false"
    >
      <a-descriptions-item label="University" span="2">{{
        welcome.university
      }}</a-descriptions-item>
    </a-descriptions>
    <div class="my-16">Select your campus to find your suitable market:</div>
    <a-select ref="select" v-model:value="selectCampus" style="width: 120px">
      <!-- @focus="focus"
      @change="handleChange" -->
      <a-select-option v-for="campus in welcome.campuses" :value="campus.id">{{
        campus.campusName
      }}</a-select-option>
    </a-select>
    <div class="d-flex justify-right">
      <a-button @click="activateUser">Let's get started!</a-button>
    </div>
  </div>
</template>
<style>
.welcome-container {
  margin: 80px 80px;
  width: 50%;
  padding: 24px;
  border: 1px solid #f0f0f0;
  border-radius: 2px;
  background-color: #fff;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.09);
}
</style>
