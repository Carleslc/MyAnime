<template>
  <q-dialog v-model="authNeeded" persistent>
    <q-card style="min-width: 300px;">
      <q-form @submit="setPassword">
        <q-card-section class="row justify-between items-center">
          <div v-t="'login'" class="text-h5 text-bold" />
          <a :href="api.homeUrl" target="_blank">
            <q-avatar rounded size="lg">
              <img :src="api.image" />
            </q-avatar>
          </a>
        </q-card-section>

        <q-card-section class="q-pt-none">
          <div>
            {{ $t('loginDescription', { api: api.name }) }}
          </div>
        </q-card-section>

        <q-card-section class="q-pt-none column">
          <q-input
            v-model="username"
            dense
            :placeholder="$t('username')"
            :rules="[(val) => !isBlank(val) || $t('required', { field: $t('username').toLowerCase() })]"
          />
          <q-input
            v-model="password"
            dense
            autofocus
            type="password"
            :placeholder="$t('password')"
            :rules="[(val) => !isBlank(val) || $t('required', { field: $t('password').toLowerCase() })]"
          />
        </q-card-section>

        <q-card-section class="q-py-none text-grey-6">
          <span v-t="'notRegisteredYet'" class="q-mr-sm"></span>
          <a :href="api.registerUrl" target="_blank" class="link link-underline">{{ $t('registerHere') }}</a>
        </q-card-section>

        <q-card-section v-if="api.setPasswordUrl" class="q-pb-none text-italic text-grey-6">
          <i18n path="noPassword" :tag="false">
            <a :href="api.setPasswordUrl" target="_blank" class="link link-underline">{{ $t('accountSettings') }}</a>
          </i18n>
        </q-card-section>

        <q-card-actions align="right" class="text-primary">
          <q-btn v-if="!isLoading" v-close-popup flat color="grey" :label="$t('cancel')" />
          <q-btn flat color="primary" type="submit" :label="$t('login')" :disable="!isValid" :loading="isLoading" />
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
