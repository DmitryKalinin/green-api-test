# AGENTS.md

Контекст для AI-агентов (Claude Code, Codex, Cursor, Copilot и др.), которые работают с этим
репозиторием или проверяют его.

## Проект

Веб-чат для отправки и получения текстовых сообщений в мессенджере MAX через GREEN-API.
React 19 + TypeScript + Redux Toolkit (RTK Query), Vite, CSS Modules.
Исходное задание — [`docs/TASK.md`](docs/TASK.md).

**Проверяете решение?** Начните с [`docs/REVIEW.md`](docs/REVIEW.md): там таблица
«требование → код → проверка» и сценарий ручной проверки.

## Команды

```bash
npm ci             # установка зависимостей
npm run dev        # dev-сервер, http://localhost:5173
npm test           # unit-тесты (Vitest)
npm run lint       # ESLint
npm run build      # tsc -b && vite build → dist/
npm run format     # Prettier
```

Перед коммитом должны проходить `npm run lint`, `npm test` и `npm run build`. Те же шаги
выполняет CI (`.github/workflows/deploy.yml`) перед публикацией на GitHub Pages.

## Карта кода

| Путь                                  | Что там                                                                                       |
| ------------------------------------- | --------------------------------------------------------------------------------------------- |
| `src/api/greenApi.ts`                 | RTK Query API: `getStateInstance`, `sendMessage`, `receiveNotification`, `deleteNotification` |
| `src/api/types.ts`                    | типы уведомлений GREEN-API                                                                    |
| `src/hooks/useNotificationPolling.ts` | цикл получения входящих (long polling)                                                        |
| `src/utils/parseNotification.ts`      | уведомление → `Message` или `null` (чистая функция)                                           |
| `src/utils/phone.ts`                  | нормализация и форматирование номера                                                          |
| `src/features/auth/`                  | экран входа, `authSlice`                                                                      |
| `src/features/chats/`                 | список чатов, создание чата, `chatsSlice` (чаты + сообщения)                                  |
| `src/features/chat/`                  | окно переписки, поле ввода, «пузыри» сообщений                                                |
| `src/app/`                            | store, типизированные хуки, сохранение в `localStorage`                                       |

Подробнее — [`docs/ARCHITECTURE.md`](docs/ARCHITECTURE.md), работа с API —
[`docs/GREEN_API.md`](docs/GREEN_API.md).

## Поток данных

1. Вход: `LoginPage` → `getStateInstance` (проверка данных) → `authSlice.login`.
2. Отправка: `ChatWindow` → `sendMessage` → `chatsSlice.messageAdded` (по `idMessage` из ответа).
3. Получение: `useNotificationPolling` → `receiveNotification` → `parseNotification` →
   `messageAdded` → `deleteNotification` → следующий запрос.

## Инварианты — не ломать

- **Каждое полученное уведомление удаляется** (`deleteNotification`), даже нераспознанное.
  Иначе очередь GREEN-API «встаёт» и отдаёт одно и то же уведомление бесконечно.
- **Опрос последовательный**: следующий `receiveNotification` — только после обработки
  предыдущего. `setInterval` не использовать: запрос держится до 5 с (`receiveTimeout`).
- **Цикл останавливается при размонтировании**: `abort()` текущего запроса и проверка флага
  после `await` (в dev React StrictMode монтирует эффекты дважды).
- **Дедупликация по `idMessage`** в `messageAdded`: отправленное сообщение приходит ещё и как
  `outgoingAPIMessageReceived`.
- **`chatId` личного чата — `79991234567@c.us`**, в UI показывается номер.
- **`base: './'`** в `vite.config.ts` — сайт публикуется из подпапки GitHub Pages.

## Стиль кода

- Prettier: без `;`, одинарные кавычки, trailing commas, ширина 100. ESLint с `typescript-eslint`.
- Стили — CSS Modules рядом с компонентом, цвета через CSS-переменные из `src/index.css`.
- Состояние — Redux Toolkit, запросы — только через RTK Query (`src/api/greenApi.ts`).
- Комментарии на русском и только там, где решение неочевидно.
- Тесты — рядом с кодом, `*.test.ts`. Логику держать в чистых функциях и редьюсерах, чтобы её
  можно было тестировать без DOM и сети.

## Процесс

Проект разработан в паре «разработчик + Claude Code» — см.
[`docs/AI_WORKFLOW.md`](docs/AI_WORKFLOW.md).
