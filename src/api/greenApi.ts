import type { Credentials } from '../types'

export interface SendMessageResponse {
  idMessage: string
}

function buildUrl({ apiUrl, idInstance, apiTokenInstance }: Credentials, method: string) {
  return `${apiUrl}/waInstance${idInstance}/${method}/${apiTokenInstance}`
}

export async function sendMessage(
  credentials: Credentials,
  chatId: string,
  message: string,
): Promise<SendMessageResponse> {
  const res = await fetch(buildUrl(credentials, 'sendMessage'), {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ chatId, message }),
  })

  if (!res.ok) {
    throw new Error(`sendMessage failed: ${res.status}`)
  }

  return res.json()
}
