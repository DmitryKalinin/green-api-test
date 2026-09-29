import { createSlice, type PayloadAction } from '@reduxjs/toolkit'
import type { Chat, Message } from '../../types'

interface ChatsState {
  chats: Chat[]
  messages: Record<string, Message[]>
  activeChatId: string | null
}

const initialState: ChatsState = {
  chats: [],
  messages: {},
  activeChatId: null,
}

const chatsSlice = createSlice({
  name: 'chats',
  initialState,
  reducers: {
    chatCreated(state, action: PayloadAction<string>) {
      const phone = action.payload
      // GREEN-API ждёт chatId в формате 79991234567@c.us
      const chatId = `${phone}@c.us`
      const exists = state.chats.some((chat) => chat.id === chatId)
      if (!exists) {
        state.chats.unshift({ id: chatId, name: phone })
        state.messages[chatId] = []
      }
      state.activeChatId = chatId
    },
    chatSelected(state, action: PayloadAction<string>) {
      state.activeChatId = action.payload
    },
    messageAdded(state, action: PayloadAction<Message>) {
      const message = action.payload
      if (!state.messages[message.chatId]) {
        state.messages[message.chatId] = []
      }
      state.messages[message.chatId].push(message)
    },
  },
})

export const { chatCreated, chatSelected, messageAdded } = chatsSlice.actions
export default chatsSlice.reducer
