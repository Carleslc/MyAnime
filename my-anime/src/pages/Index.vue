<template>
  <div v-if="!loading" class="anime-container">
    <anime-episode
      v-for="(anime, i) in animes"
      :key="i"
      :title="anime.title"
      :img="anime.img"
      :episode="anime.episode"
      :total-episodes="anime.totalEpisodes"
      :airing-date="anime.airingDate"
    />
  </div>
</template>

<script>
import { DateTime } from 'luxon';

export default {
  data() {
    return {
      loading: true,
      animes: [
        {
          title: 'Kaguya-sama wa Kokurasetai?: Tensai-tachi no Renai Zunousen',
          img: 'https://cdn.myanimelist.net/images/anime/1764/106659.jpg',
          episode: 10,
          totalEpisodes: 12,
        },
        {
          title: 'One Piece',
          img: 'https://cdn.myanimelist.net/images/anime/6/73245.jpg',
          episode: 923,
          airingDate: DateTime.local().plus({ days: 1, hours: 5 }).toJSDate(),
        },
      ],
    };
  },
  mounted() {
    this.loading = false;
  },
};
</script>
