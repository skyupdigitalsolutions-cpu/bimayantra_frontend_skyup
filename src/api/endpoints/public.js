// Public pages (no sign-in): shared quotation, comparison, referral form, website lead form.
import { http, p } from '../client'

export const publicApi = {
  quotation: (token) => http.get(p`/public/q/${token}`),
  comparison: (token) => http.get(p`/public/c/${token}`),
  referral: (code) => http.get(p`/public/r/${code}`),
  submitReferral: (code, body, opts) => http.post(p`/public/r/${code}`, body, opts),
  form: (key) => http.get(p`/public/forms/${key}`),
  submitForm: (key, body, opts) => http.post(p`/public/forms/${key}`, body, opts),
}

// Server-to-server only — NOT called from the browser (signed by Meta/Google/LinkedIn/payment gateway/WhatsApp):
//   GET|POST /hooks/meta, GET|POST /hooks/linkedin, POST /hooks/google, POST /hooks/website,
//   GET /hooks/oauth/:channel/callback (browser redirect from the platform, lands on the API),
//   POST /webhooks/messages, POST /webhooks/payments, POST /webhooks/subscription