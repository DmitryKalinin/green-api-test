import { describe, expect, it } from 'vitest'
import type { Message } from '../../types'
import reducer, { chatClosed, chatCreated, chatSelected, messageAdded } from './chatsSlice'

const initial = reducer(undefined, { type: 'init' })

const message = (overrides: Partial<Message> = {}): Message => ({
  id: 'MSG1',
  chatId: '79991234567@c.us',
  text: 'Привет',
  timestamp: 1,
  outgoing: false,
  ...overrides,
})

describe('chatsSlice', () => {
  it('создаёт чат с chatId в формате GREEN-API и делает его активным', () => {
    const state = reducer(initial, chatCreated('79991234567'))

    expect(state.chats).toEqual([{ id: '79991234567@c.us', name: '79991234567' }])
    expect(state.activeChatId).toBe('79991234567@c.us')
  })

  it('не дублирует уже существующий чат', () => {
    let state = reducer(initial, chatCreated('79991234567'))
    state = reducer(state, chatCreated('79991234567'))

    expect(state.chats).toHaveLength(1)
  })

  it('выбирает и закрывает чат', () => {
    let state = reducer(initial, chatCreated('79991234567'))
    state = reducer(state, chatCreated('79990000000'))
    state = reducer(state, chatSelected('79991234567@c.us'))
    expect(state.activeChatId).toBe('79991234567@c.us')

    state = reducer(state, chatClosed())
    expect(state.activeChatId).toBeNull()
  })

  it('добавляет сообщение и игнорирует повтор с тем же id', () => {
    let state = reducer(initial, chatCreated('79991234567'))
    state = reducer(state, messageAdded(message()))
    state = reducer(state, messageAdded(message()))

    expect(state.messages['79991234567@c.us']).toHaveLength(1)
  })

  it('создаёт чат, если написали с неизвестного номера', () => {
    const state = reducer(initial, messageAdded(message({ chatId: '79995554433@c.us' })))

    expect(state.chats).toEqual([{ id: '79995554433@c.us', name: '79995554433' }])
    expect(state.messages['79995554433@c.us']).toHaveLength(1)
    // активный чат при этом не переключаем
    expect(state.activeChatId).toBeNull()
  })
})
