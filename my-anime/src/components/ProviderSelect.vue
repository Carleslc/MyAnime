<template>
  <q-select
    ref="providerSelect"
    v-model="provider"
    dense
    standout
    dark
    options-selected-class="filter-options"
    :options-dark="false"
    :options="Object.freeze(providers)"
  >
    <template v-slot:prepend>
      <q-icon name="cast" />
      <q-tooltip v-if="showTooltip" transition-show="fade" transition-hide="fade">
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
import MyAnimeList from '@/models/providers/MyAnimeList.js';
import Crunchyroll from '@/models/providers/Crunchyroll.js';

export default {
  props: {
    showTooltip: {
      type: Boolean,
      default: true,
    },
  },
  data() {
    const providers = [
      { label: 'MyAnimeList', value: MyAnimeList.instance },
      { label: 'Crunchyroll', value: Crunchyroll.instance },
      { label: 'Netflix', value: { url: 'https://www.netflix.com/' } },
      { label: 'Voy a tener suerte', value: { url: 'https://duckduckgo.com/' } },
      { label: 'Google (ES)', value: { url: 'https://www.google.es/' } },
      { label: 'AnimeID', value: { url: 'https://www.animeid.tv/' } },
      { label: 'AnimeFLV', value: { url: 'https://animeflv.net/' } },
      { label: 'jkanime', value: { url: 'http://jkanime.net/' } },
      { label: 'MonosChinos', value: { url: 'https://monoschinos.com/' } },
      { label: 'AnimeFenix', value: { url: 'https://animefenix.com/' } },
      { label: "I'm feeling lucky", value: { url: 'https://duckduckgo.com/' } },
      { label: 'Google (EN)', value: { url: 'https://www.google.com/' } },
      { label: 'Twist', value: { url: 'https://twist.moe/' } },
      { label: 'Gogoanime', value: { url: 'https://www.gogoanime.pro/' } },
    ];

    return {
      provider: providers[0],
      providers,
    };
  },
  computed: {
    providerUrl() {
      return this.provider.value.url;
    },
  },
  mounted() {
    document.addEventListener('keydown', this.keyListener);
  },
  beforeDestroy() {
    document.removeEventListener('keydown', this.keyListener);
  },
  methods: {
    openProvider() {
      const url = this.providerUrl;
      if (url) {
        openURL(url);
      } else {
        this.$refs.providerSelect.showPopup();
      }
    },
    keyListener(e) {
      const key = e.which || e.keyCode;
      if (key === 40) {
        // Down
        this.$refs.providerSelect.showPopup();
      }
    },
  },
};
</script>
