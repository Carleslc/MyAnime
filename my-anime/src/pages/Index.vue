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
    ...mapState('store', ['status']),
    ...mapGetters('store', ['animesFilterByStatus', 'isLoading', 'isFetched', 'hasError']),
  },
  watch: {
    animesFilterByStatus() {
      console.log('animesFilterByStatus');
      if (this.animesToMount === 0 || this.animesFilterByStatus.length > this.animeMounted) {
        this.animeLoading();
      }
    },
    status() {
      console.log('status changed');
      this.animeMounted = 0;
    },
  },
  methods: {
    ...mapMutations('store', ['loading', 'loaded']),
    ...mapActions('store', ['fetchAnimes', 'fetchMoreAnimes']),
    animeLoading() {
      if (this.animeMounted >= this.animesFilterByStatus.length) {
        this.animeMounted = 0;
      }
      if (this.animesToMount > 0) {
        this.loading();
        console.log('anime loading');
      }
    },
    animeLoaded() {
      this.animeMounted += 1;

      console.log(`mounted ${this.animeMounted} / ${this.animesFilterByStatus.length}`);
      if (this.animeMounted === this.animesFilterByStatus.length) {
        this.loaded();
        console.log('anime loaded');
        this.$refs.scroll.reset();
        this.$refs.scroll.resume();
      }
    },
    loadMoreAnimes(index, done) {
      if (!this.isLoading) {
        console.log('fetchMoreAnimes, hasError?', this.hasError);
        this.fetchMoreAnimes().then((hasMoreAnimesToLoad) => {
          console.log('hasMoreAnimesToLoad', hasMoreAnimesToLoad);
          done(!hasMoreAnimesToLoad || this.hasError);
        });
      } else {
        done();
      }
    },
  },
};
</script>
