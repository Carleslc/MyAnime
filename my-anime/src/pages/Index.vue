<template>
  <div class="anime-container">
    <anime-episode v-for="anime in animes" :key="anime.title" :anime="anime" />
  </div>
</template>

<script>
import { Anime } from '@/model/Anime';

export default {
  data() {
    return {
      animes: [
        new Anime({
          title: 'Kaguya-sama wa Kokurasetai?: Tensai-tachi no Renai Zunousen',
          cover: 'https://cdn.myanimelist.net/images/anime/1764/106659.jpg',
          lastWatchedEpisode: 10,
          totalEpisodes: 12,
        }),
        new Anime({
          title: 'One Piece',
          cover: 'https://cdn.myanimelist.net/images/anime/6/73245.jpg',
          lastWatchedEpisode: 923,
          broadcast: {
            weekday: 'sunday',
            time: '09:30',
          },
        }),
      ],
    };
  },
};
</script>
