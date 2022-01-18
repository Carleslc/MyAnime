<template>
  <item-button
    icon="date_range"
    href="https://notify.moe/calendar"
    target="_blank"
    :label="icon ? '' : $t('animeCalendar')"
    :caption="$t('animeCalendarDescription')"
  />
</template>

<script>
export default {
  props: {
    icon: {
      type: Boolean,
      default: false,
    },
  },
};
</script>
