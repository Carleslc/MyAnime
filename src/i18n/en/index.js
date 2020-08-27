export default {
  all: 'All',
  any: 'Any',
  here: 'here',
  episode: 'Episode',
  complete: 'Complete',
  nextEpisode: 'Next episode',
  settings: 'Settings',
  animeCalendar: 'Anime Calendar',
  animeCalendarDescription: 'Calendar anime for this week',
  selectLanguage: 'Select language',
  selectProvider: 'Select provider',
  selectTitle: 'Select alternative title',
  animeStatus: 'Anime status',
  animeStatusFilter: 'Filter anime status',
  alreadyAired: 'Already aired',
  notYetAired: 'Not yet aired',
  status: {
    watching: 'Watching',
    onHold: 'On Hold',
    planToWatch: 'Plan to Watch'
  },
  genre: 'Genre',
  genres: {
    action: 'Action',
    adventure: 'Adventure',
    cars: 'Cars',
    comedy: 'Comedy',
    dementia: 'Dementia',
    demons: 'Demons',
    drama: 'Drama',
    ecchi: 'Ecchi',
    fantasy: 'Fantasy',
    game: 'Game',
    harem: 'Harem',
    hentai: 'Hentai',
    historical: 'Historical',
    horror: 'Horror',
    josei: 'Josei',
    kids: 'Kids',
    magic: 'Magic',
    martialArts: 'Martial Arts',
    mecha: 'Mecha',
    military: 'Military',
    music: 'Music',
    mystery: 'Mystery',
    parody: 'Parody',
    police: 'Police',
    psychological: 'Psychological',
    romance: 'Romance',
    samurai: 'Samurai',
    school: 'School',
    scifi: 'Sci-Fi',
    seinen: 'Seinen',
    shoujo: 'Shoujo',
    shoujoAi: 'Shoujo Ai',
    shounen: 'Shounen',
    shounenAi: 'Shounen Ai',
    sliceOfLife: 'Slice of Life',
    space: 'Space',
    sports: 'Sports',
    superPower: 'Super Power',
    supernatural: 'Supernatural',
    thriller: 'Thriller',
    vampire: 'Vampire',
    yaoi: 'Yaoi',
    yuri: 'Yuri'
  },
  animeType: 'Anime type',
  animeTypeFilter: 'Filter anime type',
  movie: 'Movie',
  special: 'Special',
  music: 'Music',
  resetSettings: 'Reset settings',
  resetSettingsDescription: 'Clean user data and filters',
  aboutApp: 'About this app',
  donate: `
    This app is completely free and has no ads.
    If you like this app, you can support me for the price of a coffee.
    Thank you!
  `,
  providerSelect: `
    Select which provider must be opened by default when clicking over an episode.
    Some options are based on search engine, trying to get a proper streamer, but it doesn't mean it always work.
    If selected provider cannot find an episode try to change the provider or choose an alternative title.
    You can override the default provider in the settings of each anime.
  `,
  login: 'Log In',
  loginDescription: 'Please, log in to your {api} account to view your anime list and update episodes directly within this app.',
  notRegisteredYet: 'Not registered yet?',
  registerHere: 'Register here',
  noPassword: 'If your account has no password because it uses social media login like Facebook, Twitter or Google go to your {0} and set a password for your account first.',
  accountSettings: 'Account Settings',
  updated: 'Updated {title} to episode {episode}',
  completed: "Hooray! You've completed {title}!",
  statusChanged: '{title} status changed to <strong>{status}</strong>',
  invalidGrant: 'Incorrect username or password',
  tooManyFailedLoginAttempts: 'Too many failed login attempts. Please try to login again after several hours.',
  required: {
    username: 'Username is required',
    password: 'Password is required',
  },
  username: 'Username',
  password: 'Password',
  cancel: 'Cancel',
  error: 'Oops... an unexpected error has occurred 😣',
  about: {
    description: 'Watch your favourite animes with your usual provider, synchronized with {api}.',
    why: {
      header: 'Why to use?',
      content: `
        This is a shortcut to access your anime series with your preferred providers, all in sync with the selected animes in your {api} profile.
        Avoid surfing the internet or the providers looking for your episodes, just seat in and enjoy.
        With this single page you can test several providers and update your {api} episodes easily.
        It also skips some advertising from providers home sites, because you'll access to the anime or episode page directly.
      `
    },
    how: {
      header: 'How to use',
      enterYourUsername: 'Enter your {api} username ({profileUrl}), select your preferred provider and choose one of your animes to watch, then just enjoy your episode.',
      updateEpisode: `
        Click on '@:nextEpisode' at the top right corner of an episode to mark it as watched in your {api} profile.
        When updating your watched episodes in {api} then the next episode will be shown, waiting for you to be watched.
      `,
    },
    features: {
      header: 'Features',
      list: `
        Cover images and links for the series in which you are interested.
        Easy access to your next episodes of {api} lists @:status.watching, @:status.onHold and @:status.planToWatch, with several providers for streaming to choose.
        Filter episodes by status (@:alreadyAired, @:notYetAired), type (TV, @:movie, OVA, @:special, ONA, @:music) and genre.
        Some series have title synonyms, choose between original or alternative title in the settings of the anime.
        Update your watched episodes in your {api} profile directly within this page.
      `,
      note: 'Your preferences are saved in the browser, so you only need to change them when you need it. User is automatically retrieved based on the last user used.'
    },
    providers: {
      header: 'Supported providers',
      note: `
        Some options are based on search engine, trying to get a proper streamer, but it doesn't mean it always work. Sometimes it redirects to another anime, a non-related page, or it is in another language.
        If selected provider cannot find an episode try to change the provider or choose an alternative title.
      `
    },
    contact: {
      header: 'Contact',
      issue: 'Your favourite provider is not listed here? Please, open an issue {issue} and we will add it!',
      note: 'Open an issue too if you have any doubt, advice or you want to report about something broken.',
    },
    disclaimer: {
      header: 'Disclaimer',
      content: `
        This website does not host any video, it is a client-side website, just linking and sharing content from non-affiliated external providers.
        Official providers like Crunchyroll or Netflix are recommended. Use other providers at your own risk.
      `
    },
  }
};
