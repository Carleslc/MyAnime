<template>
  <q-item
    v-ripple
    clickable
    :dense="dense"
    :tag="isLink ? 'a' : 'span'"
    :href="isLink ? href : undefined"
    :target="isLink ? target : undefined"
    :draggable="isLink ? false : undefined"
    class="non-selectable"
    :class="{ 'icon-only': icon && !label }"
    @click="$emit('click')"
  >
    <q-item-section v-if="icon" avatar>
      <q-icon :name="icon" />
    </q-item-section>
    <q-item-section v-if="label">
      <q-item-label>{{ label }}</q-item-label>
      <q-item-label v-if="caption" caption>
        {{ caption }}
      </q-item-label>
    </q-item-section>
    <q-tooltip v-else-if="caption" transition-show="fade" transition-hide="fade">
      {{ caption }}
    </q-tooltip>
  </q-item>
</template>

<script>
export default {
  props: {
    icon: {
      type: String,
      default: '',
    },
    label: {
      type: String,
      default: '',
    },
    href: {
      type: String,
      default: '#',
    },
    target: {
      type: String,
      default: '_self',
    },
    caption: {
      type: String,
      default: '',
    },
    dense: {
      type: Boolean,
      default: false,
    },
  },
  computed: {
    isLink() {
      return this.href !== '#';
    },
  },
};
</script>

<style lang="scss">
.icon-only {
  border-radius: 3px;

  .q-item__section {
    padding: 0;
    min-width: 0;
  }
}
</style>
