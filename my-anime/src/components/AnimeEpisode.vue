<template>
  <q-card
    v-if="!isCompleted"
    v-ripple
    class="anime-episode"
    :class="{ small: isSmallElement, 'on-hover': $q.platform.is.desktop }"
  >
    <q-resize-observer debounce="200" @resize="handleResize" />
    <!-- TODO: Settings store + Window resize listener -->
    <a :href="episodeUrl" target="_blank" class="column justify-between full-height" @mousedown.prevent>
      <q-img :src="img" spinner-color="primary" class="full-height" />
      <div class="absolute-full hoverable overlay column justify-center">
        <q-btn
          ref="fabNext"
          :fab="!isSmallElement"
          :fab-mini="isSmallElement"
          :text-color="isLastEpisode ? 'positive' : 'accent'"
          :icon="isLastEpisode ? 'library_add_check' : 'queue_play_next'"
          color="white"
          class="absolute-top-right q-ma-sm"
          taxindex="0"
          @click.prevent="updateEpisode"
        >
          <q-badge v-if="!isLastEpisode" color="secondary" floating>{{ nextEpisode }}</q-badge>
          <q-tooltip
            transition-show="jump-left"
            transition-hide="jump-right"
            anchor="center left"
            self="center right"
            :offset="[10, 10]"
            :content-class="[isLastEpisode ? 'text-positive' : 'text-secondary', 'bg-white']"
            >{{ isLastEpisode ? 'Complete' : 'Next episode' }}
          </q-tooltip>
        </q-btn>
        <h1 class="col-auto full-width q-px-xs q-mt-auto q-pt-xl">{{ title }}</h1>
        <div :class="`column full-width q-pa-${isSmallElement ? 'xs' : 'sm'} q-mt-auto`">
          <div v-if="!isAired" class="row justify-center full-width" :class="`q-mb-${isSmallElement ? 'sm' : 'md'}`">
            <h2 class="full-width fit-text"><q-icon name="schedule" class="q-mr-xs" /> {{ formattedAiringDate }}</h2>
          </div>
          <q-chip
            :size="isSmallElement ? 'sm' : 'md'"
            :text-color="isLastEpisode ? 'positive' : 'secondary'"
            class="col-auto bg-white overflow-hidden"
            :class="{ 'q-pb-xs': totalEpisodes, 'q-pa-none': isSmallElement, 'q-pa-xs': !isSmallElement }"
          >
            <div class="row justify-center full-width">
              Episode {{ nextEpisode }}
              <span v-if="totalEpisodes && !isSmallElement"> / {{ totalEpisodes }} </span>
            </div>
            <q-linear-progress
              v-if="totalEpisodes"
              :value="progress"
              :color="isLastEpisode ? 'positive' : 'secondary'"
              class="absolute-bottom"
            />
          </q-chip>
        </div>
      </div>
    </a>
  </q-card>
</template>

<script>
import fitty from 'fitty';
import { DateTime } from 'luxon';

export default {
  props: {
    title: {
      type: String,
      required: true,
    },
    img: {
      type: String,
      required: true,
    },
    episode: {
      type: Number,
      default: 1,
    },
    totalEpisodes: {
      type: Number,
      default: undefined,
    },
    airingDate: {
      type: Date,
      default: undefined,
    },
  },
  data() {
    return {
      nextEpisode: this.episode + 1,
      width: 0,
      loading: true,
    };
  },
  computed: {
    isAired() {
      return !this.airingDate || this.airingDate <= new Date();
    },
    luxonAiringDate() {
      return DateTime.fromJSDate(this.airingDate);
    },
    formattedAiringDate() {
      const now = DateTime.local();
      const hours = Math.ceil(Math.abs(this.luxonAiringDate.diff(now, 'hours').toObject().hours));
      if (hours <= 24) {
        return this.luxonAiringDate.day === now.day
          ? this.luxonAiringDate.toRelative()
          : this.luxonAiringDate.toRelativeCalendar();
      }
      const weekday = this.luxonAiringDate.weekdayLong;
      const date = this.luxonAiringDate.toLocaleString(this.isSmallElement ? DateTime.DATE_FULL : DateTime.DATE_MED);
      return this.isSmallElement ? date : `${weekday} ${date}`;
    },
    isLastEpisode() {
      return this.totalEpisodes === this.nextEpisode;
    },
    isCompleted() {
      return this.nextEpisode > this.totalEpisodes;
    },
    progress() {
      return this.totalEpisodes ? this.nextEpisode / this.totalEpisodes : 0;
    },
    episodeUrl() {
      return this.img; // TODO
    },
    isSmallElement() {
      return this.width < 176;
    },
  },
  mounted() {
    this.width = this.$el.offsetWidth;
    this.fitAiringDate();
  },
  methods: {
    handleResize(size) {
      if (size.width !== this.width) {
        // avoid unnecessary updates
        this.width = size.width;
        this.fitAiringDate();
      }
    },
    fitAiringDate() {
      fitty('.fit-text', { minSize: 12 });
    },
    updateEpisode() {
      const notification = {};
      const completed = this.isLastEpisode;

      if (completed) {
        notification.message = `Hooray! You've completed ${this.title}!`;
        notification.type = 'positive';
      } else {
        notification.message = `Updated ${this.title} to episode ${this.nextEpisode}.`;
        notification.color = 'primary';
      }

      this.nextEpisode += 1;

      this.$q.notify(notification);

      // prevent focus state
      this.$refs.fabNext.$el.focus();
      this.$refs.fabNext.$el.blur();
    },
  },
};
</script>
