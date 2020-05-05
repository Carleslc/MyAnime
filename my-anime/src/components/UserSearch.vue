<template>
  <q-form @submit="searchUser">
    <q-input v-model="username" dark dense standout placeholder="Username" class="user-search">
      <template v-slot:prepend>
        <span class="prefix">@</span>
        <q-tooltip
          anchor="center right"
          self="center left"
          transition-show="fade"
          transition-hide="fade"
          :offset="[0, 0]"
        >
          https://myanimelist.net/profile/
        </q-tooltip>
      </template>
      <template v-slot:append>
        <q-btn
          :flat="searched === username || !filled"
          :loading="searching"
          :disabled="!filled"
          icon="search"
          type="submit"
          @click="searchUser"
        />
      </template>
    </q-input>
  </q-form>
</template>

<script>
export default {
  data() {
    return {
      username: '',
      searching: false,
      searched: '',
    };
  },
  computed: {
    filled() {
      return this.username.length > 0;
    },
  },
  methods: {
    searchUser() {
      if (this.$router.name !== 'home') {
        this.$router.push({ name: 'home' });
      }
      this.searched = this.username;
      this.searching = true;
      alert(this.username);
      this.searching = false;
    },
  },
};
</script>
