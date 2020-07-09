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
    ...mapGetters('store', ['animesFilterByStatus', 'isLoading', 'isFetched', 'hasUsername']),
  },
  watch: {
    animesFilterByStatus() {
      if (this.animesFilterByStatus.length > this.animeMounted) {
        this.animeLoading();
      }
    },
    status() {
      this.animeMounted = 0;
      this.$refs.scroll.reset();
    },
    isFetched() {
      // Wait until first fetch (fetchAnimes) to load more
      if (this.isFetched) {
        this.$refs.scroll.reset();
      }
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
    animeLoaded() {
      this.animeMounted += 1;

      if (this.animeMounted === this.animesFilterByStatus.length) {
        this.loaded();
        this.$refs.scroll.resume();
      }
    },
    loadMoreAnimes(index, done) {
      const stop = this.api.hasError || !this.hasUsername || !this.isFetched;
      if (!stop && !this.isLoading) {
        if (index === 1) {
          // first fetch, already have animes
          done();
        } else {
          this.fetchMoreAnimes().then((hasMoreAnimesToLoad) => {
            done(!hasMoreAnimesToLoad);
          });
        }
      } else {
        done(stop);
      }
    },
  },
};
</script>
