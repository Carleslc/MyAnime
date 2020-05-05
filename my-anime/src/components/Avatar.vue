<template>
  <a v-if="icon" :href="url" target="_blank">
    <q-avatar v-if="icon" :size="size">
      <img :src="image" />
    </q-avatar>
  </a>
  <q-item v-else v-ripple tag="a" :href="url" target="_blank">
    <q-item-section avatar>
      <q-avatar :size="size">
        <img :src="image" />
      </q-avatar>
    </q-item-section>
    <q-item-section>
      <q-item-label class="text-h5">{{ username || 'MyAnimeList' }}</q-item-label>
    </q-item-section>
  </q-item>
</template>

<script>
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
  data() {
    return {
      image: 'statics/mal.jpg',
      username: '',
    };
  },
  computed: {
    url() {
      const suffix = this.username ? `profile/${this.username}` : '';
      return `https://myanimelist.net/${suffix}`;
    },
  },
};
</script>
