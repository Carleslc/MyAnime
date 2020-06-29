<template>
  <a v-if="icon" :href="url" target="_blank">
    <q-avatar v-if="icon" :size="size">
      <img :src="picture" />
    </q-avatar>
  </a>
  <q-item v-else v-ripple tag="a" :href="url" target="_blank">
    <q-item-section avatar>
      <q-avatar :size="size">
        <img :src="picture" />
      </q-avatar>
    </q-item-section>
    <q-item-section>
      <q-item-label class="text-h5">{{ username || api.name }}</q-item-label>
    </q-item-section>
  </q-item>
</template>

<script>
import { mapState } from 'vuex';

export default {
  props: {
    size: {
      type: String,
      default: '56px',
    },
    icon: {
      type: Boolean,
      default: false,
    },
  },
  computed: {
    ...mapState('store', ['api', 'username', 'picture']),
    url() {
      return this.api.getUserProfileUrl(this.username);
    },
  }
};
</script>
