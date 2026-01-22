import { useEffect, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { fetchInvoicesPaginated } from '../features/invoices/api'
import { Button } from '../components/ui/Button'

// Custom hook for debounced search
function useDebounce(value, delay) {
  const [debouncedValue, setDebouncedValue] = useState(value)

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value)
    }, delay)

    return () => {
      clearTimeout(handler)
    }
  }, [value, delay])

  return debouncedValue
}

// Status badge component
function StatusBadge({ status, type = 'pdf' }) {
  const statusColors = {
    pdf: {
      not_started: 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-200',
      queued: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200',
      generated: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200',
      error: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
    },
    email: {
      not_scheduled: 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-200',
      scheduled: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200',
      sent: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200',
      error: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
    }
  }

  const colors = statusColors[type] || statusColors.pdf
  const colorClass = colors[status] || colors.not_started

  return (
    <span
      className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${colorClass}`}
    >
      {status?.replace('_', ' ') || 'N/A'}
    </span>
  )
}

function InvoicesTablePage() {
  const navigate = useNavigate()
  const [invoices, setInvoices] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [searchTerm, setSearchTerm] = useState('')
  const [page, setPage] = useState(1)
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10,
    total: 0,
    totalPages: 0
  })

  const abortControllerRef = useRef(null)
  const debouncedSearch = useDebounce(searchTerm, 500)

  const limit = 10

  useEffect(() => {
    // Abort any pending requests when component unmounts
    return () => {
      if (abortControllerRef.current) {
        abortControllerRef.current.abort()
      }
    }
  }, [])

  useEffect(() => {
    // Reset to page 1 when search changes
    setPage(1)
  }, [debouncedSearch])

  useEffect(() => {
    let isMounted = true

    // Abort previous request if it exists
    if (abortControllerRef.current) {
      abortControllerRef.current.abort()
    }

    // Create new abort controller
    const controller = new AbortController()
    abortControllerRef.current = controller

    setLoading(true)
    setError('')

    fetchInvoicesPaginated(page, limit, debouncedSearch, controller.signal)
      .then((result) => {
        if (!isMounted || controller.signal.aborted) return

        setInvoices(result.invoices)
        setPagination(result.pagination)
      })
      .catch((err) => {
        if (!isMounted || controller.signal.aborted) return
        if (err.name === 'CanceledError' || err.name === 'AbortError') return

        setError(err?.message || 'Unable to load invoices.')
      })
      .finally(() => {
        if (!isMounted || controller.signal.aborted) return
        setLoading(false)
      })

    return () => {
      isMounted = false
      if (abortControllerRef.current === controller) {
        abortControllerRef.current = null
      }
    }
  }, [page, debouncedSearch])

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A'
    try {
      return new Date(dateString).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      })
    } catch {
      return 'Invalid Date'
    }
  }

  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= pagination.totalPages) {
      setPage(newPage)
      window.scrollTo({ top: 0, behavior: 'smooth' })
    }
  }

  return (
    <div className="space-y-4 sm:space-y-6 lg:space-y-8 -mx-4 sm:-mx-6 lg:-mx-8 px-4 sm:px-6 lg:px-8">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <h1 className="text-xl sm:text-2xl lg:text-3xl font-semibold">All Invoices</h1>
        <Button size="sm" onClick={() => navigate('/invoices')} className="w-full sm:w-auto">
          Create Invoice
        </Button>
      </div>

      {/* Search Bar */}
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
        <div className="flex-1">
          <input
            type="text"
            placeholder="Search by invoice number, company name, or email..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full rounded-md border border-border bg-card px-3 py-2 sm:px-4 sm:py-2.5 text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 dark:bg-background"
          />
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto rounded-lg border border-border bg-card lg:shadow-md">
        {loading ? (
          <div className="p-8 text-center text-sm text-muted-foreground">Loading invoices…</div>
        ) : error ? (
          <div className="p-8 text-center text-sm text-destructive">{error}</div>
        ) : invoices.length === 0 ? (
          <div className="p-8 text-center text-sm text-muted-foreground">
            {debouncedSearch ? 'No invoices found matching your search.' : 'No invoices yet.'}
          </div>
        ) : (
          <table className="w-full border-collapse min-w-[1200px] lg:min-w-[1400px]">
            <thead className="bg-muted/50">
              <tr>
                <th className="border-b border-border px-4 py-3 lg:px-6 lg:py-4 text-left text-xs sm:text-sm font-semibold uppercase tracking-wider text-muted-foreground min-w-[120px]">
                  Invoice ID
                </th>
                <th className="border-b border-border px-4 py-3 lg:px-6 lg:py-4 text-left text-xs sm:text-sm font-semibold uppercase tracking-wider text-muted-foreground min-w-[140px]">
                  Invoice Number
                </th>
                <th className="border-b border-border px-4 py-3 lg:px-6 lg:py-4 text-left text-xs sm:text-sm font-semibold uppercase tracking-wider text-muted-foreground min-w-[180px] whitespace-nowrap">
                  Pickup Date
                </th>
                <th className="border-b border-border px-4 py-3 lg:px-6 lg:py-4 text-left text-xs sm:text-sm font-semibold uppercase tracking-wider text-muted-foreground min-w-[180px] whitespace-nowrap">
                  Email Expected Date
                </th>
                <th className="border-b border-border px-4 py-3 lg:px-6 lg:py-4 text-left text-xs sm:text-sm font-semibold uppercase tracking-wider text-muted-foreground min-w-[180px] whitespace-nowrap">
                  Email Sent Date
                </th>
                <th className="border-b border-border px-4 py-3 lg:px-6 lg:py-4 text-left text-xs sm:text-sm font-semibold uppercase tracking-wider text-muted-foreground min-w-[120px]">
                  PDF Status
                </th>
                <th className="border-b border-border px-4 py-3 lg:px-6 lg:py-4 text-left text-xs sm:text-sm font-semibold uppercase tracking-wider text-muted-foreground min-w-[120px]">
                  Email Status
                </th>
                <th className="border-b border-border px-4 py-3 lg:px-6 lg:py-4 text-left text-xs sm:text-sm font-semibold uppercase tracking-wider text-muted-foreground min-w-[180px] whitespace-nowrap">
                  PDF Generated At
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {invoices.map((invoice) => (
                <tr
                  key={invoice.id}
                  className="hover:bg-muted/30 transition-colors cursor-pointer"
                  onClick={() => navigate(`/invoices/${invoice.id}`)}
                >
                  <td className="px-4 py-3 lg:px-6 lg:py-4 text-sm whitespace-nowrap">
                    <span className="font-mono text-xs sm:text-sm text-primary">
                      {invoice.id?.substring(0, 8)}...
                    </span>
                  </td>
                  <td className="px-4 py-3 lg:px-6 lg:py-4 text-sm sm:text-base font-medium whitespace-nowrap">{invoice.invoiceNumber}</td>
                  <td className="px-4 py-3 lg:px-6 lg:py-4 text-sm sm:text-base text-muted-foreground whitespace-nowrap">
                    {formatDate(invoice.pickupAt)}
                  </td>
                  <td className="px-4 py-3 lg:px-6 lg:py-4 text-sm sm:text-base text-muted-foreground whitespace-nowrap">
                    {formatDate(invoice.expectedEmailAt)}
                  </td>
                  <td className="px-4 py-3 lg:px-6 lg:py-4 text-sm sm:text-base text-muted-foreground whitespace-nowrap">
                    {formatDate(invoice.emailSentAt)}
                  </td>
                  <td className="px-4 py-3 lg:px-6 lg:py-4 text-sm sm:text-base whitespace-nowrap">
                    <StatusBadge status={invoice.generationStatus} type="pdf" />
                  </td>
                  <td className="px-4 py-3 lg:px-6 lg:py-4 text-sm sm:text-base whitespace-nowrap">
                    <StatusBadge status={invoice.emailStatus} type="email" />
                  </td>
                  <td className="px-4 py-3 lg:px-6 lg:py-4 text-sm sm:text-base text-muted-foreground whitespace-nowrap">
                    {formatDate(invoice.pdfGeneratedAt)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* Pagination */}
      {!loading && !error && pagination.totalPages > 0 && (
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="text-sm text-muted-foreground">
            Showing {invoices.length > 0 ? (page - 1) * limit + 1 : 0} to{' '}
            {Math.min(page * limit, pagination.total)} of {pagination.total} invoices
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => handlePageChange(page - 1)}
              disabled={page === 1 || loading}
            >
              Previous
            </Button>
            <div className="flex items-center gap-1">
              {Array.from({ length: Math.min(5, pagination.totalPages) }, (_, i) => {
                let pageNum
                if (pagination.totalPages <= 5) {
                  pageNum = i + 1
                } else if (page <= 3) {
                  pageNum = i + 1
                } else if (page >= pagination.totalPages - 2) {
                  pageNum = pagination.totalPages - 4 + i
                } else {
                  pageNum = page - 2 + i
                }

                return (
                  <Button
                    key={pageNum}
                    variant={pageNum === page ? 'primary' : 'ghost'}
                    size="sm"
                    onClick={() => handlePageChange(pageNum)}
                    disabled={loading}
                    className="min-w-[2.5rem]"
                  >
                    {pageNum}
                  </Button>
                )
              })}
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={() => handlePageChange(page + 1)}
              disabled={page === pagination.totalPages || loading}
            >
              Next
            </Button>
          </div>
        </div>
      )}
    </div>
  )
}

export default InvoicesTablePage
