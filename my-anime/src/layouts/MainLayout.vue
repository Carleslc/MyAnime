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
          <provider-select v-model="provider" class="col-auto q-mx-auto gt-xsm" />
          <div class="col-auto q-gutter-x-lg q-mr-auto row justify-between gt-md">
            <status-select
              v-model="airingStatusFilter"
              icon="movie_filter"
              caption="Filter anime status"
              :options="config.airingStatuses"
              class="col-auto gt-md"
            />
            <status-select
              v-model="typeFilter"
              icon="tv"
              caption="Filter anime type"
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
        >
          <q-tooltip transition-show="fade" transition-hide="fade">
            {{ settings ? 'Close' : 'Open' }} Settings
          </q-tooltip>
        </q-btn>
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
          <div class="col-auto full-width q-px-sm">
            <q-item-section>
              <q-item-label header>Select provider</q-item-label>
              <provider-select v-model="provider" />
            </q-item-section>
            <q-item-section class="q-pt-lg">
              <q-item-label header>Anime status</q-item-label>
              <status-select v-model="airingStatusFilter" icon="movie_filter" :options="config.airingStatuses" />
            </q-item-section>
            <q-item-section class="q-pt-sm">
              <q-item-label header>Anime type</q-item-label>
              <status-select v-model="typeFilter" icon="tv" :options="config.animeTypes" />
            </q-item-section>
          </div>
          <div class="col-auto row justify-center q-mt-auto full-width">
            <reset-button class="col-auto full-width q-pb-sm" @click="reset" />
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
        <q-tooltip transition-show="fade" transition-hide="fade" content-class="bg-primary">
          About this app
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
import { mapGetters, mapMutations, mapActions } from 'vuex';

export default {
  mixins: [config],
  data() {
    return {
      settings: false,
      info: false,
    };
  },
  computed: {
    ...mapGetters('store', ['isLoading', 'isFetched']),
    hiddenIfSettings() {
      return this.settings ? 'display: none' : undefined;
    },
  },
  watch: {
    status() {
      if (!this.isLoading && !this.isFetched) {
        this.fetchAnimes();
      }
    },
  },
  created() {
    this.info = !this.isRecurringUser;
    this.loading(); // loaded after initial user search
  },
  methods: {
    ...mapMutations('store', ['loading']),
    ...mapActions('store', ['fetchAnimes']),
    overlappingFooter(offset) {
      const footerHeight = '41px';
      return { minHeight: `calc(100vh - ${offset}px + ${footerHeight})` };
    },
  },
};
</script>
