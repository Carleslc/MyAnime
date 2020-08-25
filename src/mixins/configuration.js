import MyAnimeList from '@/model/providers/MyAnimeList';
import Crunchyroll from '@/model/providers/Crunchyroll';
import Netflix from '@/model/providers/Netflix';
import AnimeID from '@/model/providers/AnimeID';
import AnimeFLV from '@/model/providers/AnimeFLV';
import jkAnime from '@/model/providers/jkAnime';
import MonosChinos from '@/model/providers/MonosChinos';
import AnimeFenix from '@/model/providers/AnimeFenix';
import AnimeMovil2 from '@/model/providers/AnimeMovil2';
import AnimeHeaven from '@/model/providers/AnimeHeaven';
import AnimeUltima from '@/model/providers/AnimeUltima';
import Aniwatch from '@/model/providers/Aniwatch';
import Twist from '@/model/providers/Twist';
import FourAnime from '@/model/providers/FourAnime';
import MasterAnime from '@/model/providers/MasterAnime';
import MyAnimeCo from '@/model/providers/MyAnimeCo';
import { NineAnimeLucky, NineAnimeSearch } from '@/model/providers/NineAnime';
import { GogoanimeLife, GogoanimeMovie } from '@/model/providers/Gogoanime';
import { FeelingDuckyES, FeelingDuckyEN, FeelingLuckyES, FeelingLuckyEN } from '@/model/providers/FeelingLucky';

import { i18n } from '@/boot/i18n';
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
  { label: 'AnimeMovil', value: AnimeMovil2 },
  { label: "I'm feeling ducky", value: FeelingDuckyEN },
  { label: 'Google (EN)', value: FeelingLuckyEN },
  { label: 'Twist', value: Twist },
  { label: '4Anime', value: FourAnime },
  { label: '9Anime (Lucky)', value: NineAnimeLucky },
  { label: '9Anime (Search)', value: NineAnimeSearch },
  { label: 'Gogoanime.movie', value: GogoanimeMovie },
  { label: 'Gogoanime.life', value: GogoanimeLife },
  { label: 'Aniwatch', value: Aniwatch },
  { label: 'AnimeUltima', value: AnimeUltima },
  { label: 'AnimeHeaven', value: AnimeHeaven },
  { label: 'MasterAnime', value: MasterAnime },
  { label: 'MyAnimeCo', value: MyAnimeCo },
]);

function newConfig() {
  const genres = [
    { label: i18n.t('genres.action'), value: 'action' },
    { label: i18n.t('genres.adventure'), value: 'adventure' },
    { label: i18n.t('genres.cars'), value: 'cars' },
    { label: i18n.t('genres.comedy'), value: 'comedy' },
    { label: i18n.t('genres.dementia'), value: 'dementia' },
    { label: i18n.t('genres.demons'), value: 'demons' },
    { label: i18n.t('genres.drama'), value: 'drama' },
    { label: i18n.t('genres.ecchi'), value: 'ecchi' },
    { label: i18n.t('genres.fantasy'), value: 'fantasy' },
    { label: i18n.t('genres.game'), value: 'game' },
    { label: i18n.t('genres.harem'), value: 'harem' },
    { label: i18n.t('genres.hentai'), value: 'hentai' },
    { label: i18n.t('genres.historical'), value: 'historical' },
    { label: i18n.t('genres.horror'), value: 'horror' },
    { label: i18n.t('genres.josei'), value: 'josei' },
    { label: i18n.t('genres.kids'), value: 'kids' },
    { label: i18n.t('genres.magic'), value: 'magic' },
    { label: i18n.t('genres.martialArts'), value: 'martial arts' },
    { label: i18n.t('genres.mecha'), value: 'mecha' },
    { label: i18n.t('genres.military'), value: 'military' },
    { label: i18n.t('genres.music'), value: 'music' },
    { label: i18n.t('genres.mystery'), value: 'mystery' },
    { label: i18n.t('genres.parody'), value: 'parody' },
    { label: i18n.t('genres.police'), value: 'police' },
    { label: i18n.t('genres.psychological'), value: 'psychological' },
    { label: i18n.t('genres.romance'), value: 'romance' },
    { label: i18n.t('genres.samurai'), value: 'samurai' },
    { label: i18n.t('genres.school'), value: 'school' },
    { label: i18n.t('genres.scifi'), value: 'sci-fi' },
    { label: i18n.t('genres.seinen'), value: 'seinen' },
    { label: i18n.t('genres.shoujo'), value: 'shoujo' },
    { label: i18n.t('genres.shoujoAi'), value: 'shoujo ai' },
    { label: i18n.t('genres.shounen'), value: 'shounen' },
    { label: i18n.t('genres.shounenAi'), value: 'shounen ai' },
    { label: i18n.t('genres.sliceOfLife'), value: 'slice of life' },
    { label: i18n.t('genres.space'), value: 'space' },
    { label: i18n.t('genres.sports'), value: 'sports' },
    { label: i18n.t('genres.superPower'), value: 'super power' },
    { label: i18n.t('genres.supernatural'), value: 'supernatural' },
    { label: i18n.t('genres.thriller'), value: 'thriller' },
    { label: i18n.t('genres.vampire'), value: 'vampire' },
    { label: i18n.t('genres.yaoi'), value: 'yaoi' },
    { label: i18n.t('genres.yuri'), value: 'yuri' },
  ];
  genres.sort((a, b) => a.label.localeCompare(b.label));
  return Object.freeze({
    genres,
    airingStatuses: [
      { label: i18n.t('alreadyAired'), value: 'already-aired' },
      { label: i18n.t('notYetAired'), value: 'not-yet-aired' },
    ],
    animeTypes: [
      { label: 'TV', value: 'tv' },
      { label: 'OVA', value: 'ova' },
      { label: i18n.t('movie'), value: 'movie' },
      { label: i18n.t('special'), value: 'special' },
      { label: 'ONA', value: 'ona' },
      { label: i18n.t('music'), value: 'music' },
    ],
    statuses: {
      watching: {
        label: i18n.t('status.watching'),
        icon: 'visibility',
      },
      'on-hold': {
        label: i18n.t('status.onHold'),
        icon: 'pause',
      },
      'plan-to-watch': {
        label: i18n.t('status.planToWatch'),
        icon: 'watch_later',
      },
    },
  });
}

const defaultConfig = newConfig();

export const defaults = {
  language: i18n.locale,
  username: '',
  status: 'watching',
  provider: providers[0],
  providersByAnimeTitle: {},
  genreFilter: [],
  airingStatusFilter: defaultConfig.airingStatuses.map((status) => status.value),
  typeFilter: defaultConfig.animeTypes.map((type) => type.value),
  titlesByAnimeId: {
    MyAnimeList: {},
  },
};

export default {
  data() {
    return {
      config: defaultConfig,
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

          const getProvider = (label) => providers.find((provider) => provider.label === label) || providers[0];

          // convert provider labels to provider objects
          if (key === 'provider') {
            value = getProvider(value);
          } else if (key === 'providersByAnimeTitle') {
            const providersByAnimeTitle = {};
            Object.entries(value).forEach(([title, providerLabel]) => {
              providersByAnimeTitle[title] = getProvider(providerLabel);
            });
            value = providersByAnimeTitle;
          }

          if (value !== undefined && value !== null) {
            this[key] = value;
          }
        }
      });
    }

    // add watchers to save configuration
    Object.keys(defaults)
      .filter((key) => key !== 'provider' && key !== 'providersByAnimeTitle') // avoid saving entire objects
      .forEach((key) => this.$watch(key, (value) => this.$q.localStorage.set(key, value), { deep: true }));
  },
  watch: {
    // save provider label only
    provider(provider) {
      this.$q.localStorage.set('provider', provider.label);
    },
    providersByAnimeTitle: {
      handler(providersByAnimeTitle) {
        const saveProviders = {};
        Object.entries(providersByAnimeTitle).forEach(([title, provider]) => {
          saveProviders[title] = provider.label;
        });
        this.$q.localStorage.set('providersByAnimeTitle', saveProviders);
      },
      deep: true,
    },
    language(locale) {
      if (i18n.locale !== locale) {
        i18n.locale = locale;
        this.$q.lang.set(locale);
        this.config = newConfig();
      }
    },
  },
};
