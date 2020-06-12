<template>
  <q-card
    v-if="!anime.isCompleted"
    v-ripple
    class="anime-episode"
    :class="{ small: isSmallElement, 'on-hover': $q.platform.is.desktop }"
  >
    <q-resize-observer debounce="200" @resize="handleResize" />
    <a :href="episodeUrl" target="_blank" class="column justify-between full-height" @mousedown.prevent>
      <q-img :src="anime.cover" spinner-color="primary" class="full-height" />
      <div class="absolute-full hoverable overlay column justify-center">
        <q-btn
          ref="fabNext"
          :fab="!isSmallElement"
          :fab-mini="isSmallElement"
          :text-color="anime.isLastEpisode ? 'positive' : 'accent'"
          :icon="anime.isLastEpisode ? 'library_add_check' : 'queue_play_next'"
          color="white"
          class="absolute-top-right q-ma-sm"
          taxindex="0"
          @click.prevent="updateEpisode"
        >
          <q-badge v-if="!anime.isLastEpisode" color="secondary" floating>{{ anime.nextEpisode }}</q-badge>
          <q-tooltip
            transition-show="jump-left"
            transition-hide="jump-right"
            anchor="center left"
            self="center right"
            :offset="[10, 10]"
            :content-class="[anime.isLastEpisode ? 'text-positive' : 'text-secondary', 'bg-white']"
            >{{ anime.isLastEpisode ? 'Complete' : 'Next episode' }}
          </q-tooltip>
        </q-btn>
        <h1 class="col-auto full-width q-px-xs q-mt-auto q-pt-xl">{{ anime.title }}</h1>
        <div :class="`column full-width q-pa-${isSmallElement ? 'xs' : 'sm'} q-mt-auto`">
          <div
            v-if="anime.nextEpisodeAiringDate"
            class="row justify-center full-width"
            :class="`q-mb-${isSmallElement ? 'sm' : 'md'}`"
          >
            <h2 class="full-width fit-text"><q-icon name="schedule" class="q-mr-xs" /> {{ formattedAiringDate }}</h2>
          </div>
          <q-chip
            :size="isSmallElement ? 'sm' : 'md'"
            :text-color="anime.isLastEpisode ? 'positive' : 'secondary'"
            class="col-auto bg-white overflow-hidden"
            :class="{ 'q-pb-xs': anime.totalEpisodes, 'q-pa-none': isSmallElement, 'q-pa-xs': !isSmallElement }"
          >
            <div class="row justify-center full-width">
              Episode {{ anime.nextEpisode }}
              <span v-if="anime.totalEpisodes && !isSmallElement"> / {{ anime.totalEpisodes }} </span>
            </div>
            <q-linear-progress
              v-if="anime.totalEpisodes"
              :value="anime.progress"
              :color="anime.isLastEpisode ? 'positive' : 'secondary'"
              class="absolute-bottom"
            />
          </q-chip>
        </div>
      </div>
    </a>
  </q-card>
</template>

<script>
import { DateTime } from 'luxon';

export default {
  props: {
    anime: {
      type: Object,
      required: true,
    },
  },
  data() {
    return {
      width: 0,
      loading: true,
    };
  },
  computed: {
    formattedAiringDate() {
      const now = DateTime.local();
      const episodeAiringDate = this.anime.nextEpisodeAiringDate;
      const hours = Math.ceil(Math.abs(episodeAiringDate.diff(now, 'hours').toObject().hours));
      if (hours <= 24) {
        return episodeAiringDate.day === now.day
          ? episodeAiringDate.toRelative()
          : episodeAiringDate.toRelativeCalendar();
      }
      const weekday = episodeAiringDate.weekdayLong;
      const date = episodeAiringDate.toLocaleString(this.isSmallElement ? DateTime.DATE_FULL : DateTime.DATE_MED);
      return this.isSmallElement ? date : `${weekday} ${date}`;
    },
    episodeUrl() {
      return this.anime.cover; // TODO
    },
    isSmallElement() {
      return this.width < 176;
    },
  },
  mounted() {
    this.width = this.$el.offsetWidth;
  },
  methods: {
    handleResize(size) {
      // avoid unnecessary updates
      if (size.width !== this.width) {
        this.width = size.width;
      }
    },
    updateEpisode() {
      const notification = {};
      const completed = this.anime.isLastEpisode;

      if (completed) {
        notification.message = `Hooray! You've completed ${this.anime.title}!`;
        notification.type = 'positive';
      } else {
        notification.message = `Updated ${this.anime.title} to episode ${this.anime.nextEpisode}.`;
        notification.color = 'primary';
      }

      this.anime.lastWatchedEpisode = this.anime.nextEpisode;

      this.$q.notify(notification);

      // prevent focus state
      this.$refs.fabNext.$el.focus();
      this.$refs.fabNext.$el.blur();
    },
  },
};
</script>
