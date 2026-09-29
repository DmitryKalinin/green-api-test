# Гид для проверяющего

Документ для ревьюера — человека или AI-агента. Здесь: где реализовано каждое требование
задания, как это проверить и что сделано сверх задания. Текст задания — [TASK.md](TASK.md).

## Требования → код → проверка

| №   | Требование                                  | Реализация                                                                                                                                                                                                   | Проверка                                                              |
| --- | ------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ | --------------------------------------------------------------------- |
| 1   | UI для отправки и получения сообщений в MAX | [`App.tsx`](../src/App.tsx), [`ChatWindow.tsx`](../src/features/chat/ChatWindow.tsx), [`Sidebar.tsx`](../src/features/chats/Sidebar.tsx)                                                                     | сценарий ниже                                                         |
| 2   | Используется GREEN-API                      | [`greenApi.ts:31`](../src/api/greenApi.ts#L31) — URL `{apiUrl}/waInstance{id}/{method}/{token}`                                                                                                              | вкладка Network                                                       |
| 3   | Только текстовые сообщения                  | [`parseNotification.ts:14`](../src/utils/parseNotification.ts#L14) — `textMessage` и `extendedTextMessage`, остальное игнорируется                                                                           | [`parseNotification.test.ts`](../src/utils/parseNotification.test.ts) |
| 4   | Внешний вид как у web.max.ru                | [`index.css`](../src/index.css) (переменные темы), [`Layout.module.css`](../src/components/Layout.module.css), [`MessageBubble.module.css`](../src/features/chat/MessageBubble.module.css)                   | визуально                                                             |
| 5   | Максимально простой интерфейс               | список чатов + окно переписки, без лишних экранов                                                                                                                                                            | визуально                                                             |
| 6   | Отправка — `SendMessage`                    | [`greenApi.ts:66`](../src/api/greenApi.ts#L66), вызов в [`ChatWindow.tsx:37`](../src/features/chat/ChatWindow.tsx#L37)                                                                                       | шаг 4 сценария                                                        |
| 7   | Получение — HTTP API                        | [`greenApi.ts:69`](../src/api/greenApi.ts#L69) `receiveNotification`, [`:73`](../src/api/greenApi.ts#L73) `deleteNotification`, цикл в [`useNotificationPolling.ts`](../src/hooks/useNotificationPolling.ts) | шаг 5 сценария                                                        |
| 8   | React                                       | React 19, [`package.json`](../package.json)                                                                                                                                                                  | —                                                                     |

## Ожидаемый результат → код

| Шаг из задания                         | Где                                                                                                                                                                         | Тест                                                                                                            |
| -------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------- |
| Ввод `idInstance` и `apiTokenInstance` | [`LoginPage.tsx:17`](../src/features/auth/LoginPage.tsx#L17), данные проверяются через `getStateInstance` ([`:29`](../src/features/auth/LoginPage.tsx#L29))                 | —                                                                                                               |
| Ввод номера и создание чата            | [`NewChatForm.tsx:14`](../src/features/chats/NewChatForm.tsx#L14) → [`normalizePhone`](../src/utils/phone.ts#L5) → [`chatCreated`](../src/features/chats/chatsSlice.ts#L20) | [`phone.test.ts`](../src/utils/phone.test.ts), [`chatsSlice.test.ts`](../src/features/chats/chatsSlice.test.ts) |
| Отправка текстового сообщения          | [`ChatWindow.tsx:37`](../src/features/chat/ChatWindow.tsx#L37)                                                                                                              | —                                                                                                               |
| Получатель отвечает в MAX              | внешнее действие                                                                                                                                                            | —                                                                                                               |
| Ответ виден в чате                     | [`useNotificationPolling.ts:49`](../src/hooks/useNotificationPolling.ts#L49) → [`messageAdded`](../src/features/chats/chatsSlice.ts#L37)                                    | [`chatsSlice.test.ts`](../src/features/chats/chatsSlice.test.ts)                                                |

## Проверка за 5 минут

1. **Инстанс.** В [личном кабинете GREEN-API](https://console.green-api.com/) — авторизованный
   инстанс MAX. В настройках: `webhookUrl` пустой, входящие уведомления включены
   (подробнее — [GREEN_API.md](GREEN_API.md#настройки-инстанса)).
2. **Запуск.** Демо — https://dmitrykalinin.github.io/green-api-test/ или локально: `npm ci && npm run dev`.
3. **Вход.** `idInstance`, `apiTokenInstance`, `apiUrl` (по умолчанию `https://api.green-api.com/v3`).
   При неверных данных — сообщение об ошибке, в чат не пускает.
4. **Чат и отправка.** Ввести номер в любом формате (`+7 999 123-45-67`, `8999…`) → «+» →
   написать сообщение → Enter. Сообщение появляется справа, в MAX приходит получателю.
5. **Получение.** Ответить из MAX. Ответ появляется слева в течение ~5 секунд.
6. **Автоматические проверки:** `npm run lint && npm test && npm run build` (17 тестов).

## Сверх задания

- Проверка учётных данных до входа (`getStateInstance`) и понятные ошибки.
- Нормализация номера: `8…` → `7…`, скобки, пробелы, дефисы.
- Сообщения, отправленные с телефона, тоже видны в чате (`outgoingMessageReceived`).
- Чат создаётся сам, если написали с нового номера.
- Чаты и вход сохраняются в `localStorage`, «Выйти» очищает всё.
- Мобильная вёрстка: на узком экране — список или чат с кнопкой «назад».
- Unit-тесты, ESLint + Prettier, CI и автодеплой на GitHub Pages.
- Документация для людей и агентов: [`AGENTS.md`](../AGENTS.md), [ARCHITECTURE.md](ARCHITECTURE.md).

## Известные ограничения

- **`chatId` в MAX.** Личный чат адресуется как `номер@c.us`. Документация MAX допускает и
  числовой `chatId` (`10000000`); если входящее придёт с таким `chatId`, оно попадёт в
  отдельный чат, а не в чат, открытый по номеру.
- **Нет истории с сервера.** Видны сообщения, отправленные и полученные после входа.
- **Токен в `localStorage`.** Приемлемо для клиентского приложения без бэкенда, но стоит знать.
- **Живая проверка на инстансе MAX:** <!-- TODO(автор): отметить дату и результат живой проверки --> _не отмечена_.
