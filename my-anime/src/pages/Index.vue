<template>
  <q-page>
    <q-tabs
      v-model="status"
      inline-label
      align="justify"
      active-color="white"
      indicator-color="transparent"
      class="text-grey-7"
    >
      <q-tab name="watching" icon="visibility" label="Watching" />
      <q-tab name="on-hold" icon="pause" label="On Hold" />
      <q-tab name="plan-to-watch" icon="watch_later" label="Plan to Watch" />
    </q-tabs>
    <div class="q-pa-md"></div>
  </q-page>
</template>

<script>
export default {
  data() {
    return {
      status: 'watching',
    };
  },
};
</script>
