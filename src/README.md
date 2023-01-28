# MyAnime (my-anime)

Watch your favourite animes synchronized with your usual provider.

## Install the dependencies

```bash
yarn
```

## Start the app in development mode (hot-code reloading, error reporting, etc.)

```bash
quasar dev
```

### Node >= v17

Set before `quasar dev`:

```bash
export NODE_OPTIONS=--openssl-legacy-provider
```

## Lint the files

```bash
yarn run lint
```

## Build the app for production

```bash
quasar build
```

## Serve production app

```bash
quasar serve -o --history dist/spa
```

## Deploy to Github Pages

```sh
git subtree push --prefix dist/spa origin gh-pages
```

## Upgrade Quasar

```bash
quasar upgrade -i
```

### Customize the configuration

See [Configuring quasar.conf.js](https://quasar.dev/quasar-cli/quasar-conf-js).
