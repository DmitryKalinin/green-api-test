export interface TextMessageData {
  typeMessage: 'textMessage'
  textMessageData: {
    textMessage: string
  }
}

export interface ExtendedTextMessageData {
  typeMessage: 'extendedTextMessage'
  extendedTextMessageData: {
    text: string
  }
}

// остальные типы (картинки, файлы и т.д.) не поддерживаем
export interface OtherMessageData {
  typeMessage: string
}

export type MessageData = TextMessageData | ExtendedTextMessageData | OtherMessageData

export interface MessageWebhookBody {
  typeWebhook: 'incomingMessageReceived' | 'outgoingMessageReceived' | 'outgoingAPIMessageReceived'
  timestamp: number
  idMessage: string
  senderData: {
    chatId: string
    sender: string
    senderName?: string
  }
  messageData: MessageData
}

export interface OtherWebhookBody {
  typeWebhook: string
}

export interface Notification {
  receiptId: number
  body: MessageWebhookBody | OtherWebhookBody
}
