import { useMemo, useState } from 'react'
import { Button } from '../../../components/ui/Button'
import { Card } from '../../../components/ui/Card'
import { createInvoice } from '../api'

const blankAddress = {
  label: '',
  line1: '',
  line2: '',
  city: '',
  state: '',
  postalCode: '',
  country: '',
}

const blankItem = {
  description: '',
  quantity: 1,
  unitPrice: 0,
}

function InvoiceForm({ onCreated }) {
  const [invoiceNumber, setInvoiceNumber] = useState('')
  const [companyName, setCompanyName] = useState('')
  const [status, setStatus] = useState('pending')
  const [amount, setAmount] = useState('')
  const [emailTo, setEmailTo] = useState('')
  const [pickupAt, setPickupAt] = useState('')
  const [expectedEmailAt, setExpectedEmailAt] = useState('')
  const [departingAddresses, setDepartingAddresses] = useState([{ ...blankAddress, label: 'Origin' }])
  const [destinationAddresses, setDestinationAddresses] = useState([{ ...blankAddress, label: 'Destination' }])
  const [items, setItems] = useState([{ ...blankItem }])
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  const calculatedTotal = useMemo(() => {
    const total = items.reduce((sum, item) => {
      const qty = Number(item.quantity) || 0
      const price = Number(item.unitPrice) || 0
      return sum + qty * price
    }, 0)
    return total.toFixed(2)
  }, [items])

  const handleAddressChange = (type, index, field, value) => {
    const updater = type === 'departing' ? setDepartingAddresses : setDestinationAddresses
    updater((prev) => prev.map((addr, i) => (i === index ? { ...addr, [field]: value } : addr)))
  }

  const addAddress = (type) => {
    const updater = type === 'departing' ? setDepartingAddresses : setDestinationAddresses
    updater((prev) => [...prev, { ...blankAddress }])
  }

  const removeAddress = (type, index) => {
    const updater = type === 'departing' ? setDepartingAddresses : setDestinationAddresses
    updater((prev) => prev.filter((_, i) => i !== index))
  }

  const handleItemChange = (index, field, value) => {
    setItems((prev) => prev.map((item, i) => (i === index ? { ...item, [field]: value } : item)))
  }

  const addItem = () => setItems((prev) => [...prev, { ...blankItem }])
  const removeItem = (index) => setItems((prev) => prev.filter((_, i) => i !== index))

  const buildAddressPayload = (addresses) =>
    addresses
      .map((addr) => ({
        label: addr.label || undefined,
        line1: addr.line1 || undefined,
        line2: addr.line2 || undefined,
        city: addr.city || undefined,
        state: addr.state || undefined,
        postalCode: addr.postalCode || undefined,
        country: addr.country || undefined,
      }))
      .filter(
        (addr) =>
          addr.label ||
          addr.line1 ||
          addr.line2 ||
          addr.city ||
          addr.state ||
          addr.postalCode ||
          addr.country,
      )

  const buildItemsPayload = (lineItems) =>
    lineItems
      .map((item) => ({
        description: item.description || undefined,
        quantity: Number(item.quantity) || 0,
        unitPrice: Number(item.unitPrice) || 0,
      }))
      .filter((item) => item.description || item.quantity || item.unitPrice)

  const resetForm = () => {
    setInvoiceNumber('')
    setCompanyName('')
    setStatus('pending')
    setAmount('')
    setEmailTo('')
    setPickupAt('')
    setExpectedEmailAt('')
    setDepartingAddresses([{ ...blankAddress, label: 'Origin' }])
    setDestinationAddresses([{ ...blankAddress, label: 'Destination' }])
    setItems([{ ...blankItem }])
  }

  const handleSubmit = async (event) => {
    event.preventDefault()
    setSubmitting(true)
    setError('')
    setSuccess('')

    try {
      const payload = {
        invoiceNumber: invoiceNumber.trim(),
        amount: Number(amount || calculatedTotal),
        status,
        companyName: companyName.trim() || undefined,
        emailTo: emailTo.trim() || undefined,
        pickupAt: pickupAt || undefined,
        expectedEmailAt: expectedEmailAt || undefined,
        departingAddress: buildAddressPayload(departingAddresses),
        destinationAddress: buildAddressPayload(destinationAddresses),
        items: buildItemsPayload(items),
      }

      const created = await createInvoice(payload)
      setSuccess('Invoice submitted successfully.')
      if (onCreated) onCreated(created)
      resetForm()
    } catch (err) {
      setError(err?.message || 'Unable to create invoice.')
    } finally {
      setSubmitting(false)
    }
  }

  const renderAddressGroup = (type, addresses) => (
    <div className="space-y-3">
      {addresses.map((address, index) => (
        <div key={`${type}-${index}`} className="rounded-md border border-border bg-muted/30 p-3 space-y-3">
          <div className="grid gap-3 sm:grid-cols-2">
            <div className="space-y-1">
              <label className="block text-xs font-medium text-muted-foreground">Label</label>
              <input
                type="text"
                value={address.label}
                onChange={(e) => handleAddressChange(type, index, 'label', e.target.value)}
                className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm"
                placeholder="Origin, Warehouse A, etc."
              />
            </div>
            <div className="space-y-1">
              <label className="block text-xs font-medium text-muted-foreground">Line 1</label>
              <input
                type="text"
                value={address.line1}
                onChange={(e) => handleAddressChange(type, index, 'line1', e.target.value)}
                className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm"
                placeholder="123 Main St"
              />
            </div>
          </div>
          <div className="space-y-1">
            <label className="block text-xs font-medium text-muted-foreground">Line 2</label>
            <input
              type="text"
              value={address.line2}
              onChange={(e) => handleAddressChange(type, index, 'line2', e.target.value)}
              className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm"
              placeholder="Suite or floor (optional)"
            />
          </div>
          <div className="grid gap-3 sm:grid-cols-3">
            <div className="space-y-1">
              <label className="block text-xs font-medium text-muted-foreground">City</label>
              <input
                type="text"
                value={address.city}
                onChange={(e) => handleAddressChange(type, index, 'city', e.target.value)}
                className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm"
              />
            </div>
            <div className="space-y-1">
              <label className="block text-xs font-medium text-muted-foreground">State/Province</label>
              <input
                type="text"
                value={address.state}
                onChange={(e) => handleAddressChange(type, index, 'state', e.target.value)}
                className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm"
              />
            </div>
            <div className="space-y-1">
              <label className="block text-xs font-medium text-muted-foreground">Postal Code</label>
              <input
                type="text"
                value={address.postalCode}
                onChange={(e) => handleAddressChange(type, index, 'postalCode', e.target.value)}
                className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm"
              />
            </div>
          </div>
          <div className="grid gap-3 sm:grid-cols-[1fr_auto]">
            <div className="space-y-1">
              <label className="block text-xs font-medium text-muted-foreground">Country</label>
              <input
                type="text"
                value={address.country}
                onChange={(e) => handleAddressChange(type, index, 'country', e.target.value)}
                className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm"
              />
            </div>
            {addresses.length > 1 && (
              <div className="flex items-end">
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => removeAddress(type, index)}
                  className="w-full sm:w-auto"
                >
                  Remove
                </Button>
              </div>
            )}
          </div>
        </div>
      ))}
      <Button
        type="button"
        variant="outline"
        size="sm"
        onClick={() => addAddress(type)}
        className="w-full sm:w-auto"
      >
        + Add {type === 'departing' ? 'origin' : 'destination'}
      </Button>
    </div>
  )

  const renderItems = () => (
    <div className="space-y-3">
      {items.map((item, index) => (
        <div key={index} className="rounded-md border border-border bg-muted/30 p-3 space-y-3">
          <div className="space-y-1">
            <label className="block text-xs font-medium text-muted-foreground">Description</label>
            <input
              type="text"
              value={item.description}
              onChange={(e) => handleItemChange(index, 'description', e.target.value)}
              className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm"
              placeholder="Freight, boxes, pallets, etc."
            />
          </div>
          <div className="grid gap-3 sm:grid-cols-3">
            <div className="space-y-1">
              <label className="block text-xs font-medium text-muted-foreground">Quantity</label>
              <input
                type="number"
                min="0"
                step="1"
                value={item.quantity}
                onChange={(e) => handleItemChange(index, 'quantity', e.target.value)}
                className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm"
              />
            </div>
            <div className="space-y-1">
              <label className="block text-xs font-medium text-muted-foreground">Unit price</label>
              <input
                type="number"
                min="0"
                step="0.01"
                value={item.unitPrice}
                onChange={(e) => handleItemChange(index, 'unitPrice', e.target.value)}
                className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm"
              />
            </div>
            <div className="flex items-end">
              <div className="text-sm font-semibold">
                Line total: ${(Number(item.quantity) || 0) * (Number(item.unitPrice) || 0)}
              </div>
            </div>
          </div>
          {items.length > 1 && (
            <div className="flex justify-end">
              <Button type="button" variant="ghost" size="sm" onClick={() => removeItem(index)}>
                Remove item
              </Button>
            </div>
          )}
        </div>
      ))}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <Button type="button" variant="outline" size="sm" onClick={addItem} className="w-full sm:w-auto">
          + Add item
        </Button>
        <div className="text-sm text-muted-foreground">
          Calculated total from items: <span className="font-semibold text-foreground">${calculatedTotal}</span>
        </div>
      </div>
    </div>
  )

  return (
    <Card
      title="Create invoice"
      description="Send shipment details, addresses, and line items to the backend API."
      className="bg-card"
    >
      <form className="space-y-6" onSubmit={handleSubmit}>
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-1">
            <label className="block text-xs font-medium text-muted-foreground">
              Invoice number <span className="text-destructive">*</span>
            </label>
            <input
              type="text"
              value={invoiceNumber}
              onChange={(e) => setInvoiceNumber(e.target.value)}
              className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm"
              placeholder="INV-0001"
              required
            />
          </div>
          <div className="space-y-1">
            <label className="block text-xs font-medium text-muted-foreground">
              Amount <span className="text-destructive">*</span>
            </label>
            <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
              <input
                type="number"
                min="0"
                step="0.01"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm"
                placeholder={calculatedTotal}
                required
              />
              <Button type="button" variant="outline" size="sm" onClick={() => setAmount(calculatedTotal)}>
                Use ${calculatedTotal}
              </Button>
            </div>
          </div>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-1">
            <label className="block text-xs font-medium text-muted-foreground">Company</label>
            <input
              type="text"
              value={companyName}
              onChange={(e) => setCompanyName(e.target.value)}
              className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm"
              placeholder="Customer company (optional)"
            />
          </div>
          <div className="space-y-1">
            <label className="block text-xs font-medium text-muted-foreground">Status</label>
            <select
              value={status}
              onChange={(e) => setStatus(e.target.value)}
              className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm"
            >
              <option value="pending">Pending</option>
              <option value="paid">Paid</option>
              <option value="cancelled">Cancelled</option>
            </select>
          </div>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-1">
            <label className="block text-xs font-medium text-muted-foreground">Pickup at</label>
            <input
              type="datetime-local"
              value={pickupAt}
              onChange={(e) => setPickupAt(e.target.value)}
              className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm"
            />
          </div>
          <div className="space-y-1">
            <label className="block text-xs font-medium text-muted-foreground">Expected email at</label>
            <input
              type="datetime-local"
              value={expectedEmailAt}
              onChange={(e) => setExpectedEmailAt(e.target.value)}
              className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm"
            />
          </div>
        </div>

        <div className="space-y-1">
          <label className="block text-xs font-medium text-muted-foreground">Email to</label>
          <input
            type="email"
            value={emailTo}
            onChange={(e) => setEmailTo(e.target.value)}
            className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm"
            placeholder="notify@example.com"
          />
        </div>

        <div className="space-y-3">
          <div className="flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h3 className="text-base font-semibold text-foreground">Departing addresses</h3>
              <p className="text-xs text-muted-foreground">
                Add one or more pickup/origin addresses. Leave unused fields blank.
              </p>
            </div>
          </div>
          {renderAddressGroup('departing', departingAddresses)}
        </div>

        <div className="space-y-3">
          <div className="flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h3 className="text-base font-semibold text-foreground">Destination addresses</h3>
              <p className="text-xs text-muted-foreground">
                Add one or more delivery destinations. Leave unused fields blank.
              </p>
            </div>
          </div>
          {renderAddressGroup('destination', destinationAddresses)}
        </div>

        <div className="space-y-3">
          <div className="flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h3 className="text-base font-semibold text-foreground">Items</h3>
              <p className="text-xs text-muted-foreground">
                Add as many line items as needed. Totals can auto-fill the amount.
              </p>
            </div>
          </div>
          {renderItems()}
        </div>

        {error && <div className="rounded-md bg-destructive/10 px-3 py-2 text-sm text-destructive">{error}</div>}
        {success && (
          <div className="rounded-md bg-emerald-500/10 px-3 py-2 text-sm text-emerald-600">{success}</div>
        )}

        <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
          <div className="text-xs text-muted-foreground">
            Required fields: invoice number and amount. Other fields are optional but recommended.
          </div>
          <Button type="submit" disabled={submitting} className="w-full sm:w-auto">
            {submitting ? 'Submitting…' : 'Submit invoice'}
          </Button>
        </div>
      </form>
    </Card>
  )
}

export { InvoiceForm }
