<template>
  <q-select
    ref="statusSelect"
    v-model="selected"
    multiple
    dense
    standout
    dark
    emit-value
    :options-dense="optionsDense"
    :options-dark="false"
    :options="options"
    popup-content-class="filter-options"
    @popup-show="focus()"
    @popup-hide="focus(false)"
  >
    <template v-slot:prepend>
      <q-icon v-if="icon" :name="icon" />
      <q-tooltip v-if="caption" transition-show="fade" transition-hide="fade">
        {{ caption }}
      </q-tooltip>
    </template>
    <template v-if="selected.length === allSelected" v-slot:selected>
      {{ $t(allTag) }}
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
    optionsDense: {
      type: Boolean,
      default: false,
    },
    icon: {
      type: String,
      default: '',
    },
    caption: {
      type: String,
      default: '',
    },
    and: {
      type: Boolean,
      default: false,
    },
  },
  computed: {
    allSelected() {
      return this.and ? 0 : this.options.length;
    },
    allTag() {
      return this.and ? 'any' : 'all';
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
    focus(focus = true) {
      this.$refs.statusSelect.focused = focus;
    },
  },
};
</script>
