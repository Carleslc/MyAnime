<template>
  <q-layout view="hHr lpR fFr">
    <q-header>
      <q-toolbar class="row justify-between items-center q-pa-md no-wrap scroll" color="purple">
        <div class="col-auto row items-center no-wrap" :style="hiddenIfSettings">
          <back class="q-mr-md" />
          <div class="row justify-between items-center no-wrap">
            <avatar icon class="col-shrink q-mr-lg gt-xxs" />
            <user-search class="col-grow" />
          </div>
        </div>
        <div v-if="settings" class="col row justify-around items-center">
          <div class="col-auto text-h4">My Anime</div>
        </div>
        <div v-else class="col row justify-end items-center no-wrap" @mousedown.prevent>
          <provider-select ref="providerSelect" v-model="provider" dark icon class="col-auto q-mx-auto gt-xsm" />
          <div class="col-auto q-gutter-x-lg q-mr-auto row justify-between gt-md">
            <status-select
              v-model="airingStatusFilter"
              icon="movie_filter"
              :caption="$t('animeStatusFilter')"
              :options="config.airingStatuses"
              class="col-auto gt-md"
            />
            <status-select
              v-model="typeFilter"
              icon="tv"
              :caption="$t('animeTypeFilter')"
              :options="config.animeTypes"
              class="col-auto gt-md"
            />
          </div>
          <div class="col-auto row justify-end q-gutter-x-md">
            <calendar-button icon class="col-shrink gt-xs" />
          </div>
        </div>
        <q-btn
          id="settings"
          flat
          icon="settings"
          class="col-shrink q-ml-md q-py-xs"
          @click="settings = !settings"
          @keydown.esc="settings = false"
        />
      </q-toolbar>
      <q-tabs
        v-model="status"
        inline-label
        align="justify"
        active-color="white"
        indicator-color="transparent"
        class="text-grey-7"
      >
        <q-tab
          v-for="(s, k) in config.statuses"
          :key="k"
          :name="k"
          :icon="s.icon"
          :label="s.label"
          :class="{ 'q-px-xs': $q.screen.lt.sm }"
        />
      </q-tabs>
    </q-header>

    <q-drawer v-model="settings" :breakpoint="1152" side="right" content-class="bg-primary" class="text-white">
      <q-list v-if="settings" dark class="column justify-start full-height">
        <avatar size="72px" class="col-auto q-py-md" />
        <q-item-section class="col-auto">
          <calendar-button />
        </q-item-section>
        <div class="col row q-pt-lg">
          <div class="col-auto full-width q-pl-md q-pr-sm">
            <q-item-section class="q-pt-sm">
              <q-item-label v-t="'selectLanguage'" header class="q-px-sm" />
              <language-select v-model="language" class="q-pr-xs" />
            </q-item-section>
            <q-item-section class="q-pt-sm">
              <q-item-label v-t="'selectProvider'" header class="q-px-sm" />
              <provider-select v-model="provider" dark icon class="q-pr-xs" />
            </q-item-section>
            <q-item-section class="q-pt-lg">
              <q-item-label v-t="'animeStatus'" header class="q-px-sm" />
              <status-select
                v-model="airingStatusFilter"
                icon="movie_filter"
                :options="config.airingStatuses"
                class="q-pr-xs"
              />
            </q-item-section>
            <q-item-section class="q-pt-sm">
              <q-item-label v-t="'animeType'" header class="q-px-sm" />
              <status-select v-model="typeFilter" icon="tv" :options="config.animeTypes" class="q-pr-xs" />
            </q-item-section>
          </div>
          <div class="col-auto row justify-center q-mt-auto full-width">
            <reset-button class="col-auto full-width q-pb-sm" />
          </div>
        </div>
      </q-list>
    </q-drawer>

    <q-page-container>
      <q-page padding class="gradient" :style-fn="overlappingFooter">
        <router-view />
      </q-page>
    </q-page-container>

    <q-footer class="row justify-end fixed-bottom-right" @mousedown.prevent>
      <q-btn unelevated color="accent" icon="description" class="square" @click="info = true">
        <q-tooltip transition-show="fade" transition-hide="fade" content-class="bg-primary shadow-2">
          {{ $t('aboutApp') }}
        </q-tooltip>
      </q-btn>
      <q-dialog v-model="info" transition-show="jump-up" transition-hide="jump-down">
        <about style="width: 1000px; max-width: 80vw;" />
      </q-dialog>
      <q-btn
        square
        unelevated
        color="accent"
        type="a"
        icon="fab fa-github"
        href="https://github.com/Carleslc/MyAnime"
        target="_blank"
        class="square"
      />
      <support-me class="square q-px-sm" />
    </q-footer>
  </q-layout>
</template>

<script>
import config from '@/mixins/configuration';
import { registerKeyListeners } from '@/mixins/keyboard';
import { mapState, mapGetters, mapMutations, mapActions } from 'vuex';

export default {
  meta: {
    meta: {
      'og:image': { property: 'og:image', content: `${window.location.href}statics/chibi.png` },
    },
  },
  mixins: [
    config,
    registerKeyListeners({
      down: 'showProviderPopup',
    }),
  ],
  data() {
    return {
      settings: false,
      info: false,
    };
  },
  computed: {
    ...mapState('store', ['api']),
    ...mapGetters('store', ['isLoading', 'isFetched', 'hasUsername']),
    hiddenIfSettings() {
      return this.settings ? 'display: none' : undefined;
    },
  },
  watch: {
    status() {
      this.updateFetched();
    },
    isFetched() {
      this.updateAnimes();
    },
    isLoading() {
      this.updateAnimes();
    },
  },
  created() {
    this.info = !this.isRecurringUser;
    this.loading(); // loaded after initial user search
  },
  methods: {
    ...mapMutations('store', ['loading', 'updateFetched']),
    ...mapActions('store', ['fetchAnimes']),
    overlappingFooter(offset) {
      const footerHeight = '41px';
      return { minHeight: `calc(100vh - ${offset}px + ${footerHeight})` };
    },
    updateAnimes() {
      if (!this.isFetched && !this.isLoading && this.hasUsername && !this.api.hasError) {
        this.fetchAnimes();
      }
    },
    showProviderPopup() {
      this.$refs.providerSelect.showPopup();
    },
  },
};
</script>
