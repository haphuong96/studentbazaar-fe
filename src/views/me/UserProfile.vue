<template>
  <a-row>
    <a-col :span="20">
      <div class="d-flex">
        <img class="user-profile__avatar" />
        <div class="user-profile__info">
          <span class="user-profile__name">Ha Phuong Nguyen</span>
          <span class="user-profile__address">London, UK</span>
        </div>
      </div>
    </a-col>
    <a-col :span="4">
      <div class="d-flex">
        <a-button :icon="h(EllipsisOutlined)"></a-button>
      </div>
    </a-col>
  </a-row>
  <a-row class="py-16">
    <a-col :span="24">
      <a-button :icon="h(MailOutlined)">Send a message</a-button>
    </a-col>
  </a-row>
  <a-row class="py-16">
    Researchers built their models based on information gleaned from about 5,000
    verified public profiles on the site. These profiles were used to train the
    model to estimate the gender and age of a user with high accuracy, using
    their style of writing in comments and network activity. This enabled the
    models to accurately estimate the age and gender of users with unverified
    accounts, and spot misinformation. All details were anonymized to protect
    users' privacy.
  </a-row>
  <a-row class="py-16">
    <a-col :span="24" class="user-profile__address">Listed recently</a-col>
    <a-col :span="24">
      <div class="d-flex user-profile__items">
        <div class="user-profile__item">
          <ItemPost :item="mockItem"></ItemPost>
        </div>
        <div class="user-profile__item">
          <ItemPost :item="mockItem"></ItemPost>
        </div>
        <div class="user-profile__item">
          <ItemPost :item="mockItem"></ItemPost>
        </div>
        <div class="user-profile__item">
          <ItemPost :item="mockItem"></ItemPost>
        </div>
        <div class="user-profile__item">
          <ItemPost :item="mockItem"></ItemPost>
        </div>
        <div class="user-profile__item">
          <ItemPost :item="mockItem"></ItemPost>
        </div>
        <div class="user-profile__item">
          <ItemPost :item="mockItem"></ItemPost>
        </div>
      </div>
    </a-col>
  </a-row>
</template>
<script setup lang="ts">
import { h, ref, onMounted } from "vue";
import { MailOutlined, EllipsisOutlined } from "@ant-design/icons-vue";
import ItemPost from "../item/components/ItemPost.vue";
import { Item } from "../../interfaces/item.interface";
const mockItem = {
  id: 1,
  owner: false,
  status: "brand new",
  itemName: "Dell Vostro 3560",
  itemDescription: "Dell vostro 3560",
  img: [
    {
      thumbnailUrl:
        "https://www.zdnet.com/a/img/resize/dfb04d8df5f8a5148f56fc1334e24f727316bd49/2014/12/04/8e9dd161-7b52-11e4-9a74-d4ae52e95e57/vostro-3560-2.jpg?auto=webp&width=1280",
    },
  ],
};
</script>
<style>
.user-profile__avatar {
  width: 80px;
  height: 80px;
  background-color: lightgray;
  border-radius: 40px;
  margin-right: 32px;
}

.user-profile__info {
  display: grid;
}

.user-profile__name {
  font-size: 24px;
  font-weight: 700;
  color: black;
}

.user-profile__address {
  font-size: 16px;
  font-weight: 500;
  color: black;
}

.user-profile__items {
  overflow: scroll;
  -ms-overflow-style: none; /* IE and Edge */
  scrollbar-width: none; /* Firefox */
}

.user-profile__items::-webkit-scrollbar {
  display: none;
}

.user-profile__item {
  margin: 0 32px;
}
</style>
