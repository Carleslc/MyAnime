<template>
  <div v-if="open" :aria-label="aria" class="clickable non-selectable" @click="open">
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
};
</script>
