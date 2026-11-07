// Team: assistants (P-53) and SkyUp staff (P-48).
import { http, p } from '../client'

export const assistants = {
  list: (query) => http.get('/assistants', query),
  create: (body, opts) => http.post('/assistants', body, opts),
  disable: (id, body) => http.post(p`/assistants/${id}/disable`, body),
  enable: (id, body) => http.post(p`/assistants/${id}/enable`, body),
}

export const staff = {
  list: (query) => http.get('/staff', query),
  create: (body, opts) => http.post('/staff', body, opts),
  setRole: (id, body) => http.post(p`/staff/${id}/role`, body),
  disable: (id, body) => http.post(p`/staff/${id}/disable`, body),
  enable: (id, body) => http.post(p`/staff/${id}/enable`, body),
}