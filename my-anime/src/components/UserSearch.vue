<template>
  <q-form @submit="searchUserInput">
    <q-input v-model="input" dark dense standout placeholder="Username" class="user-search">
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
          :flat="username === input || !filled"
          :loading="isLoading"
          :disabled="!filled"
          icon="search"
          type="submit"
          @click="searchUserInput"
        />
      </template>
    </q-input>
  </q-form>
</template>

<script>
import { mapState, mapGetters, mapMutations, mapActions } from 'vuex';

export default {
  data() {
    return {
      input: '',
    };
  },
  computed: {
    ...mapState('store', ['username']),
    ...mapGetters('store', ['isLoading']),
    filled() {
      return this.input.length > 0;
    },
  },
  created() {
    if (this.username) {
      this.input = this.username;
      this.searchUserInput();
    }
    this.loaded();
  },
  methods: {
    ...mapMutations('store', ['loaded']),
    ...mapActions('store', ['searchUser']),
    searchUserInput() {
      this.searchUser(this.input);
    },
  },
};
</script>
