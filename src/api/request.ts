import { env } from '@/config/env'

export const apiFetch = async (input: RequestInfo | URL, init?: RequestInit): Promise<Response> => {
  const controller = new AbortController()
  const externalSignal = init?.signal
  const abortFromExternalSignal = () => controller.abort(externalSignal?.reason)

  if (externalSignal?.aborted) {
    abortFromExternalSignal()
  } else {
    externalSignal?.addEventListener('abort', abortFromExternalSignal, { once: true })
  }

  const timeoutID = window.setTimeout(() => {
    controller.abort(new DOMException('API request timed out', 'TimeoutError'))
  }, env.TIMEOUT_API)

  try {
    return await fetch(input, { ...init, signal: controller.signal })
  } finally {
    window.clearTimeout(timeoutID)
    externalSignal?.removeEventListener('abort', abortFromExternalSignal)
  }
}
