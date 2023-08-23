<template>
  <div
    class="d-flex link"
    @click="
      () =>
        router.push({
          name: routeNames.USER_PROFILE,
          params: { userId: user.id },
        })
    "
  >
    <a-avatar v-if="showAvatar"></a-avatar>
    <div :class="showAvatar ? `pl-${space}` : ''">
      <div>
        {{ user.username }}
      </div>
      <div v-if="showUniversity">
        {{ user.university?.universityName }}
      </div>
      <div v-if="showCampus">
        {{ user.campus?.campusName }}
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { User } from "../../../interfaces/user.interface";
import router from "../../../router";
import { routeNames } from "../../../router/route-names";

defineProps({
  user: {
    type: Object as () => User,
    required: true,
  },
  showAvatar: {
    type: Boolean,
    default: true,
  },
  showUniversity: {
    type: Boolean,
    default: true,
  },
  showCampus: {
    type: Boolean,
    default: false,
  },
  space: {
    type: Number,
    default: 16,
  },
});
</script>
<style lang="css" scoped></style>
