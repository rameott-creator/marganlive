# margan.live

**margan.live — форум ночных разговоров.** Живое русскоязычное сообщество о технологиях, разработке и цифровой жизни: разделы, обсуждения, репутация, реакции, закладки и уведомления. Тёмная сливово-графитовая тема, лавандовый акцент, знак-эквалайзер.

Без маркетплейсов и рекламы — только обсуждения.

## Запуск локально

```bash
npm install
npm run dev        # http://localhost:5173
```

## Сборка и предпросмотр

```bash
npm run build      # tsc + vite build → dist/
npm run preview    # http://localhost:4173
```

## Заливка на VDS (piasdad.duckdns.org)

Сайт — статика из `dist/`, поэтому деплоим именно её.

### Вариант А — всё прямо на сервере (удобно с телефона/без Node на компьютере)

```bash
ssh root@piasdad.duckdns.org
apt update && apt install -y nodejs npm   # один раз
git clone https://github.com/rameott-creator/marganlive.git
cd marganlive && npm install && npm run build
rsync -avz --delete dist/ /var/www/html/
```

Для приватного репозитория clone по HTTPS запросит логин — нужен токен или SSH-ключ.
Проще всего: сделать репозиторий публичным (GitHub → Settings → General → Danger Zone →
Change visibility → Make public) — тогда clone анонимный и токен не нужен.
Альтернатива без раскрытия репо: на сервере `ssh-keygen -t ed25519 -N "" -f ~/.ssh/deploy`,
добавить `~/.ssh/deploy.pub` в Settings → Deploy keys (галка read-only) и клонировать по
`git@github.com:rameott-creator/marganlive.git`.

Для ОБНОВЛЕНИЯ после мержа в main:

```bash
cd ~/marganlive && git pull && npm install && npm run build && rsync -avz --delete dist/ /var/www/html/
```

### Вариант Б — сборка на своём компьютере, заливка на сервер

```bash
npm run build
rsync -avz --delete dist/ root@piasdad.duckdns.org:/var/www/html/
```

Один файл без пересборки так не обновится — всегда `npm run build` перед заливкой.

### Первичная настройка сервера (один раз)

```bash
ssh root@piasdad.duckdns.org
apt update && apt install nginx -y
systemctl enable --now nginx
```

## Структура

```
marganlive/
├─ index.html            # точка входа (Vite)
├─ public/favicon.svg    # знак-эквалайзер
└─ src/
   ├─ App.tsx            # композиция, роутинг (главная / тема), состояние
   ├─ state.ts           # localStorage: реакции, закладки, темы, настройки
   ├─ data/forum.ts      # типы + стартовые данные (13 тем, авторы, уведомления)
   ├─ components/        # TopBar, Feed, CategoryNav, Sidebar, ThreadView, …
   └─ styles.css         # дизайн-система (токены, панели, адаптив)
```

Данные пользовательских действий (реакции, закладки, созданные темы, переключатели)
хранятся в `localStorage` под ключом `marganlive-state-v1`.

## Стек

React 18 · TypeScript (strict) · Vite 5 · чистый CSS с дизайн-токенами, без UI-китов.
Иконки — inline SVG, аватары — генерация по инициалам.

## Лицензия

MIT (при необходимости добавьте файл LICENSE).
