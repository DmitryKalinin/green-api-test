import { combineReducers, configureStore } from '@reduxjs/toolkit'
import { greenApi } from '../api/greenApi'
import authReducer, { logout } from '../features/auth/authSlice'
import chatsReducer from '../features/chats/chatsSlice'
import { clearState, loadState, saveState } from './persist'

const appReducer = combineReducers({
  auth: authReducer,
  chats: chatsReducer,
  [greenApi.reducerPath]: greenApi.reducer,
})

type AppState = ReturnType<typeof appReducer>

// при выходе сбрасываем всё состояние, чтобы чаты одного инстанса не показались другому
const rootReducer: typeof appReducer = (state, action) => {
  if (logout.match(action)) {
    clearState()
    return appReducer(undefined, action)
  }
  return appReducer(state, action)
}

const persisted = loadState<Pick<AppState, 'auth' | 'chats'>>()

export const store = configureStore({
  reducer: rootReducer,
  preloadedState: persisted,
  middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat(greenApi.middleware),
})

// сохраняем только когда поменялись auth или chats, а не на каждый экшен RTK Query
let saved = { auth: store.getState().auth, chats: store.getState().chats }
store.subscribe(() => {
  const { auth, chats } = store.getState()
  if (auth === saved.auth && chats === saved.chats) return
  saved = { auth, chats }
  if (auth.credentials) {
    saveState({ auth, chats })
  }
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch
