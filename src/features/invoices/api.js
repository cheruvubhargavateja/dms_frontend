import { apiClient } from '../../lib/apiClient'

async function createInvoice(payload) {
  const response = await apiClient.post('/invoices', payload)
  return response.data?.data
}

async function fetchInvoices() {
  const response = await apiClient.get('/invoices')
  return response.data?.data ?? []
}

async function fetchInvoicesPaginated(page = 1, limit = 10, search = '', signal = null) {
  const params = new URLSearchParams({
    page: page.toString(),
    limit: limit.toString(),
    ...(search && { search })
  })
  const response = await apiClient.get(`/invoices?${params.toString()}`, { signal })
  return {
    invoices: response.data?.data ?? [],
    pagination: response.data?.pagination ?? { page: 1, limit: 10, total: 0, totalPages: 0 }
  }
}

async function fetchInvoiceById(invoiceId, signal = null) {
  const response = await apiClient.get(`/invoices/${invoiceId}`, { signal })
  return response.data?.data
}

export { createInvoice, fetchInvoices, fetchInvoicesPaginated, fetchInvoiceById }
