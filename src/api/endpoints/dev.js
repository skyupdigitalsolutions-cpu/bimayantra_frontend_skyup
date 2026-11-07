// Test tools (DEV_TOOLS=true, never production): SMS inbox for OTPs, test clock, config overrides, job runners.
import { http, p } from '../client'

export const dev = {
  sms: (mobile) => http.get('/dev/sms', { mobile }),
  clearSms: () => http.del('/dev/sms'),
  smsFailing: (body) => http.post('/dev/sms/failing', body),
  clock: () => http.get('/dev/clock'),
  setClock: (body) => http.post('/dev/clock', body),
  insurers: () => http.get('/dev/insurers'),
  addInsurer: (body) => http.post('/dev/insurers', body),
  insurerStatus: (id, body) => http.post(p`/dev/insurers/${id}/status`, body),
  commsInbox: () => http.get('/dev/comms/inbox'),
  commsFailMode: (body) => http.post('/dev/comms/fail-mode', body),
  commsSendNow: () => http.post('/dev/comms/send-now', {}),
  runGreetings: () => http.post('/dev/comms/run-greetings', {}),
  commsWebhook: (body) => http.post('/dev/comms/webhook', body),
  commsPay: (body) => http.post('/dev/comms/pay', body),
  billingPay: (body) => http.post('/dev/billing/pay', body),
  runSubscriptionJob: () => http.post('/dev/run-subscription-job', {}),
  runRenewalJob: () => http.post('/dev/run-renewal-job', {}),
  extendTrial: (body) => http.post('/dev/extend-trial', body),
  runSweep: () => http.post('/dev/run-sweep', {}),
  config: () => http.get('/dev/config'),
  setConfig: (id, body) => http.put(p`/dev/config/${id}`, body),
  clearConfig: (id) => http.del(p`/dev/config/${id}`),
  resetLimits: () => http.post('/dev/reset-limits', {}),
}