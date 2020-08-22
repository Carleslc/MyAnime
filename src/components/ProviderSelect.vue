<template>
  <q-select
    ref="providerSelect"
    v-model="provider"
    dense
    :standout="standout ? standout : true"
    :dark="dark"
    options-selected-class="filter-options"
    :options-dark="false"
    :options="providers"
    :options-dense="optionsDense"
    @popup-show="focus()"
    @popup-hide="focus(false)"
  >
    <template v-slot:prepend>
      <q-icon v-if="icon" name="cast" />
      <q-avatar v-else square size="sm">
        <img :src="provider.value.icon" />
      </q-avatar>
      <q-tooltip v-if="tooltip" transition-show="fade" transition-hide="fade">
        <div v-html="help" />
      </q-tooltip>
    </template>
    <template v-slot:option="scope">
      <q-item v-ripple v-bind="scope.itemProps" v-on="scope.itemEvents">
        <q-item-section avatar>
          <q-avatar square size="sm">
            <img :src="scope.opt.value.icon" />
          </q-avatar>
        </q-item-section>
        <q-item-section>
          <q-item-label>{{ scope.opt.label }}</q-item-label>
        </q-item-section>
      </q-item>
    </template>
    <template v-if="provider && icon" v-slot:after>
      <q-btn flat dense type="a" :href="providerUrl" target="_blank" @click="openProvider">
        <!-- <q-icon name="screen_share" /> -->
        <q-avatar square size="sm">
          <img :src="provider.value.icon" />
        </q-avatar>
        <q-tooltip transition-show="fade" transition-hide="fade">
          {{ provider.label }}
        </q-tooltip>
      </q-btn>
    </template>
  </q-select>
</template>

<script>
import { openURL } from 'quasar';
import { mapGetters } from 'vuex';
import { nl2br } from '@/utils/strings';
import bind from '@/mixins/bind';

export default {
  mixins: [bind('provider', Object)],
  props: {
    icon: {
      type: Boolean,
      default: false,
    },
    optionsDense: {
      type: Boolean,
      default: false,
    },
    dark: {
      type: Boolean,
      default: false,
    },
    tooltip: {
      type: Boolean,
      default: true,
    },
    standout: {
      type: String,
      default: undefined,
    },
  },
  computed: {
    ...mapGetters('store', ['providers']),
    providerUrl() {
      return this.provider.value.url;
    },
    help() {
      return nl2br(this.$t('providerSelect'));
    },
  },
  methods: {
    openProvider() {
      const url = this.providerUrl;
      if (url) {
        openURL(url);
      } else {
        this.showPopup();
      }
    },
    showPopup() {
      this.$refs.providerSelect.showPopup();
    },
    focus(focus = true) {
      if (focus) {
        this.$refs.providerSelect.$el.classList.add('q-field--focused');
      } else {
        this.$refs.providerSelect.$el.classList.remove('q-field--focused');
      }
    },
  },
};
</script>
