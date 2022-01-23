<template>
  <q-select
    ref="titleSelect"
    v-model="title"
    dense
    options-dense
    standout="filter-options"
    options-selected-class="filter-options"
    :options-dark="false"
    :options="titles"
    @popup-show="focus()"
    @popup-hide="focus(false)"
  >
    <template v-slot:prepend>
      <q-icon name="list_alt" />
    </template>
  </q-select>
</template>

<script>
import bind from '@/mixins/bind';

export default {
  mixins: [bind('title', String)],
  props: {
    titles: {
      type: Array,
      required: true,
    },
  },
  methods: {
    focus(focus = true) {
      this.$refs.titleSelect.focused = focus;
    },
  },
};
</script>
