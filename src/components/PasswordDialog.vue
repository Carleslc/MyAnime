<template>
  <q-dialog v-model="authNeeded" persistent>
    <q-card style="min-width: 300px;">
      <q-form @submit="setPassword">
        <q-card-section class="row justify-between items-center">
          <div class="text-h5 text-bold">Log In</div>
          <a :href="api.homeUrl" target="_blank">
            <q-avatar rounded size="lg">
              <img :src="api.image" />
            </q-avatar>
          </a>
        </q-card-section>

        <q-card-section class="q-pt-none">
          <div>
            Please, log in to your {{ api.name }} account to view your anime list and update episodes directly within
            this page.
          </div>
        </q-card-section>

        <q-card-section class="q-pt-none column">
          <q-input
            v-model="username"
            dense
            placeholder="Username"
            :rules="[(val) => !isBlank(val) || 'Username is required']"
          />
          <q-input
            v-model="password"
            dense
            autofocus
            placeholder="Password"
            type="password"
            :rules="[(val) => !isBlank(val) || 'Password is required']"
          />
        </q-card-section>

        <q-card-section class="q-py-none text-grey-6">
          <span class="q-mr-sm">Not registered yet?</span>
          <a :href="api.registerUrl" target="_blank">Register here</a>
        </q-card-section>

        <q-card-section v-if="api.setPasswordUrl" class="q-pb-none text-italic text-grey-6">
          If your account has no password because it uses social media login like Facebook, Twitter or Google go to your
          <a :href="api.setPasswordUrl" target="_blank">Account Settings</a>
          and set a password for your account first.
        </q-card-section>

        <q-card-actions align="right" class="text-primary">
          <q-btn v-if="!isLoading" v-close-popup flat color="grey" label="Cancel" />
          <q-btn flat color="primary" label="Search" type="submit" :disable="!isValid" :loading="isLoading" />
        </q-card-actions>
      </q-form>
    </q-card>
  </q-dialog>
</template>

<script>
import { isBlank, trim } from '@/utils/strings';
import { mapState, mapGetters, mapActions, mapMutations } from 'vuex';
import { mapFields } from 'vuex-map-fields';

export default {
  data() {
    return {
      username: '',
      password: '',
    };
  },
  computed: {
    ...mapState('store', {
      currentUsername: (state) => state.username,
    }),
    ...mapState('store', ['api']),
    ...mapFields('store', ['authNeeded']),
    ...mapGetters('store', ['isLoading']),
    isValid() {
      return !isBlank(this.password) && !isBlank(this.username);
    },
  },
  watch: {
    currentUsername() {
      this.username = this.currentUsername;
      this.password = '';
    },
  },
  created() {
    this.username = this.currentUsername;
  },
  methods: {
    ...mapActions('store', ['login', 'searchUser']),
    ...mapMutations('store', ['setAuthNeeded']),
    isBlank,
    setPassword() {
      const username = trim(this.username);
      this.login({
        username,
        password: this.password,
      })
        .then(() => {
          this.searchUser(username);
        })
        .finally(() => {
          this.setAuthNeeded(false);
        });
    },
  },
};
</script>
