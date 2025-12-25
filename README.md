# jmeter-server-testing

Нагрузочное тестирование простого сервера управления проектами с помощью Apache JMeter.

Гайд:

1. Установить зависимости:

```bash
npm install
```

2. Инициализировать базу (создаст файл data/db.sqlite и начальные данные):

```bash
npm run init
```

3. Запустить сервер в dev-режиме:

```bash
npm run dev
```

API:
- GET /health — проверка статуса
- GET /projects — список проектов
- POST /projects — создать проект (body: { name, description })
- GET /projects/:id/tasks — список задач проекта
- POST /projects/:id/tasks — создать задачу (body: { title, description, due_date })

JMeter:
- Файл тест-плана: `jmeter/test_plan.jmx`.
- Установить JMeter: `brew install jmeter`.
- Запустить тест (CLI):

```bash
jmeter -n -t jmeter/test_plan.jmx -l jmeter/results.jtl -Jthreads=50 -Jduration=60
```