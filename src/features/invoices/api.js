import { apiClient } from '../../lib/apiClient'

async function createInvoice(payload) {
  const response = await apiClient.post('/invoices', payload)
  return response.data?.data
}

async function fetchInvoices() {
  const response = await apiClient.get('/invoices')
  return response.data?.data ?? []
}

export { createInvoice, fetchInvoices }
