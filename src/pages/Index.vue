<template>
  <q-infinite-scroll ref="scroll" class="anime-container" :offset="1000" @load="loadMoreAnimes">
    <anime-episode v-for="anime in animesFilterByStatus" :key="anime.title" :anime="anime" @loaded="animeLoaded" />
    <template v-slot:loading>
      <div class="column full-height justify-center items-center">
        <q-spinner-dots color="primary" size="64px" />
      </div>
    </template>
  </q-infinite-scroll>
</template>

<script>
import { mapState, mapGetters, mapMutations, mapActions } from 'vuex';

export default {
  data() {
    return {
      animeMounted: 0,
    };
  },
  computed: {
    ...mapState('store', ['status', 'api']),
    ...mapGetters('store', ['animesFilterByStatus', 'isLoading', 'hasUsername']),
  },
  watch: {
    animesFilterByStatus() {
      if (this.animesFilterByStatus.length > this.animeMounted) {
        this.animeLoading();
      }
    },
    status() {
      this.animeMounted = 0;
    },
  },
  methods: {
    ...mapMutations('store', ['loading', 'loaded']),
    ...mapActions('store', ['fetchMoreAnimes']),
    animeLoading() {
      this.loading();
      if (this.animeMounted >= this.animesFilterByStatus.length) {
        this.animeMounted = 0;
      }
    },
    resetScroll() {
      this.$refs.scroll.reset();
      this.$refs.scroll.resume();
    },
    animeLoaded() {
      this.animeMounted += 1;

      if (this.animeMounted === this.animesFilterByStatus.length) {
        this.loaded();
        this.resetScroll();
      }
    },
    loadMoreAnimes(index, done) {
      const stop = this.api.hasError || !this.hasUsername;
      if (!stop && !this.isLoading) {
        this.fetchMoreAnimes().then((hasMoreAnimesToLoad) => {
          done(!hasMoreAnimesToLoad);
        });
      } else {
        done(stop);
      }
    },
  },
};
</script>
