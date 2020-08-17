<template>
  <q-select
    v-model="selected"
    multiple
    dense
    standout
    dark
    emit-value
    :options-dark="false"
    :options="options"
    popup-content-class="filter-options"
  >
    <template v-slot:prepend>
      <q-icon v-if="icon" :name="icon" />
      <q-tooltip v-if="caption" transition-show="fade" transition-hide="fade">
        {{ caption }}
      </q-tooltip>
    </template>
    <template v-if="selected.length === options.length" v-slot:selected>
      {{ $t('all') }}
    </template>
    <template v-else v-slot:selected>
      {{ options.filter(isSelected).map(label).join(', ') }}
    </template>
  </q-select>
</template>

<script>
import bind from '@/mixins/bind';

export default {
  mixins: [bind('selected', Array)],
  props: {
    options: {
      type: Array,
      required: true,
    },
    icon: {
      type: String,
      default: '',
    },
    caption: {
      type: String,
      default: '',
    },
  },
  methods: {
    isSelected(option) {
      return this.selected.includes(this.optValue(option));
    },
    optValue(option) {
      if (option instanceof Object) {
        return option.value;
      }
      return option;
    },
    label(option) {
      if (option instanceof Object) {
        return option.label;
      }
      return option;
    },
  },
};
</script>
