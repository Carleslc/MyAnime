import MyAnimeList from '@/model/providers/MyAnimeList';
import Crunchyroll from '@/model/providers/Crunchyroll';
import Netflix from '@/model/providers/Netflix';
import AnimeID from '@/model/providers/AnimeID';
import AnimeFLV from '@/model/providers/AnimeFLV';
import jkAnime from '@/model/providers/jkAnime';
import MonosChinos from '@/model/providers/MonosChinos';
import AnimeFenix from '@/model/providers/AnimeFenix';
import Twist from '@/model/providers/Twist';
import Gogoanime from '@/model/providers/Gogoanime';
import { FeelingDuckyES, FeelingDuckyEN, FeelingLuckyES, FeelingLuckyEN } from '@/model/providers/FeelingLucky';

import { mapMutations } from 'vuex';
import { mapFields } from 'vuex-map-fields';

export const providers = Object.freeze([
  { label: 'MyAnimeList', value: MyAnimeList },
  { label: 'Crunchyroll', value: Crunchyroll },
  { label: 'Netflix', value: Netflix },
  { label: 'Voy a tener suerte', value: FeelingDuckyES },
  { label: 'Google (ES)', value: FeelingLuckyES },
  { label: 'AnimeFLV', value: AnimeFLV },
  { label: 'AnimeFenix', value: AnimeFenix },
  { label: 'AnimeID', value: AnimeID },
  { label: 'jkanime', value: jkAnime },
  { label: 'MonosChinos', value: MonosChinos },
  { label: "I'm feeling ducky", value: FeelingDuckyEN },
  { label: 'Google (EN)', value: FeelingLuckyEN },
  { label: 'Gogoanime', value: Gogoanime },
  { label: 'Twist', value: Twist },
]);

export const config = Object.freeze({
  airingStatuses: ['Already aired', 'Not yet aired'],
  animeTypes: ['TV', 'OVA', 'Movie', 'Special', 'ONA', 'Music'],
  statuses: {
    watching: {
      label: 'Watching',
      icon: 'visibility',
    },
    'on-hold': {
      label: 'On Hold',
      icon: 'pause',
    },
    'plan-to-watch': {
      label: 'Plan to Watch',
      icon: 'watch_later',
    },
  },
});

export const defaults = {
  username: '',
  status: 'watching',
  provider: providers[0],
  airingStatusFilter: config.airingStatuses.slice(),
  typeFilter: config.animeTypes.slice(),
};

export default {
  data() {
    return {
      config,
      isRecurringUser: !this.$q.localStorage.isEmpty(),
    };
  },
  computed: {
    ...mapFields('store', Object.keys(defaults)),
  },
  created() {
    // restore saved configuration
    if (!this.isRecurrentUser) {
      Object.keys(defaults).forEach((key) => {
        if (this.$q.localStorage.has(key)) {
          let value = this.$q.localStorage.getItem(key);

          if (key === 'provider') {
            // retrieve provider object from the saved label
            value = providers.find((provider) => provider.label === value);
          }

          if (value !== undefined && value !== null) {
            this[key] = value;
          }
        }
      });
    }

    // add watchers to save configuration
    Object.keys(defaults)
      .filter((key) => key !== 'provider') // avoid saving entire object
      .forEach((key) => this.$watch(key, (value) => this.$q.localStorage.set(key, value)));
  },
  methods: {
    ...mapMutations('store', ['set']),
    // reset configuration
    reset() {
      this.$q.localStorage.clear();
      Object.entries(defaults).forEach(([key, defaultValue]) => {
        this[key] = defaultValue;
      });
    },
  },
  watch: {
    // save provider label only
    provider(provider) {
      this.$q.localStorage.set('provider', provider.label);
    },
  },
};
