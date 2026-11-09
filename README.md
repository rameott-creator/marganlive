# marganlive

Тестовый сайт. Деплоится на VDS вручную (без CI).

## Клонирование репозитория

```bash
git clone https://github.com/rameott-creator/marganlive.git
cd marganlive
```

## Первичная настройка VDS (один раз)

```bash
ssh root@piasdad.duckdns.org
apt update && apt install nginx -y
systemctl enable --now nginx
```

## Заливка новой версии сайта (после каждой правки)

Из папки репозитория на своём компьютере:

```bash
rsync -avz --delete --exclude='.git/' ./ root@piasdad.duckdns.org:/var/www/html/
```

Если правил только один файл (например, `index.html`), хватит:

```bash
scp index.html root@piasdad.duckdns.org:/var/www/html/
```

## Открыть сайт

http://piasdad.duckdns.org

## Структура

```
marganlive/
└── README.md
```

## Лицензия

MIT (при необходимости добавьте файл LICENSE).
