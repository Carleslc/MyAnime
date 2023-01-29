<template>
  <q-card class="about">
    <q-card-section class="row justify-center items-center q-pa-lg">
      <h1 class="text-center">MyAnime</h1>
      <div class="absolute-right">
        <q-img v-if="!small" src="chibi.png" width="96px" class="q-ma-md" />
      </div>
    </q-card-section>
    <q-separator />
    <q-card-section :class="`q-py-lg ${small ? 'q-px-lg' : 'q-px-xl'}`">
      <i18n path="about.description" tag="p" class="q-mb-xs">
        <template v-slot:api>
          <a :href="api.homeUrl" target="_blank">{{ api.name }}</a>
        </template>
      </i18n>
      <div class="section">
        <h2 v-t="'about.why.header'" />
        <div v-html="p('about.why.content', { api: api.name })" />
      </div>
      <div class="section">
        <h2 v-t="'about.how.header'" />
        <i18n path="about.how.enterYourUsername" tag="p">
          <template v-slot:api>
            {{ api.name }}
          </template>
          <template v-slot:profileUrl>
            <i>{{ api.profileUrl + 'USERNAME' }}</i>
          </template>
        </i18n>
        <div v-html="p('about.how.updateEpisode', { api: api.name })" />
      </div>
      <div class="section">
        <h2 v-t="'about.features.header'" />
        <ul class="q-gutter-y-sm" v-html="li('about.features.list', { api: api.name })" />
        <p v-t="'about.features.note'" />
      </div>
      <div class="section">
        <h2 v-t="'about.providers.header'" />
        <ul>
          <li><a href="https://myanimelist.net/" target="_blank">MyAnimeList</a></li>
          <li><a href="https://www.crunchyroll.com/" target="_blank">Crunchyroll</a></li>
          <li><a href="https://www.netflix.com/" target="_blank">Netflix</a></li>
          <li><a href="https://www.google.com/" target="_blank">Google</a></li>
          <li>🇬🇧 <a href="https://9anime.to/" target="_blank">9Anime</a></li>
          <li>🇬🇧 <a href="https://zoro.to/" target="_blank">Zoro</a></li>
          <li>🇬🇧 <a href="https://yugen.to/" target="_blank">YugenAnime</a></li>
          <li>🇬🇧 <a href="https://gogoanime.bid/" target="_blank">GogoAnime</a></li>
          <li>🇬🇧 <a href="https://gogoanime.page/" target="_blank">GogoAnime.page</a></li>
          <li>🇬🇧 <a href="https://animesuge.to/" target="_blank">AnimeSuge</a></li>
          <li>🇬🇧 <a href="https://animepahe.ru/" target="_blank">animepahe</a></li>
          <li>🇬🇧 <a href="https://animeheaven.ru/" target="_blank">AnimeHeaven</a></li>
          <li>🇬🇧 <a href="https://animeflix.live/" target="_blank">Animeflix</a></li>
          <li>🇬🇧 <a href="https://duckduckgo.com/" target="_blank">I'm Feeling Lucky</a></li>
          <li>🇪🇸 <a href="https://duckduckgo.com/" target="_blank">Voy a tener suerte</a></li>
          <li>🇪🇸 <a href="https://www.animeflv.net" target="_blank">AnimeFlv</a></li>
          <li>🇪🇸 <a href="https://www.animeid.tv/" target="_blank">AnimeID</a></li>
          <li>🇪🇸 <a href="https://animefenix.tv/" target="_blank">AnimeFenix</a></li>
          <li>🇪🇸 <a href="http://jkanime.net/" target="_blank">jkanime</a></li>
          <li>🇪🇸 <a href="https://monoschinos2.com/" target="_blank">MonosChinos</a></li>
          <li>🇪🇸 <a href="https://animemovil2.com/" target="_blank">AnimeMovil</a></li>
        </ul>
        <p v-html="p('about.providers.note')" />
      </div>
      <div class="section">
        <h2 v-t="'about.contact.header'" />
        <p>
          <i18n path="about.contact.issue" tag="i">
            <template v-slot:issue>
              <a href="http://github.com/Carleslc/MyAnime/issues" target="_blank">{{ $t('here') }}</a>
            </template>
          </i18n>
        </p>
        <p v-t="'about.contact.note'" class="q-mb-none" />
      </div>
      <div class="section">
        <i><h2 v-t="'about.disclaimer.header'" /></i>
        <div v-html="p('about.disclaimer.content')" />
      </div>
    </q-card-section>
    <q-separator />
    <q-card-actions align="center" style="max-height: 80vh;" class="scroll q-pa-none">
      <q-btn v-close-popup flat label="OK" color="secondary" class="full-width q-pa-sm" />
    </q-card-actions>
  </q-card>
</template>

<script>
import { mapState } from 'vuex';
import { nl2 } from '@/utils/strings';

export default {
  computed: {
    ...mapState('store', ['api']),
    small() {
      return this.$q.screen.xs;
    },
  },
  methods: {
    p(key, args) {
      return nl2(this.$t(key, args), 'p');
    },
    li(key, args) {
      return nl2(this.$t(key, args), 'li');
    },
  },
};
</script>

<style lang="scss">
.about {
  a {
    color: $accent;
    text-decoration: none;

    &:hover,
    &:active {
      text-decoration: underline;
    }
  }

  ul {
    margin-top: 0;

    a {
      color: $secondary;

      &:hover,
      &:active {
        color: $accent;
        text-decoration: none;
      }
    }
  }

  .section {
    p:last-child {
      margin-bottom: 0;
    }
  }
}
</style>
