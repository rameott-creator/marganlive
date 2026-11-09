# полутон · poluton

**Полутон — форум ночных разговоров.** Независимое русскоязычное сообщество о технологиях, разработке и цифровой жизни: разделы, живые обсуждения, репутация, реакции, закладки и уведомления. Тёмная сливово-графитовая тема, лавандовый акцент, «техно-журнал × уютный ночной клуб».

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

Сайт — статика из `dist/`, поэтому деплоим именно её:

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
├─ public/favicon.svg    # знак «полутон»
└─ src/
   ├─ App.tsx            # композиция, роутинг (главная / тема), состояние
   ├─ state.ts           # localStorage: реакции, закладки, темы, настройки
   ├─ data/forum.ts      # типы + стартовые данные (13 тем, авторы, уведомления)
   ├─ components/        # TopBar, Feed, CategoryNav, Sidebar, ThreadView, …
   └─ styles.css         # дизайн-система (токены, панели, адаптив)
```

Данные пользовательских действий (реакции, закладки, созданные темы, переключатели)
хранятся в `localStorage` под ключом `poluton-state-v1`.

## Стек

React 18 · TypeScript (strict) · Vite 5 · чистый CSS с дизайн-токенами, без UI-китов.
Иконки — inline SVG, аватары — генерация по инициалам.

## Лицензия

MIT (при необходимости добавьте файл LICENSE).
