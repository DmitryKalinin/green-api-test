export interface TextMessageData {
  typeMessage: 'textMessage'
  textMessageData: {
    textMessage: string
  }
}

export interface IncomingMessageBody {
  typeWebhook: 'incomingMessageReceived'
  timestamp: number
  idMessage: string
  senderData: {
    chatId: string
    sender: string
    senderName?: string
  }
  messageData: TextMessageData
}

export interface Notification {
  receiptId: number
  body: IncomingMessageBody
}
