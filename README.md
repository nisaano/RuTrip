<h1>Чтобы запустить проект вам нужно сделать следующее =></h1>

<h3>1. <i>Ввести в баш. Или вручную изменить название файла с .env.example на .env</i></h3>

```bash
cp .env.example .env
```

<h3><i>2. Заполнить .env своими значениями:</i></h3>  

В самом файле форма уже есть, просто введите пароль и имя пользователя.

<i>!!!<b>Важно<b>!!!: значения должны совпадать с docker-compose.yml, в этом файле нужно вставить свои значения:</i> 
<i>!!! Также убедитесь что в .env файле в этой строке "DATABASE_URL=postgresql+psycopg2://postgres:*******@db:5432/rutrip" вместо звездочек стоит ваш пароль "POSTGRES_PASSWORD: "</i>

```bash
POSTGRES_USER: твое_имя  
POSTGRES_PASSWORD: твой_пароль  
POSTGRES_DB: rutrip
```

<h2><i>3. Запуск проекта, у вас должен быть запущен Docker Desktop.</i></h2>

```bash
docker compose up -d --build
```

<i>!!!Важно!!! Миграции (если не применились автоматически):

```bash
docker compose exec backend alembic upgrade head
```

Проверка таблиц и контейнеров:</i>

```bash
docker compose ps
```

```bash
docker compose exec db psql -U <POSTGRES_USER> -d <POSTGRES_DB> -c "\dt"
```

<i>Управление:
Перезапуск -</i>

```bash
docker compose down
docker compose up -d
```

<i>Пересборка -</i>

```bash
docker compose up -d --build
```

<i>Логи -</i> 

```bash
docker compose logs backend --tail=50
docker compose logs ml_module --tail=50
```

<i>Важно не использовать без необходимости:</i>

```bash
docker compose down -v
```
