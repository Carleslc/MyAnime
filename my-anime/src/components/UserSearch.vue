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
import bind from '@/mixins/bind';

export default {
  mixins: [bind('searched', String)],
  data() {
    return {
      username: this.value,
      searching: false,
    };
  },
  computed: {
    filled() {
      return this.username.length > 0;
    },
  },
  methods: {
    searchUser() {
      this.searched = this.username;
      this.searching = true;
      // TODO: GET animes & Update animes in vuex store
      this.searching = false;
    },
  },
};
</script>
