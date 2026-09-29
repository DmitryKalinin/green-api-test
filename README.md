# MAX Chat

Веб-интерфейс для отправки и получения текстовых сообщений в мессенджере MAX
через [GREEN-API](https://green-api.com/max). Внешний вид — по мотивам [web.max.ru](https://web.max.ru/).

Тестовое задание на позицию «Фронтенд разработчик React».

## Возможности

- вход по `idInstance` и `apiTokenInstance` (данные проверяются запросом `getStateInstance`);
- создание чата по номеру телефона (`+7 999 123-45-67`, `8 999…`, `999…` — номер нормализуется);
- отправка текстовых сообщений — [SendMessage](https://green-api.com/v3/docs/api/sending/SendMessage/);
- получение сообщений — [HTTP API](https://green-api.com/v3/docs/api/receiving/technology-http-api/)
  (`ReceiveNotification` + `DeleteNotification`);
- показываются и сообщения, отправленные с телефона;
- чат создаётся автоматически, если написали с нового номера;
- чаты и данные входа сохраняются в `localStorage`, кнопка «Выйти» всё очищает;
- адаптивная вёрстка для телефона.

## Стек

React 19, TypeScript, Redux Toolkit + RTK Query, CSS Modules, Vite, Vitest, ESLint + Prettier.

## Запуск локально

Нужен Node.js 20+.

```bash
git clone <repo-url>
cd max-chat
npm install
npm run dev
```

Приложение откроется на http://localhost:5173.

Другие команды:

```bash
npm run build   # сборка в dist/
npm run preview # просмотр сборки
npm test        # unit-тесты
npm run lint    # ESLint
```

## Деплой на GitHub Pages

В репозитории есть workflow `.github/workflows/deploy.yml`: при пуше в `main` он запускает
линтер, тесты, собирает проект и публикует `dist/` на GitHub Pages.

Один раз нужно включить Pages: **Settings → Pages → Build and deployment → Source: GitHub Actions**.
После этого сайт будет доступен по адресу `https://<username>.github.io/<repo>/`.

В `vite.config.ts` задан `base: './'`, поэтому сборка работает из подпапки без дополнительной настройки.

## Настройка инстанса GREEN-API

1. Создайте инстанс для MAX в [личном кабинете](https://console.green-api.com/) и авторизуйте его.
2. В настройках инстанса:
   - поле **URL для получения уведомлений (webhookUrl)** должно быть пустым —
     иначе уведомления уходят на вебхук и не попадают в очередь HTTP API;
   - включите получение входящих уведомлений (`incomingWebhook`)
     и, по желанию, исходящих (`outgoingWebhook`, `outgoingAPIMessageWebhook`).
3. На странице входа укажите `idInstance`, `apiTokenInstance` и `apiUrl`
   (по умолчанию `https://api.green-api.com/v3`; если в кабинете указан другой хост — используйте его).

## Как это работает

- `src/api/greenApi.ts` — RTK Query API. URL запроса собирается из данных инстанса в сторе:
  `{apiUrl}/waInstance{idInstance}/{method}/{apiTokenInstance}`.
- `src/hooks/useNotificationPolling.ts` — цикл получения уведомлений. `receiveNotification`
  работает как long polling (`receiveTimeout=5`), поэтому следующий запрос отправляется
  только после обработки и удаления предыдущего уведомления.
- `src/utils/parseNotification.ts` — достаёт текст из `textMessage` / `extendedTextMessage`,
  остальные типы уведомлений игнорируются.
- `src/features/chats/chatsSlice.ts` — чаты и сообщения, дедупликация по `idMessage`.

## Ограничения

- поддерживаются только текстовые сообщения (по условию задания);
- история переписки не подгружается с сервера — видны сообщения, полученные после входа;
- `apiTokenInstance` хранится в `localStorage` браузера.
