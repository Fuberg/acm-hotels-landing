# ACM Hotels — site

Next.js (App Router) приложение — код лендинга и (позже) админки.

## Разработка

```bash
npm install
npm run dev
```

## Продакшен-сборка

```bash
npm run build
npm start
```

## Деплой

Собирается `Dockerfile`'ом в этой директории (`docker build .`), деплоится
через `docker-compose.yml` — единственный сервис `web`, без открытых портов
на хосте, подключён к внешней Docker-сети `edge` (см.
`docs/adr/0002-self-hosted-docker-behind-shared-edge-proxy.md`). Автоматизирует
это `.github/workflows/deploy.yml` в корне репозитория: сборка образа → публикация
в GHCR → деплой по SSH → проверка живого домена.
