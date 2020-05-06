<template>
  <q-card v-if="!isCompleted" v-ripple class="anime-episode" :class="{ small: isSmallElement }">
    <q-resize-observer @resize="handleResize" debounce="200" />
    <a :href="episodeUrl" target="_blank" @mousedown.prevent>
      <q-img :src="img" />
      <header class="column justify-center full-width full-height hoverable overlay q-px-xs">
        <h1 :class="`col-auto ${isAired ? 'q-pt-auto' : 'q-pt-lg'}`">{{ title }}</h1>
        <h2 v-if="!isAired" class="col-auto q-mt-lg">
          <q-icon name="schedule" class="q-mr-xs" />
          {{ formattedAiringDate }}
        </h2>
        <q-chip
          :size="isSmallElement ? 'sm' : 'md'"
          :text-color="isLastEpisode ? 'positive' : 'secondary'"
          :icon-right="this.width > 192 ? 'star' : undefined"
          :class="`absolute-bottom bg-white ${isSmallElement ? 'q-mb-sm q-mx-sm' : 'q-mb-md q-mx-md'}`"
        >
          <span class="column full-width text-center"
            ><span class="col-shrink"
              >Episode {{ nextEpisode }}
              <span v-if="totalEpisodes && !isSmallElement"> / {{ totalEpisodes }} </span>
            </span>
            <!-- FIXME -->
            <q-linear-progress
              rounded
              :value="progress"
              :color="isLastEpisode ? 'positive' : 'secondary'"
              class="col-grow"
            />
          </span>
        </q-chip>
      </header>
    </a>
    <q-btn
      ref="fabNext"
      :fab="!isSmallElement"
      :fab-mini="isSmallElement"
      :text-color="isLastEpisode ? 'positive' : 'accent'"
      :icon="isLastEpisode ? 'library_add_check' : 'queue_play_next'"
      color="white"
      class="absolute-top-right q-ma-sm hoverable"
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
  </q-card>
</template>

<script>
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
      const weekday = this.luxonAiringDate.weekdayLong;
      const date = this.luxonAiringDate.toLocaleString(DateTime.DATE_FULL);
      return `${weekday} ${date}`;
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
  },
  methods: {
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
    handleResize(size) {
      this.width = size.width;
    },
  },
};
</script>
