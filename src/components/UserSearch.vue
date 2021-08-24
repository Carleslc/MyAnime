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
          {{ api.profileUrl }}
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
    <password-dialog />
  </q-form>
</template>

<script>
import { isBlank, trim } from '@/utils/strings';
import { mapState, mapGetters, mapActions } from 'vuex';

export default {
  data() {
    return {
      input: '',
    };
  },
  computed: {
    ...mapState('store', ['username', 'api']),
    ...mapGetters('store', ['isLoading', 'hasUsername']),
    filled() {
      return !isBlank(this.input);
    },
  },
  watch: {
    username() {
      if (this.username !== this.input) {
        this.input = this.username;
      }
    },
  },
  created() {
    if (this.hasUsername) {
      this.input = this.username;
      this.searchUserInput();
    }
  },
  methods: {
    ...mapActions('store', ['searchUser']),
    searchUserInput() {
      this.searchUser(trim(this.input));
    },
  },
};
</script>
