<template>
  <q-layout view="lHr lpR lFr">
    <q-header>
      <q-toolbar class="row items-center justify-between q-pa-md" color="purple">
        <div class="col-auto row items-center no-wrap">
          <q-btn flat icon="menu" class="col-shrink q-mr-md lt-lg" @click="settings = !settings" />
          <back class="q-mr-md" />
          <div class="row justify-between items-center no-wrap">
            <avatar v-if="!settings" icon class="col-shrink q-mr-lg" />
            <user-search class="col-grow" />
          </div>
        </div>
        <div v-if="settings" class="col row justify-around items-center">
          <q-space />
          <div class="col-auto text-h4">My Anime</div>
          <q-space />
        </div>
        <provider-select v-if="!settings" full class="col-auto gt-sm" />
        <status-select
          v-if="!settings"
          icon="movie_filter"
          caption="Filter anime status"
          :options="['Already aired', 'Not yet aired']"
          class="col-auto gt-md"
        />
        <status-select
          v-if="!settings"
          icon="tv"
          caption="Filter anime type"
          :options="['TV', 'OVA', 'Movie', 'Special', 'ONA', 'Music']"
          class="col-auto gt-md"
        />
        <div v-if="!settings" class="col-auto row justify-end q-gutter-x-md">
          <calendar-button icon class="col-shrink gt-xs" />
        </div>
      </q-toolbar>
    </q-header>

    <q-drawer
      v-if="$q.screen.lt.lg"
      v-model="settings"
      side="left"
      :content-class="{ 'bg-primary': $q.screen.lt.md }"
      class="text-white"
    >
      <q-list padding dark>
        <avatar size="72px" />
        <q-item-section>
          <calendar-button />
        </q-item-section>
        <q-item-section>
          <q-item-label header>Select provider</q-item-label>
          <provider-select class="full-width" />
        </q-item-section>
        <q-item-section>
          <q-item-label header>Anime status</q-item-label>
          <status-select icon="movie_filter" :options="['Already aired', 'Not yet aired']" />
        </q-item-section>
        <q-item-section>
          <q-item-label header>Anime type</q-item-label>
          <status-select icon="tv" :options="['TV', 'OVA', 'Movie', 'Special', 'ONA', 'Music']" />
        </q-item-section>
      </q-list>
    </q-drawer>

    <q-page-container>
      <router-view />
    </q-page-container>

    <q-footer class="row justify-end">
      <q-btn flat icon="description" @click="info = true">
        <q-tooltip content-class="bg-primary">
          About this app
        </q-tooltip>
      </q-btn>
      <q-dialog v-model="info" transition-show="jump-up" transition-hide="jump-down">
        <about style="width: 1000px; max-width: 80vw;" />
      </q-dialog>
      <q-btn flat type="a" icon="fab fa-github" href="https://github.com/Carleslc/MyAnime" target="_blank" />
      <support-me />
    </q-footer>
  </q-layout>
</template>

<script>
export default {
  data() {
    return {
      settings: false,
      info: false,
    };
  },
  created() {
    window.addEventListener('resize', this.resize);
  },
  destroyed() {
    window.removeEventListener('resize', this.resize);
  },
  methods: {
    resize() {
      if (this.settings && window.innerWidth > 1920) {
        this.settings = false;
      }
    },
  },
};
</script>
