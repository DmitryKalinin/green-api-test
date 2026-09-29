import { describe, expect, it } from 'vitest'
import type { Notification } from '../api/types'
import { parseNotification } from './parseNotification'

const base = {
  timestamp: 1700000000,
  idMessage: 'MSG1',
  senderData: { chatId: '79991234567@c.us', sender: '79991234567@c.us' },
}

describe('parseNotification', () => {
  it('разбирает входящее текстовое сообщение', () => {
    const notification: Notification = {
      receiptId: 1,
      body: {
        ...base,
        typeWebhook: 'incomingMessageReceived',
        messageData: { typeMessage: 'textMessage', textMessageData: { textMessage: 'Привет' } },
      },
    }

    expect(parseNotification(notification)).toEqual({
      id: 'MSG1',
      chatId: '79991234567@c.us',
      text: 'Привет',
      timestamp: 1700000000000,
      outgoing: false,
    })
  })

  it('разбирает extendedTextMessage', () => {
    const notification: Notification = {
      receiptId: 2,
      body: {
        ...base,
        typeWebhook: 'incomingMessageReceived',
        messageData: {
          typeMessage: 'extendedTextMessage',
          extendedTextMessageData: { text: 'https://max.ru' },
        },
      },
    }

    expect(parseNotification(notification)?.text).toBe('https://max.ru')
  })

  it('помечает сообщения, отправленные с телефона, как исходящие', () => {
    const notification: Notification = {
      receiptId: 3,
      body: {
        ...base,
        typeWebhook: 'outgoingMessageReceived',
        messageData: { typeMessage: 'textMessage', textMessageData: { textMessage: 'Ответ' } },
      },
    }

    expect(parseNotification(notification)?.outgoing).toBe(true)
  })

  it('игнорирует нетекстовые сообщения', () => {
    const notification: Notification = {
      receiptId: 4,
      body: {
        ...base,
        typeWebhook: 'incomingMessageReceived',
        messageData: { typeMessage: 'imageMessage' },
      },
    }

    expect(parseNotification(notification)).toBeNull()
  })

  it('игнорирует статусы и прочие уведомления', () => {
    expect(
      parseNotification({ receiptId: 5, body: { typeWebhook: 'outgoingMessageStatus' } }),
    ).toBeNull()
    expect(
      parseNotification({ receiptId: 6, body: { typeWebhook: 'stateInstanceChanged' } }),
    ).toBeNull()
  })
})
