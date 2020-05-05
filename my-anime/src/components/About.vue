<template>
  <q-card>
    <q-card-section class="column items-center">
      <h1>My Anime</h1>
    </q-card-section>
    <q-separator />
    <q-card-section>
      <p>
        Watch your favourite animes with your usual provider, synchronized with
        <a href="https://myanimelist.net/" target="_blank">MyAnimeList</a>.
      </p>
      <h2>Why to use?</h2>
      <p>
        This is a shortcut to access your preferred anime series with your preferred providers, all in sync with the
        selected animes in your MyAnimeList profile.
      </p>
      <p>Avoid surfing the internet or the providers looking for your episodes, just seat in and enjoy.</p>
      <p>
        With this single page you can test several providers and update your MyAnimeList episodes easily. It also skips
        some advertising from providers&#39; home sites, because you&#39;ll access to the episode page directly.
      </p>
      <h2>How to use</h2>
      <p>
        Enter your MyAnimeList username <em>(https://myanimelist.net/profile/USERNAME)</em> and choose one of your
        animes to watch, select the provider and enjoy your episode.
      </p>
      <p>
        When updating your watched episodes in MyAnimeList then the next episode will be shown, waiting for you to be
        watched.
      </p>
      <p>
        Click on &quot;Next&quot; at the top right corner of an episode to mark it as watched in your MyAnimeList
        profile.
      </p>
      <h2>Features</h2>
      <ul>
        <li>Cover images and links for the series in which you are interested.</li>
        <li>
          Easy access to your outstanding episodes of MyAnimeList lists Watching, On Hold and Plan to Watch, with
          several providers of streaming/downloading to choose.
        </li>
        <li>Filter episodes by 'Already aired', 'Not yet aired', TV, Movie, OVA, Special, ONA or Music.</li>
        <!--<li>Some series have title synonyms, choose between original or alternative title.</li>-->
        <li>
          Your preferences are saved in the browser, so you only need to change them when you need it. User is
          automatically retrieved based on the last user used.
        </li>
        <!--<li>Update your watched episodes in your MyAnimeList profile directly within this page.</li>-->
      </ul>
      <h2>Supported providers</h2>
      <ul>
        <li><a href="https://myanimelist.net/" target="_blank">MyAnimeList</a></li>
        <li>🇪🇸🇬🇧 <a href="https://www.google.com/" target="_blank">Google</a></li>
        <li>🇪🇸 Voy a tener suerte</li>
        <li>🇪🇸 <a href="https://www.animeflv.net" target="_blank">AnimeFlv</a></li>
        <li>🇪🇸 <a href="https://www.animeid.tv/" target="_blank">AnimeID</a></li>
        <li>🇪🇸 <a href="http://jkanime.net/" target="_blank">jkanime</a></li>
        <li>🇪🇸 <a href="https://monoschinos.com/" target="_blank">MonosChinos</a></li>
        <li>🇬🇧 I&#39;m Feeling Lucky</li>
        <li>🇬🇧 <a href="https://twist.moe/" target="_blank">Twist</a></li>
        <li>🇬🇧 <a href="https://www2.gogoanime.se/" target="_blank">GogoAnime</a></li>
        <li><a href="https://www.crunchyroll.com/" target="_blank">Crunchyroll</a></li>
        <li><a href="https://www.netflix.com/" target="_blank">Netflix</a></li>
      </ul>
      <p>Providers without language indicator are locale based.</p>
      <p>
        Feeling Lucky options are based on search engine (<em
          ><a href="https://duckduckgo.com/" target="_blank">DuckDuckGo</a> I&#39;m Feeling Ducky</em
        >), trying to get a proper streamer, but it doesn&#39;t mean it always work. Sometimes it redirects to a
        non-related page, or it is in another language.
      </p>
      <p>If selected provider cannot find a episode try to use alternative titles option, or change the provider.</p>
      <h2>Contact</h2>
      <p>
        <em
          >Your favourite provider isn&#39;t listed here? Please, open an issue
          <a href="http://github.com/Carleslc/MyAnime/issues" target="_blank">here</a> and we will add it!</em
        >
      </p>
      <p>Open an issue too if you have any doubt, advice or you want to report about something broken.</p>
      <h2>Disclaimer</h2>
      <p>
        This webpage does not host any video, it is a client-side website, just linking and sharing content from
        external providers. Official and legal providers like Crunchyroll or Netflix are recommended. Use other
        providers at your own risk.
      </p>
    </q-card-section>
    <q-separator />
    <q-card-actions align="center" style="max-height: 80vh;" class="scroll q-pa-none">
      <q-btn v-close-popup flat label="OK" color="secondary" class="full-width q-pa-sm" />
    </q-card-actions>
  </q-card>
</template>

<script>
export default {};
</script>
