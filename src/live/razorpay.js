// Razorpay Checkout in the browser. The API creates the order (gateway: 'razorpay', keyId, razorpayOrderId, amountPaise);
// this opens the Razorpay window and resolves with the three values the API verifies, or null if the person closes it.
const SRC = 'https://checkout.razorpay.com/v1/checkout.js'
let loading = null

function loadScript() {
  if (window.Razorpay) return Promise.resolve()
  loading ??= new Promise((resolve, reject) => {
    const s = document.createElement('script')
    s.src = SRC
    s.async = true
    s.onload = () => resolve()
    s.onerror = () => { loading = null; reject(new Error('Could not load Razorpay. Check your internet connection and try again.')) }
    document.head.appendChild(s)
  })
  return loading
}

/** order: the API's response data; prefill: { name, email, contact }. */
export async function openCheckout(order, prefill = {}) {
  await loadScript()
  return new Promise((resolve, reject) => {
    const rzp = new window.Razorpay({
      key: order.keyId,
      order_id: order.razorpayOrderId,
      amount: order.amountPaise,
      currency: order.currency ?? 'INR',
      name: order.name ?? 'Bimayantra',
      description: order.description ?? '',
      prefill,
      theme: { color: '#13294b' },
      handler: (r) => resolve({ razorpayOrderId: r.razorpay_order_id, razorpayPaymentId: r.razorpay_payment_id, razorpaySignature: r.razorpay_signature }),
      modal: { ondismiss: () => resolve(null), confirm_close: true },
    })
    rzp.on('payment.failed', (e) => reject(new Error(e?.error?.description || 'The payment failed. No money was taken.')))
    rzp.open()
  })
}