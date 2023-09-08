<template>
  <h2>{{ myProfile?.username }}</h2>
  <a-divider></a-divider>
  <a-form
    layout="horizontal"
    :model="formState"
    :labelCol="{ span: 4 }"
    labelAlign="left"
    v-if="!isLoading"
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
    <a-form-item label="Default Pick Up Location">
      <SelectPickUpPointModal
        :deliveryLocationSelect="formState.defaultPickUpPoint"
        @onSelect="onSelectPickUpPoint"
      ></SelectPickUpPointModal>
    </a-form-item>
    <a-form-item>
      <!-- :wrapper-col="buttonItemLayout.wrapperCol" -->
      <a-button type="primary" @click="updateMyProfile" :disabled="isNoChange"
        >Update Profile</a-button
      >
    </a-form-item>
  </a-form>
</template>
<script setup lang="ts">
import { ref, onMounted, Ref, computed } from "vue";
import { UserService } from "../../services/user.service";
import { User } from "../../interfaces/user.interface";
import { Campus, PickUpLocation } from "../../interfaces/market.interface";
import { message } from "ant-design-vue";
import SelectPickUpPointModal from "../item/components/SelectPickUpPointModal.vue";

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
      defaultPickUpPointId: formState.value.defaultPickUpPoint?.id,
    });
    onEditMode();

    message.success("Profile updated successfully");
  } catch (err) {
    console.log(err);
  }
};

const onEditMode = () => {
  formState.value.emailAddress = myProfile.value?.emailAddress;
  formState.value.campusId = myProfile.value?.campus?.id;
  formState.value.fullName = myProfile.value?.fullname;
  formState.value.aboutMe = myProfile.value?.aboutMe;
  formState.value.defaultPickUpPoint = myProfile.value?.defaultPickUpPoint;
};

const isLoading = ref<boolean>(true);
onMounted(async () => {
  await getMyProfile();
  onEditMode();
  isLoading.value = false;
});

const onSelectPickUpPoint = (pickUpPoint: PickUpLocation) => {
  formState.value.defaultPickUpPoint = pickUpPoint;
};

const isNoChange = computed<boolean>(() => {
  return (
    formState.value.fullName === myProfile.value?.fullname &&
    formState.value.campusId === myProfile.value?.campus?.id &&
    formState.value.aboutMe === myProfile.value?.aboutMe &&
    formState.value.defaultPickUpPoint === myProfile.value?.defaultPickUpPoint
  );
})

interface FormState {
  fullName: string | undefined;
  fieldB: string;
  emailAddress: string | undefined;
  campusId: number | undefined;
  aboutMe: string | undefined;
  defaultPickUpPoint: PickUpLocation | undefined;
}

const formState: Ref<FormState> = ref({
  layout: "horizontal",
  fieldB: "",
  fullName: "",
  emailAddress: "",
  campusId: undefined,
  aboutMe: "",
  defaultPickUpPoint: undefined,
});
</script>
<style></style>
