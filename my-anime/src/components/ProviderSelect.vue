<template>
  <q-select
    ref="providerSelect"
    v-model="provider"
    dense
    standout
    dark
    :options-dark="false"
    :options="Object.freeze(providers)"
  >
    <template v-slot:prepend>
      <q-icon name="cast" />
      <q-tooltip v-if="full" transition-show="fade" transition-hide="fade">
        Select which provider must be opened when clicking over an episode, either in Spanish (ES) or English (EN).
        <br /><br />
        Feeling Lucky options are based on search engine, trying to get a proper streamer, but it doesn't mean it always
        work.
        <br /><br />
        If selected provider cannot find an episode try to change the provider.
      </q-tooltip>
    </template>
    <template slot="option" slot-scope="{ opt }">
      <q-item v-ripple clickable @click="provider = opt">
        <q-item-section avatar>
          <q-icon :name="providerIcon(opt)" />
        </q-item-section>
        <q-item-section>
          <q-item-label>{{ opt.label }}</q-item-label>
        </q-item-section>
      </q-item>
    </template>
    <template v-if="provider" v-slot:after>
      <q-btn flat dense type="a" :href="providerUrl" target="_blank" @click="openProvider">
        <q-icon :name="providerIcon()" />
        <q-tooltip transition-show="fade" transition-hide="fade">
          {{ providerTooltip }}
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
    full: {
      type: Boolean,
      default: true,
    },
  },
  data() {
    return {
      provider: '',
      providers: [
        { label: 'MyAnimeList', value: MyAnimeList },
        { label: 'Crunchyroll', value: Crunchyroll },
        { label: 'Netflix', value: { url: 'https://www.netflix.com/' } },
        { label: 'Voy a tener suerte', value: { url: 'https://duckduckgo.com/' } },
        { label: 'Google (ES)', value: { url: 'https://www.google.es/' } },
        { label: 'AnimeID', value: { url: 'https://www.animeid.tv/' } },
        { label: 'AnimeFLV', value: { url: 'https://animeflv.net/' } },
        { label: 'jkanime', value: { url: 'http://jkanime.net/' } },
        { label: 'MonosChinos', value: { url: 'https://monoschinos.com/' } },
        { label: "I'm feeling lucky", value: { url: 'https://duckduckgo.com/' } },
        { label: 'Google (EN)', value: { url: 'https://www.google.com/' } },
        { label: 'Twist', value: { url: 'https://twist.moe/' } },
        { label: 'Gogoanime', value: { url: 'https://www.gogoanime.pro/' } },
      ],
    };
  },
  computed: {
    providerTooltip() {
      return this.provider ? this.provider.label : 'Please, select a provider';
    },
    providerUrl() {
      return this.provider ? this.provider.value.url : '';
    },
  },
  methods: {
    providerIcon(provider) {
      return 'screen_share';
    },
    openProvider() {
      const url = this.providerUrl;
      if (url) {
        openURL(url);
      } else {
        this.$refs.providerSelect.showPopup();
      }
    },
  },
};
</script>
