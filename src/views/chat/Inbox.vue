<script setup lang="ts">
// import ChatBox from './components/ChatBox.vue';
import { computed, ref } from "vue";
import { socket, state } from "../../socket";
import User from "./components/User.vue";
import MessagePanel from "./components/MessagePanel.vue";

const connected = computed(() => state.value.connected);
const displayUsers = ref();
const selectedUser = ref();

const onSelectUser = (user: any) => {
  selectedUser.value = user;
};

socket.on("users", (users) => {
  console.log("inside users event");
  // find me
  users.forEach((user: any) => {
    user.self = user.userID === socket.id;
    user.messages = [];
  });

  displayUsers.value = users;
  console.log('users', users)
  console.log('displayUsers', displayUsers.value);
});

socket.on("message", ({message, from}) => {
  console.log({message, from})
  displayUsers.value.forEach((user: any) => {
    if (user.userID === from) {
      user.messages.push({
        message,
        fromSelf: false,
      });
    }
  });
  console.log('users ', displayUsers.value)
});

const onSend = (input: any) => {
  if (selectedUser.value) {
    socket.emit("message", {
      to: selectedUser.value.userID,
      message: input,
    });
  }
  selectedUser.value.messages.push({
    message: input,
    fromSelf: true,
  });
};

</script>

<template>
  <h2>Inbox</h2>
  <div class="d-flex">
    <div class="left-panel">
      <User
        v-for="user in displayUsers"
        :key="user.userID"
        :user="user"
        :selected="selectedUser === user"
        @select="onSelectUser(user)"
      />
    </div>
    <div class="right-panel">
      <MessagePanel :user="selectedUser" @input="onSend" />
    </div>
  </div>
</template>
<style>
.messages {
  background-color: bisque;
  flex-grow: 1;
  overflow: auto;
  padding: 1rem;
}

.left-panel {
  /* position: fixed; */
  /* left: 0;
  top: 0;
  bottom: 0;
  width: 260px; */
  width: 30%;
  overflow-x: hidden;
  background-color: #3f0e40;
  color: white;
}

.right-panel {
  /* margin-left: 260px; */
  width: 70%;
}
</style>
