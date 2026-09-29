import {
  createApi,
  fetchBaseQuery,
  type BaseQueryFn,
  type FetchArgs,
  type FetchBaseQueryError,
} from '@reduxjs/toolkit/query/react'
import type { RootState } from '../app/store'
import type { Credentials } from '../types'
import type { Notification } from './types'

export interface SendMessageResponse {
  idMessage: string
}

export interface SendMessageArgs {
  chatId: string
  message: string
}

interface MethodArgs extends Omit<FetchArgs, 'url'> {
  method?: string
  apiMethod: string
  path?: string
}

const rawBaseQuery = fetchBaseQuery()

// URL у GREEN-API собирается из данных инстанса:
// {apiUrl}/waInstance{idInstance}/{method}/{apiTokenInstance}
const greenApiBaseQuery: BaseQueryFn<MethodArgs, unknown, FetchBaseQueryError> = async (
  { apiMethod, path, ...args },
  api,
  extraOptions,
) => {
  const credentials = (api.getState() as RootState).auth.credentials
  if (!credentials) {
    return { error: { status: 'CUSTOM_ERROR', error: 'Not authorized' } }
  }

  const { apiUrl, idInstance, apiTokenInstance } = credentials
  let url = `${apiUrl}/waInstance${idInstance}/${apiMethod}/${apiTokenInstance}`
  if (path) {
    url += `/${path}`
  }

  return rawBaseQuery({ ...args, url }, api, extraOptions)
}

export const greenApi = createApi({
  reducerPath: 'greenApi',
  baseQuery: greenApiBaseQuery,
  endpoints: (build) => ({
    getStateInstance: build.mutation<{ stateInstance: string }, Credentials>({
      // вызывается до логина, поэтому данные инстанса передаём явно
      queryFn: async ({ apiUrl, idInstance, apiTokenInstance }, api, extraOptions) => {
        const result = await rawBaseQuery(
          `${apiUrl}/waInstance${idInstance}/getStateInstance/${apiTokenInstance}`,
          api,
          extraOptions,
        )
        if (result.error) return { error: result.error }
        return { data: result.data as { stateInstance: string } }
      },
    }),
    sendMessage: build.mutation<SendMessageResponse, SendMessageArgs>({
      query: (body) => ({ apiMethod: 'sendMessage', method: 'POST', body }),
    }),
    receiveNotification: build.query<Notification | null, void>({
      query: () => ({ apiMethod: 'receiveNotification', params: { receiveTimeout: 5 } }),
      keepUnusedDataFor: 0,
    }),
    deleteNotification: build.mutation<{ result: boolean }, number>({
      query: (receiptId) => ({
        apiMethod: 'deleteNotification',
        path: String(receiptId),
        method: 'DELETE',
      }),
    }),
  }),
})

export const { useSendMessageMutation, useGetStateInstanceMutation } = greenApi
