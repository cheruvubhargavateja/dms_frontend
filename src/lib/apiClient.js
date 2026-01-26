import axios from 'axios'

const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || 'https://dms-teja-app-cjejftdud8gfgxf9.southindia-01.azurewebsites.net/api',
  timeout: 100000,
})

apiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem('authToken')
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    // Surface a readable error for future error boundary or toast handling.
    const message = error.response?.data?.message || error.message
    return Promise.reject(new Error(message))
  },
)

function createAbortableRequest(config) {
  const controller = new AbortController()
  const promise = apiClient({
    ...config,
    signal: config.signal || controller.signal,
  })

  return {
    promise,
    abort: () => controller.abort(),
  }
}

export { apiClient, createAbortableRequest }
