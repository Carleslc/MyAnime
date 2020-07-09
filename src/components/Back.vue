<template>
  <q-btn v-if="!home" round flat icon="arrow_back" @click="back()" />
</template>

<script>
export default {
  name: 'Back',
  computed: {
    home() {
      return this.$route.path === '/';
    },
  },
  methods: {
    back() {
      this.$router.go(-1);
    },
  },
};
</script>
