import { createSlice, type PayloadAction } from '@reduxjs/toolkit'
import type { Credentials } from '../../types'

interface AuthState {
  credentials: Credentials | null
}

const initialState: AuthState = {
  credentials: null,
}

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    login(state, action: PayloadAction<Credentials>) {
      state.credentials = action.payload
    },
    logout(state) {
      state.credentials = null
    },
  },
})

export const { login, logout } = authSlice.actions
export default authSlice.reducer
