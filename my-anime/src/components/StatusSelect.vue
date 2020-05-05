<template>
  <q-select
    v-model="selected"
    multiple
    dense
    standout
    dark
    :options-dark="false"
    :options="Object.freeze(options)"
    popup-content-class="filter-options"
  >
    <template v-slot:prepend>
      <q-icon v-if="icon" :name="icon" />
      <q-tooltip v-if="caption" transition-show="fade" transition-hide="fade">
        {{ caption }}
      </q-tooltip>
    </template>
    <template v-if="selected.length === options.length" v-slot:selected>
      All
    </template>
    <template v-else v-slot:selected>
      {{ options.filter(isSelected).join(', ') }}
    </template>
  </q-select>
</template>

<script>
export default {
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
  data() {
    return {
      selected: this.options.slice(),
    };
  },
  methods: {
    isSelected(selected) {
      return this.selected.includes(selected);
    },
  },
};
</script>
