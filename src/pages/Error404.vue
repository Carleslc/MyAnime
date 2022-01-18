<template>
  <div class="fixed-center text-center">
    <p class="text-center">
      <img src="~assets/sad.svg" color="secondary" style="fill: red; width: 30vw; max-width: 150px;" />
    </p>
    <p class="text-center text-faded text-white">
      {{ $t('notFound') }}
      (<strong>404</strong>)
    </p>
    <q-btn color="secondary" style="width: 200px;" to="/" :label="$t('back')" />
  </div>
</template>

<script>
export default {
  name: 'Error404',
};
</script>
