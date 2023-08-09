<template>
  <h2>{{ myProfile?.username }}</h2>
  <a-divider></a-divider>
  <a-form
    layout="horizontal"
    :model="formState"
    :labelCol="{ span: 4 }"
    labelAlign="left"
  >
    <a-form-item label="Email Address">
      <div>{{ formState.emailAddress }}</div>
      <!-- <a-input v-model:value="formState.emailAddress" disabled /> -->
    </a-form-item>
    <a-form-item label="Full Name">
      <a-input v-model:value="formState.fullName" placeholder="Full name" />
    </a-form-item>
    <a-form-item label="About You">
      <a-textarea
        v-model:value="formState.aboutMe"
        placeholder="Write some description about you"
      />
    </a-form-item>
    <a-form-item label="Campus">
      <a-select
        ref="select"
        v-model:value="formState.campusId"
        style="width: 120px"
      >
        <a-select-option v-for="campus in campuses" :value="campus.id">{{
          campus.campusName
        }}</a-select-option>
      </a-select>
    </a-form-item>
    <a-form-item>
      <!-- :wrapper-col="buttonItemLayout.wrapperCol" -->
      <a-button type="primary" @click="updateMyProfile"
        >Update Profile</a-button
      >
    </a-form-item>
  </a-form>
</template>
<script setup lang="ts">
import { ref, onMounted, Ref } from "vue";
import { UserService } from "../../services/user.service";
import { User } from "../../interfaces/user.interface";
import { Campus } from "../../interfaces/market.interface";
import { message } from "ant-design-vue";

const myProfile = ref<User>();
const campuses = ref<Campus[]>([]);

const getMyProfile = async () => {
  try {
    myProfile.value = await UserService.getMyProfile();
    campuses.value = myProfile.value.university.campuses;
  } catch (err) {
    console.log(err);
  }
};

const updateMyProfile = async () => {
  try {
    myProfile.value = await UserService.updateMyProfile({
      fullname: formState.value.fullName,
      campusId: formState.value.campusId,
      aboutMe: formState.value.aboutMe,
    });
    onEditMode();

    message.success("Profile updated successfully");
  } catch (err) {
    console.log(err);
  }
};

const onEditMode = () => {
  formState.value.emailAddress = myProfile.value?.emailAddress;
  formState.value.campusId = myProfile.value?.campus.id;
  formState.value.fullName = myProfile.value?.fullname;
  formState.value.aboutMe = myProfile.value?.aboutMe;
};

onMounted(async () => {
  await getMyProfile();
  onEditMode();
});

interface FormState {
  fullName: string | undefined;
  fieldB: string;
  emailAddress: string | undefined;
  campusId: number | undefined;
  aboutMe: string | undefined;
}

const formState: Ref<FormState> = ref({
  layout: "horizontal",
  fieldB: "",
  fullName: undefined,
  emailAddress: "",
  campusId: undefined,
  aboutMe: undefined,
});
</script>
<style></style>
