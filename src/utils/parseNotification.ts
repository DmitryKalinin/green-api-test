import type { MessageData, MessageWebhookBody, Notification } from '../api/types'
import type { Message } from '../types'

const MESSAGE_WEBHOOKS = [
  'incomingMessageReceived',
  'outgoingMessageReceived',
  'outgoingAPIMessageReceived',
]

function isMessageWebhook(body: Notification['body']): body is MessageWebhookBody {
  return MESSAGE_WEBHOOKS.includes(body.typeWebhook)
}

function extractText(data: MessageData): string | null {
  if ('textMessageData' in data) {
    return data.textMessageData.textMessage
  }
  // ответы с телефона часто приходят как extendedTextMessage (ссылки, цитаты)
  if ('extendedTextMessageData' in data) {
    return data.extendedTextMessageData.text
  }
  return null
}

/**
 * Достаёт текстовое сообщение из уведомления GREEN-API.
 * Для всего остального (статусы, медиа и т.п.) возвращает null.
 */
export function parseNotification(notification: Notification): Message | null {
  const { body } = notification
  if (!isMessageWebhook(body)) return null

  const text = extractText(body.messageData)
  if (text === null) return null

  return {
    id: body.idMessage,
    chatId: body.senderData.chatId,
    text,
    timestamp: body.timestamp * 1000,
    outgoing: body.typeWebhook !== 'incomingMessageReceived',
  }
}
