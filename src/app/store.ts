import { configureStore } from '@reduxjs/toolkit'
import { greenApi } from '../api/greenApi'
import authReducer from '../features/auth/authSlice'
import chatsReducer from '../features/chats/chatsSlice'

export const store = configureStore({
  reducer: {
    auth: authReducer,
    chats: chatsReducer,
    [greenApi.reducerPath]: greenApi.reducer,
  },
  middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat(greenApi.middleware),
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch
