# Работа с GREEN-API

Документация: [green-api.com/v3/docs](https://green-api.com/v3/docs/). Все запросы идут на

```
{apiUrl}/waInstance{idInstance}/{method}/{apiTokenInstance}
```

`apiUrl` по умолчанию `https://api.green-api.com/v3`, задаётся на экране входа.

## Используемые методы

| Метод                                                                                     | HTTP                                     | Где используется                              |
| ----------------------------------------------------------------------------------------- | ---------------------------------------- | --------------------------------------------- |
| `getStateInstance`                                                                        | `GET`                                    | проверка данных при входе; нужен `authorized` |
| [`sendMessage`](https://green-api.com/v3/docs/api/sending/SendMessage/)                   | `POST {chatId, message}` → `{idMessage}` | отправка сообщения                            |
| [`receiveNotification`](https://green-api.com/v3/docs/api/receiving/technology-http-api/) | `GET ?receiveTimeout=5`                  | получение одного уведомления или `null`       |
| [`deleteNotification`](https://green-api.com/v3/docs/api/receiving/technology-http-api/)  | `DELETE …/{receiptId}`                   | подтверждение обработки уведомления           |

## Формат `chatId`

Личный чат — `79991234567@c.us`. Пользователь вводит номер в любом формате, он приводится к
`79991234567` ([`phone.ts`](../src/utils/phone.ts)), суффикс добавляется при создании чата.

## Обрабатываемые уведомления

| `typeWebhook`                | Что это                                    | Результат                              |
| ---------------------------- | ------------------------------------------ | -------------------------------------- |
| `incomingMessageReceived`    | входящее сообщение                         | сообщение слева                        |
| `outgoingMessageReceived`    | отправлено с телефона                      | сообщение справа                       |
| `outgoingAPIMessageReceived` | отправлено через API (из этого приложения) | дубликат, отбрасывается по `idMessage` |
| остальные                    | статусы, состояние инстанса и т.д.         | игнорируются, но удаляются из очереди  |

| `typeMessage`         | Поле с текстом                       |
| --------------------- | ------------------------------------ |
| `textMessage`         | `textMessageData.textMessage`        |
| `extendedTextMessage` | `extendedTextMessageData.text`       |
| остальные (медиа)     | не поддерживаются по условию задания |

## Настройки инстанса

- `webhookUrl` — **пустой**. Если задан вебхук, уведомления уходят туда и не попадают в очередь
  HTTP API.
- `incomingWebhook` — `yes` (входящие).
- `outgoingWebhook`, `outgoingAPIMessageWebhook` — по желанию: исходящие с телефона и из API.
- Необработанные уведомления хранятся в очереди 24 часа и отдаются по порядку (FIFO).
