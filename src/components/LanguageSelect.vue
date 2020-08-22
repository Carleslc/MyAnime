<template>
  <q-select
    ref="languageSelect"
    :value="language"
    dark
    dense
    standout
    options-selected-class="filter-options"
    :options-dark="false"
    :options="languages"
    @input="selectLanguage($event)"
    @popup-show="focus()"
    @popup-hide="focus(false)"
  >
    <template v-slot:prepend>
      <q-icon name="language" />
    </template>
    <template v-slot:option="scope">
      <q-item v-ripple v-bind="scope.itemProps" v-on="scope.itemEvents">
        <q-item-section avatar>
          {{ scope.opt.icon }}
        </q-item-section>
        <q-item-section>
          <q-item-label>{{ scope.opt.label }}</q-item-label>
        </q-item-section>
      </q-item>
    </template>
  </q-select>
</template>

<script>
import { getLanguageIcon } from '@/boot/i18n';

export default {
  props: {
    value: {
      type: String,
      default: 'en',
    },
  },
  data() {
    return {
      language: null, // initialized at created()
      languages: [
        { label: 'English', value: 'en', icon: getLanguageIcon('en') },
        { label: 'Español', value: 'es', icon: getLanguageIcon('es') },
      ],
    };
  },
  created() {
    this.language = this.languages.find((language) => language.value === this.value) || this.languages[0];
  },
  methods: {
    sortLanguageOptions() {
      this.languages.sort((a, b) => (a === this.language ? -1 : a.label < b.label));
    },
    selectLanguage(language) {
      this.language = language;
      this.$emit('input', language.value);
      this.sortLanguageOptions();
    },
    focus(focus = true) {
      if (focus) {
        this.$refs.languageSelect.$el.classList.add('q-field--focused');
      } else {
        this.$refs.languageSelect.$el.classList.remove('q-field--focused');
      }
    },
  },
};
</script>
