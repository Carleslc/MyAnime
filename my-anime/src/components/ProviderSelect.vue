<template>
  <q-select
    ref="providerSelect"
    v-model="provider"
    dense
    standout
    dark
    options-selected-class="filter-options"
    :options-dark="false"
    :options="providers"
  >
    <template v-slot:prepend>
      <q-icon name="cast" />
      <q-tooltip transition-show="fade" transition-hide="fade">
        Select which provider must be opened when clicking over an episode, either in Spanish (ES) or English (EN).
        <br /><br />
        Feeling Lucky options are based on search engine, trying to get a proper streamer, but it doesn't mean it always
        work.
        <br /><br />
        If selected provider cannot find an episode try to change the provider.
      </q-tooltip>
    </template>
    <template v-slot:option="scope">
      <q-item v-ripple v-bind="scope.itemProps" v-on="scope.itemEvents">
        <q-item-section avatar>
          <q-icon name="screen_share" />
        </q-item-section>
        <q-item-section>
          <q-item-label>{{ scope.opt.label }}</q-item-label>
        </q-item-section>
      </q-item>
    </template>
    <template v-if="provider" v-slot:after>
      <q-btn flat dense type="a" :href="providerUrl" target="_blank" @click="openProvider">
        <q-icon name="screen_share" />
        <q-tooltip transition-show="fade" transition-hide="fade">
          {{ provider.label }}
        </q-tooltip>
      </q-btn>
    </template>
  </q-select>
</template>

<script>
import { openURL } from 'quasar';
import { registerKeyListeners } from '@/mixins/keyboard';
import { providers } from '@/mixins/configuration';
import bind from '@/mixins/bind';

export default {
  mixins: [
    bind('provider', Object),
    registerKeyListeners({
      down: 'showProviderPopup',
    }),
  ],
  props: {
    value: {
      type: Object,
      required: true,
    },
  },
  data() {
    return {
      providers,
    };
  },
  computed: {
    providerUrl() {
      return this.provider.value.url;
    },
  },
  methods: {
    openProvider() {
      const url = this.providerUrl;
      if (url) {
        openURL(url);
      } else {
        this.showProviderPopup();
      }
    },
    showProviderPopup() {
      this.$refs.providerSelect.showPopup();
    },
  },
};
</script>
