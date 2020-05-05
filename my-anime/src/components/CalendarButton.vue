<template>
  <q-item v-ripple tag="a" href="https://notify.moe/calendar" target="_blank" :class="{ 'icon-only': icon }">
    <q-item-section avatar>
      <q-icon name="date_range" />
    </q-item-section>
    <q-item-section v-if="!icon">
      <q-item-label>Anime Calendar</q-item-label>
      <q-item-label caption>
        {{ caption }}
      </q-item-label>
    </q-item-section>
    <q-tooltip v-else transition-show="fade" transition-hide="fade">
      {{ caption }}
    </q-tooltip>
  </q-item>
</template>

<script>
export default {
  props: {
    icon: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      caption: 'Calendar anime for this week',
    };
  },
};
</script>
