<template>
  <q-card
    v-if="display"
    v-ripple
    class="anime-episode"
    :class="{ small: isSmallElement, 'on-hover': $q.platform.is.desktop }"
  >
    <q-resize-observer debounce="200" @resize="handleResize" />
    <a :href="episodeUrl" target="_blank" class="column justify-between full-height" @mousedown.prevent>
      <q-img
        :src="anime.cover"
        basic
        spinner-color="primary"
        class="full-height"
        @load="$emit('loaded', anime.title)"
        @error="$emit('loaded', anime.title)"
      />
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
            v-if="formattedAiringDate"
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
              <span v-if="anime.totalEpisodes && !isSmallElement" class="q-pl-xs">/ {{ anime.totalEpisodes }}</span>
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
import { mapState, mapMutations } from 'vuex';

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
    ...mapState('store', {
      provider: (state) => state.provider.value,
      typeFilter: (state) => state.typeFilter.map((filterType) => filterType.toLowerCase()),
      airingStatusFilter: 'airingStatusFilter',
    }),
    display() {
      return (
        !this.anime.isCompleted &&
        ((this.anime.isAired && this.airingStatusFilter.includes('Already aired')) ||
          (!this.anime.isAired && this.airingStatusFilter.includes('Not yet aired'))) &&
        this.typeFilter.includes(this.anime.type)
      );
    },
    broadcast() {
      if (this.anime.broadcast && this.anime.broadcast.weekday) {
        let estimation = DateTime.fromFormat(
          `${this.anime.broadcast.weekday} ${this.anime.broadcast.time || '23:59'}`,
          'EEEE HH:mm',
          { zone: 'Asia/Tokyo' }
        ).toLocal();
        if (this.anime.airingDate) {
          estimation = this.anime.airingDate.plus({
            weeks: this.anime.nextEpisode - 1,
            hours: estimation.hour + this.provider.offset,
            minutes: estimation.minute,
          });
        }
        return estimation;
      }
      return null;
    },
    nextEpisodeAiringDate() {
      if (this.anime.airingStatus === 'currently airing' && this.broadcast) {
        return {
          date: this.broadcast,
          precision: 'day',
        };
      }
      if (this.anime.airingDate) {
        return {
          date: this.anime.airingDate.plus(0), // make a copy to avoid mutations outside vuex
          precision: this.anime.airingDatePrecision,
        };
      }
      return null;
    },
    nextEpisodeIsAired() {
      return this.nextEpisodeAiringDate && this.nextEpisodeAiringDate.date <= DateTime.local();
    },
    formattedAiringDate() {
      if (this.nextEpisodeIsAired) {
        return null;
      }
      if (!this.nextEpisodeAiringDate) {
        return '?';
      }
      const { date, precision } = this.nextEpisodeAiringDate;
      const now = DateTime.local();
      const hours = Math.ceil(Math.abs(date.diff(now, 'hours').toObject().hours));
      if (hours <= 24) {
        // less than a day
        return date.day === now.day ? date.toRelative() : date.toRelativeCalendar();
      }
      if (precision === 'day') {
        const weekday = date.weekdayLong;
        const formattedDate = date.toLocaleString(this.isSmallElement ? DateTime.DATE_FULL : DateTime.DATE_MED);
        return this.isSmallElement ? date : `${weekday} ${formattedDate}`;
      }
      if (precision === 'month') {
        return date.toLocaleString({ month: 'long', year: 'numeric' });
      }
      return date.toLocaleString({ year: 'numeric' });
    },
    episodeUrl() {
      return this.provider.episodeUrl(this.anime);
    },
    isSmallElement() {
      return this.width < 176;
    },
  },
  mounted() {
    this.width = this.$el.offsetWidth;

    if (!this.display) {
      this.$emit('loaded', this.anime.title);
    }
  },
  methods: {
    ...mapMutations('store', ['nextEpisode']),
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

      this.nextEpisode(this.anime);

      this.$q.notify(notification);

      // prevent focus state
      this.$refs.fabNext.$el.focus();
      this.$refs.fabNext.$el.blur();
    },
  },
};
</script>
