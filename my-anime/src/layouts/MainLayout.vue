<template>
  <q-layout view="lHr lpR lFr">
    <q-header>
      <q-toolbar class="row justify-between items-center q-pa-md" color="purple">
        <div v-if="!settings" class="col-auto row items-center no-wrap">
          <back class="q-mr-md" />
          <div class="row justify-between items-center no-wrap">
            <avatar icon class="col-shrink q-mr-lg" />
            <user-search class="col-grow" />
          </div>
        </div>
        <div v-if="settings" class="col row justify-around items-center">
          <div class="col-auto text-h4">My Anime</div>
        </div>
        <div v-else class="col row justify-end items-center no-wrap" @mousedown.prevent>
          <provider-select show-tooltip class="col-auto q-mx-auto gt-xsm" />
          <div class="col-auto q-gutter-x-lg q-mr-auto row justify-between gt-md">
            <status-select
              icon="movie_filter"
              caption="Filter anime status"
              :options="['Already aired', 'Not yet aired']"
              class="col-auto gt-md"
            />
            <status-select
              icon="tv"
              caption="Filter anime type"
              :options="['TV', 'OVA', 'Movie', 'Special', 'ONA', 'Music']"
              class="col-auto gt-md"
            />
          </div>
          <div class="col-auto row justify-end q-gutter-x-md">
            <calendar-button icon class="col-shrink gt-xs" />
          </div>
        </div>
        <q-btn
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
        class="text-grey-7 q-pb-sm"
      >
        <q-tab name="watching" icon="visibility" label="Watching" />
        <q-tab name="on-hold" icon="pause" label="On Hold" />
        <q-tab name="plan-to-watch" icon="watch_later" label="Plan to Watch" />
      </q-tabs>
    </q-header>

    <q-drawer elevated v-model="settings" side="right" content-class="bg-primary" class="text-white">
      <q-list v-if="settings" dark class="column justify-start full-height">
        <avatar size="72px" class="col-auto q-py-md" />
        <q-item-section class="col-auto">
          <calendar-button />
        </q-item-section>
        <div class="col row q-pt-lg">
          <div class="col-auto full-width q-px-sm">
            <q-item-section>
              <q-item-label header>Select provider</q-item-label>
              <provider-select />
            </q-item-section>
            <q-item-section class="q-pt-lg">
              <q-item-label header>Anime status</q-item-label>
              <status-select icon="movie_filter" :options="['Already aired', 'Not yet aired']" />
            </q-item-section>
            <q-item-section class="q-pt-sm">
              <q-item-label header>Anime type</q-item-label>
              <status-select icon="tv" :options="['TV', 'OVA', 'Movie', 'Special', 'ONA', 'Music']" />
            </q-item-section>
          </div>
          <div class="col-auto row justify-center q-mt-auto full-width">
            <reset-button class="col-auto full-width q-pb-sm" />
          </div>
        </div>
      </q-list>
    </q-drawer>

    <q-page-container>
      <router-view />
    </q-page-container>

    <q-footer class="row justify-end fixed-bottom-right" @mousedown.prevent>
      <q-btn unelevated color="accent" icon="description" @click="info = true">
        <q-tooltip transition-show="fade" transition-hide="fade" content-class="bg-primary">
          About this app
        </q-tooltip>
      </q-btn>
      <q-dialog v-model="info" transition-show="jump-up" transition-hide="jump-down">
        <about style="width: 1000px; max-width: 80vw;" />
      </q-dialog>
      <q-btn
        unelevated
        color="accent"
        type="a"
        icon="fab fa-github"
        href="https://github.com/Carleslc/MyAnime"
        target="_blank"
      />
      <support-me class="q-px-sm" />
    </q-footer>
  </q-layout>
</template>

<script>
export default {
  data() {
    return {
      settings: false,
      info: false,
      status: 'watching',
    };
  },
};
</script>
