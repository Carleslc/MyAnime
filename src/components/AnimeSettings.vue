<template>
  <q-card>
    <q-card-section class="row items-center no-wrap q-py-sm">
      <a :href="animeUrl" target="_blank" class="link text-center text-h6">{{ title }}</a>
      <q-space />
      <q-btn v-close-popup icon="close" flat round dense color="grey" class="q-ml-md" />
    </q-card-section>
    <q-separator />
    <q-card-section>
      <q-list class="column">
        <div class="row">
          <q-item-section>
            <q-item-label v-t="'selectProvider'" header class="q-pt-none q-px-sm" />
            <provider-select
              :value="provider"
              options-dense
              standout="filter-options"
              :tooltip="false"
              @input="updateProvider"
            />
          </q-item-section>
        </div>
        <div v-if="anime.titles.length > 1" class="row">
          <q-item-section>
            <q-item-label v-t="'selectTitle'" header class="q-px-sm" />
            <title-select :value="title" :titles="anime.titles" @input="updateTitle" />
          </q-item-section>
        </div>
      </q-list>
    </q-card-section>
    <q-separator />
  </q-card>
</template>

<script>
import { mapState, mapGetters, mapMutations } from 'vuex';

export default {
  props: {
    anime: {
      type: Object,
      required: true,
    },
  },
  computed: {
    ...mapState('store', {
      animeUrl({ api }) {
        return api.animeUrl(this.anime);
      },
    }),
    ...mapGetters('store', ['providerByAnimeTitle', 'titleByAnimeId']),
    provider() {
      return this.providerByAnimeTitle(this.title);
    },
    title() {
      return this.titleByAnimeId(this.anime.id) || this.anime.title;
    },
  },
  methods: {
    ...mapMutations('store', ['setProvider', 'setAlternativeTitle']),
    updateProvider(provider) {
      this.setProvider({
        title: this.title,
        provider,
      });
    },
    updateTitle(title) {
      this.setAlternativeTitle({
        anime: this.anime,
        title,
      });
    },
  },
};
</script>
