<template>
  <q-card>
    <q-card-section class="row items-center q-py-sm">
      <div class="text-center text-h6">{{ anime.title }}</div>
      <q-space />
      <q-btn v-close-popup icon="close" flat round dense color="grey" class="q-ml-md" />
    </q-card-section>
    <q-separator />
    <q-card-section>
      <q-list class="column">
        <div class="row">
          <q-item-section>
            <q-item-label v-t="'selectProvider'" header class="q-pt-none" />
            <provider-select :value="provider" options-dense :tooltip="false" @input="updateProvider" />
          </q-item-section>
        </div>
      </q-list>
    </q-card-section>
    <q-separator />
  </q-card>
</template>

<script>
import { mapGetters, mapMutations } from 'vuex';

export default {
  props: {
    anime: {
      type: Object,
      required: true,
    },
  },
  computed: {
    ...mapGetters('store', ['providerByAnimeTitle']),
    provider() {
      return this.providerByAnimeTitle(this.anime.title);
    },
  },
  methods: {
    ...mapMutations('store', ['setProvider']),
    updateProvider(provider) {
      this.setProvider({
        title: this.anime.title,
        provider,
      });
    },
  },
};
</script>
