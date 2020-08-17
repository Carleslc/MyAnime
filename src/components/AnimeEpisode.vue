<template>
  <q-card
    v-if="display"
    v-ripple
    class="anime-episode"
    :class="{ small: isSmallElement, 'on-hover': $q.platform.is.desktop }"
  >
    <q-resize-observer debounce="200" @resize="handleResize" />
    <a
      :href="episodeUrl"
      target="_blank"
      class="column justify-between full-height"
      :aria-label="aria"
      @mousedown.prevent
    >
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
          ref="fabSettings"
          fab-mini
          icon="settings"
          color="white"
          text-color="primary"
          class="absolute-top-left q-ma-sm"
          tabindex="0"
          :aria-label="$t('settings')"
          @click.prevent="preventFocus('fabSettings')"
        >
          <q-tooltip
            transition-show="jump-right"
            transition-hide="jump-left"
            anchor="center right"
            self="center left"
            :offset="[10, 10]"
            :content-class="['text-primary', 'bg-white']"
          >
            {{ $t('settings') }}
          </q-tooltip>
          <q-menu class="z-max">
            <anime-settings :anime="anime" />
          </q-menu>
        </q-btn>
        <q-btn
          ref="fabNext"
          :fab="!isSmallElement"
          :fab-mini="isSmallElement"
          :text-color="anime.isLastEpisode ? 'positive' : 'accent'"
          :icon="anime.isLastEpisode ? 'library_add_check' : 'queue_play_next'"
          :loading="updating"
          color="white"
          class="absolute-top-right q-ma-sm"
          tabindex="0"
          :aria-label="nextLabel"
          @click.prevent="nextEpisode"
        >
          <q-badge v-if="!anime.isLastEpisode" color="secondary" floating>{{ anime.nextEpisode }}</q-badge>
          <q-tooltip
            transition-show="jump-down"
            transition-hide="jump-up"
            anchor="bottom left"
            self="top middle"
            :offset="[10, 8]"
            :content-class="[anime.isLastEpisode ? 'text-positive' : 'text-secondary', 'bg-white']"
            >{{ nextLabel }}
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
              {{ $t('episode') }} {{ anime.nextEpisode }}
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
import { mapGetters, mapState, mapActions } from 'vuex';

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
      updating: false,
    };
  },
  computed: {
    ...mapGetters('store', ['providerByAnimeTitle']),
    ...mapState('store', ['typeFilter', 'airingStatusFilter']),
    provider() {
      return this.providerByAnimeTitle(this.anime.title);
    },
    nextLabel() {
      return this.$t(this.anime.isLastEpisode ? 'complete' : 'nextEpisode');
    },
    aria() {
      return `${this.anime.title} ${this.$t('episode')} ${this.anime.nextEpisode}`;
    },
    display() {
      return (
        !this.anime.isCompleted &&
        ((this.nextEpisodeIsAired && this.airingStatusFilter.includes('already-aired')) ||
          (!this.nextEpisodeIsAired && this.airingStatusFilter.includes('not-yet-aired'))) &&
        this.typeFilter.includes(this.anime.type)
      );
    },
    broadcast() {
      if (this.anime.broadcast && this.anime.broadcast.weekday) {
        const broadcast = DateTime.fromFormat(
          `${this.anime.broadcast.weekday} ${this.anime.broadcast.time || '23:59'}`,
          'EEEE HH:mm',
          { zone: 'Asia/Tokyo' }
        ).toLocal();
        if (this.anime.airingDate) {
          const estimation = this.anime.airingDate.startOf('week').plus({
            weeks: this.anime.nextEpisode - 1,
            days: broadcast.weekday - 1,
            hours: broadcast.hour + this.provider.value.offset,
            minutes: broadcast.minute,
          });
          return {
            date: estimation,
            precision: this.anime.airingDatePrecision,
          };
        }
        return {
          date: broadcast,
          precision: 'day',
        };
      }
      return null;
    },
    nextEpisodeAiringDate() {
      if (this.anime.airingStatus !== 'finished airing') {
        if (this.broadcast) {
          return this.broadcast;
        }
        if (this.anime.airingStatus === 'not yet aired' && this.anime.airingDate && this.anime.nextEpisode === 1) {
          return {
            date: this.anime.airingDate.plus(0), // make a copy to avoid mutations outside vuex (https://github.com/moment/luxon/issues/323)
            precision: this.anime.airingDatePrecision,
          };
        }
      }
      return null;
    },
    nextEpisodeIsAired() {
      return (
        this.anime.airingStatus === 'finished airing' ||
        (this.anime.isAired && this.nextEpisodeAiringDate && this.nextEpisodeAiringDate.date <= DateTime.local())
      );
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
        return this.isSmallElement ? formattedDate : `${weekday} ${formattedDate}`;
      }
      if (precision === 'month') {
        return date.toLocaleString({ month: 'long', year: 'numeric' });
      }
      return date.toLocaleString({ year: 'numeric' });
    },
    episodeUrl() {
      return this.provider.value.episodeUrl(this.anime, this.anime.nextEpisode);
    },
    isSmallElement() {
      return this.width < 185;
    },
  },
  mounted() {
    this.width = this.$el.offsetWidth;

    if (!this.display) {
      this.$emit('loaded', this.anime.title);
    }
  },
  methods: {
    ...mapActions('store', ['updateEpisode']),
    handleResize(size) {
      // avoid unnecessary updates
      if (size.width !== this.width) {
        this.width = size.width;
      }
    },
    nextEpisode() {
      this.updating = true;

      const completed = this.anime.isLastEpisode;
      const status = this.anime.status;

      this.updateEpisode(this.anime)
        .then(({ ok }) => {
          if (ok) {
            if (completed) {
              this.$q.notify({
                message: `Hooray! You've completed ${this.anime.title}!`,
                color: 'positive',
              });
            } else {
              this.$q.notify({
                message: `Updated ${this.anime.title} to episode ${this.anime.lastWatchedEpisode}.`,
                color: 'primary',
              });
            }
            if (status !== 'watching') {
              this.$q.notify({
                message: `${this.anime.title} status changed to <strong>Watching</strong>`,
                type: 'info',
                html: true,
              });
            }
          }
        })
        .finally(() => {
          this.updating = false;
        });

      this.preventFocus('fabNext');
    },
    preventFocus(ref) {
      // prevent focus state
      this.$refs[ref].$el.focus();
      this.$refs[ref].$el.blur();
    },
  },
};
</script>
