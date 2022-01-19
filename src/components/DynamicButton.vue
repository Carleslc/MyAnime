<template>
  <div v-if="open" :aria-label="aria" class="clickable non-selectable" @click="openOnce">
    <slot></slot>
  </div>
  <a v-else :href="href" target="_blank" :aria-label="aria" class="non-selectable" @mousedown.prevent>
    <slot></slot>
  </a>
</template>

<script>
export default {
  props: {
    href: {
      type: String,
      default: '#',
    },
    open: {
      type: Function,
      default: undefined,
    },
    aria: {
      type: String,
      default: undefined,
    },
  },
  data() {
    return {
      isOpening: false,
    };
  },
  methods: {
    async openOnce() {
      if (!this.isOpening) {
        this.isOpening = true;
        await this.open();
        this.isOpening = false;
      }
    },
  },
};
</script>
