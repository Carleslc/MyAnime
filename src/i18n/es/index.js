export default {
  all: 'Todo',
  any: 'Cualquiera',
  here: 'aquí',
  episode: 'Episodio',
  complete: 'Completar',
  nextEpisode: 'Siguiente episodio',
  settings: 'Ajustes',
  animeCalendar: 'Calendario Anime',
  animeCalendarDescription: 'Animes de esta semana',
  selectLanguage: 'Seleccionar idioma',
  selectProvider: 'Seleccionar proveedor',
  selectTitle: 'Seleccionar título alternativo',
  animeStatus: 'Estado de anime',
  animeStatusFilter: 'Filtrar por estado',
  alreadyAired: 'Disponible',
  notYetAired: 'No disponible',
  status: {
    watching: 'Siguiendo',
    onHold: 'En espera',
    planToWatch: 'En un futuro'
  },
  genre: 'Género',
  genres: {
    action: 'Acción',
    adventure: 'Aventuras',
    cars: 'Coches',
    comedy: 'Comedia',
    dementia: 'Demencia',
    demons: 'Demonios',
    drama: 'Drama',
    ecchi: 'Ecchi',
    fantasy: 'Fantasía',
    game: 'Juegos',
    harem: 'Harem',
    hentai: 'Hentai',
    historical: 'Historia',
    horror: 'Horror',
    josei: 'Josei',
    kids: 'Para niños',
    magic: 'Magia',
    martialArts: 'Artes marciales',
    mecha: 'Mecha',
    military: 'Militar',
    music: 'Música',
    mystery: 'Misterio',
    parody: 'Parodia',
    police: 'Policíaco',
    psychological: 'Psicológico',
    romance: 'Romance',
    samurai: 'Samurai',
    school: 'Escolar',
    scifi: 'Ciencia ficción',
    seinen: 'Seinen',
    shoujo: 'Shoujo',
    shoujoAi: 'Shoujo Ai',
    shounen: 'Shounen',
    shounenAi: 'Shounen Ai',
    sliceOfLife: 'Recuentos de la vida',
    space: 'Espacial',
    sports: 'Deportes',
    superPower: 'Superpoderes',
    supernatural: 'Supernatural',
    thriller: 'Thriller',
    vampire: 'Vampiros',
    yaoi: 'Yaoi',
    yuri: 'Yuri'
  },
  animeType: 'Tipo de anime',
  animeTypeFilter: 'Filtrar tipo de anime',
  movie: 'Película',
  special: 'Especial',
  music: 'Música',
  resetSettings: 'Restablecer ajustes',
  resetSettingsDescription: 'Borrar datos de usuario y filtros',
  aboutApp: 'Sobre esta aplicación',
  donate: `
  Esta aplicación es completamente gratuita y sin anuncios.
  Si te gusta la aplicación, puedes apoyarme por el precio de un café.
  ¡Muchas gracias!
  `,
  providerSelect: `
    Selecciona qué proveedor debe abrirse por defecto cuando hagas click en un episodio.
    Algunas opciones están basada en buscadores, intentando obtener un proveedor correcto, pero no siempre funciona.
    Si el proveedor seleccionado no puede encontrar un episodio prueba con otro proveedor o selecciona un título alternativo.
    Puedes sobreescribir el proveedor por defecto en los ajustes de cada anime.
  `,
  login: 'Iniciar sesión',
  loginDescription: 'Por favor, inicia sesión en tu cuenta de {api} para ver tu lista de animes y actualizar los episodios directamente desde esta app.',
  notRegisteredYet: '¿Todavía no estás registrado?',
  registerHere: 'Regístrate aquí',
  noPassword: 'Si tu cuenta no tiene contraseña porque utilizas una red social como Facebook, Twitter o Google para iniciar sesión ve a tus {0} y establece una contraseña primero.',
  accountSettings: 'ajustes de cuenta',
  updated: '{title} actualizado al episodio {episode}',
  completed: "¡Genial! ¡Has completado {title}!",
  statusChanged: 'El estado de {title} se ha cambiado a <strong>{status}</strong>',
  invalidGrant: 'Nombre de usuario o contraseña incorrectos',
  tooManyFailedLoginAttempts: 'Demasiados intentos fallidos. Prueba a iniciar sesión de nuevo en unas horas.',
  required: {
    username: 'Introduce tu nombre de usuario',
    password: 'Introduce tu contraseña',
  },
  username: 'Nombre de usuario',
  password: 'Contraseña',
  cancel: 'Cancelar',
  error: 'Vaya... ha ocurrido un error inesperado 😣',
  about: {
    description: 'Disfruta de tus animes favoritos con tu proveedor habitual, sincronizado con {api}.',
    why: {
      header: '¿Por qué usarme?',
      content: `
        Se trata de un acceso directo a los animes de {api} que estás siguiendo con tus páginas web favoritas.
        Evita buscar los episodios por internet o los proveedores de anime, simplemente siéntate y disfruta de tu siguiente episodio, esperándote a solo un click.
        Desde aquí puedes probar diferentes proveedores de anime y actualizar tus episodios en {api} con un solo click.
        También te ahorrarás algunos anuncios de las páginas principales de los proveedores donde ves anime porque accederás directamente a la página del anime o del episodio seleccionado.
      `
    },
    how: {
      header: 'Cómo usarme',
      enterYourUsername: 'Introduce tu nombre de usuario de {api} ({profileUrl}), selecciona tu proveedor favorito y elige uno de tus animes para ver, luego simplemente disfruta de tu episodio.',
      updateEpisode: `
        Haz click en '@:nextEpisode' en la esquina superior derecha de un episodio para marcarlo como visto en tu perfil de {api}.
        Cuando actualices tus episodios vistos en {api} el siguiente episodio se mostrará, esperándote a que lo veas.
      `,
    },
    features: {
      header: 'Características',
      list: `
        Imágenes de portada y enlaces a los animes en los que estás interesado.
        Fácil acceso a tus episodios pendientes de tus listas de {api} (@:status.watching, @:status.onHold y @:status.planToWatch), con varias páginas web donde poder verlos.
        Filtra episodios por estado (@:alreadyAired, @:notYetAired), tipo (TV, @:movie, OVA, @:special, ONA, @:music) y género.
        Algunos animes tienen varios títulos, escoge entre el original o un título alternativo en los ajustes del anime.
        Actualiza tus episodios vistos en tu perfil de {api} directamente desde esta página.
      `,
      note: 'Las preferencias se guardan en tu navegador, así que solo tendrás que cambiarlas cuando lo necesites.'
    },
    providers: {
      header: 'Proveedores soportados',
      note: `
        Algunas opciones se basan en motores de búsqueda, intentando obtener un proveedor adecuado, pero eso no signfica que funcione siempre. Algunas veces te puede redirigir a otro anime, a una página que no tiene nada que ver o simplemente a un episodio en otro idioma.
        Si el proveedor seleccionado no puede encontrar un episodio prueba a cambiar de proveedor o selecciona un título alternativo.
      `
    },
    contact: {
      header: 'Contacto',
      issue: '¿Tu proveedor favorito no está listado aquí? Por favor, abre una sugerencia {issue} y lo añadiremos.',
      note: 'Abre una sugerencia también si tienes alguna duda, consejo o si encuentras algo que no funciona como debería.',
    },
    disclaimer: {
      header: 'Atención',
      content: `
        Esta página web no almacena ningún vídeo, es solo una aplicación que enlaza el contenido de otras páginas web externas no afiliadas.
        Se recomienda utilizar los proveedores oficiales como Crunchyroll o Netflix. Usa otros proveedores bajo tu responsabilidad.
      `
    },
  }
};
