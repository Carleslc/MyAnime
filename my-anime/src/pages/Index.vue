<template>
  <q-page>
    <div class="anime-container">
      <anime-episode
        v-for="i in 20"
        :key="animes[i % 2].title"
        :title="animes[i % 2].title"
        :img="animes[i % 2].img"
        :episode="animes[i % 2].episode"
        :total-episodes="animes[i % 2].totalEpisodes"
        :airing-date="animes[i % 2].airingDate"
      />
    </div>
  </q-page>
</template>

<script>
import { DateTime } from 'luxon';

export default {
  data() {
    return {
      loading: false,
      animes: [
        {
          title: 'Kaguya-sama wa Kokurasetai?: Tensai-tachi no Renai Zunousen',
          img: 'https://cdn.myanimelist.net/images/anime/1764/106659.jpg',
          episode: 4,
          totalEpisodes: 12,
          airingDate: DateTime.local().plus({ days: 1 }).toJSDate(),
        },
        {
          title: 'Kaguya-sama wa Kokurasetai?: Tensai-tachi no Renai Zunousen',
          img: 'https://cdn.myanimelist.net/images/anime/1764/106659.jpg',
          episode: 11,
          totalEpisodes: 12,
        },
      ],
    };
  },
};
</script>
