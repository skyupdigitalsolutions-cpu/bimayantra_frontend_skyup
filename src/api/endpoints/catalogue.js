// Catalogue (P-20–P-25, Stage F): SkyUp admin catalogue, advisor products, own products, brochure reading (OCR),
// price versions, corrections, feature table.
import { http, p } from '../client'

/** SkyUp Admin side */
export const adminCatalogue = {
  insurers: (query) => http.get('/admin/insurers', query),
  insurer: (id) => http.get(p`/admin/insurers/${id}`),
  createInsurer: (body, opts) => http.post('/admin/insurers', body, opts),
  updateInsurer: (id, body) => http.patch(p`/admin/insurers/${id}`, body),
  submitInsurer: (id, body) => http.post(p`/admin/insurers/${id}/submit`, body),
  approveInsurer: (id, body) => http.post(p`/admin/insurers/${id}/approve`, body),
  rejectInsurer: (id, body) => http.post(p`/admin/insurers/${id}/reject`, body),
  deactivateInsurer: (id, body) => http.post(p`/admin/insurers/${id}/deactivate`, body),
  activateInsurer: (id, body) => http.post(p`/admin/insurers/${id}/activate`, body),
  approvals: (query) => http.get('/admin/approvals', query),

  types: (query) => http.get('/admin/types', query),
  createType: (body, opts) => http.post('/admin/types', body, opts),
  addTemplate: (typeId, body, opts) => http.post(p`/admin/types/${typeId}/templates`, body, opts),
  deactivateType: (id, body) => http.post(p`/admin/types/${id}/deactivate`, body),
  activateType: (id, body) => http.post(p`/admin/types/${id}/activate`, body),

  template: (id) => http.get(p`/admin/templates/${id}`),
  saveTemplate: (id, body) => http.put(p`/admin/templates/${id}`, body),
  submitTemplate: (id, body) => http.post(p`/admin/templates/${id}/submit`, body),
  approveTemplate: (id, body) => http.post(p`/admin/templates/${id}/approve`, body),
  rejectTemplate: (id, body) => http.post(p`/admin/templates/${id}/reject`, body),

  products: (query) => http.get('/admin/products', query),
  product: (id) => http.get(p`/admin/products/${id}`),
  createProduct: (body, opts) => http.post('/admin/products', body, opts),
  newVersion: (id, body, opts) => http.post(p`/admin/products/${id}/versions`, body, opts),
  withdraw: (id, body) => http.post(p`/admin/products/${id}/withdraw`, body),
  makeAvailable: (id, body) => http.post(p`/admin/products/${id}/make-available`, body),
  // SkyUp reference price versions (P-24)
  prices: (id) => http.get(p`/admin/products/${id}/prices`),
  priceTemplate: (id) => http.get(p`/admin/products/${id}/prices/template`),
  referencePrices: (id) => http.get(p`/admin/products/${id}/prices/reference`),
  price: (id, priceId) => http.get(p`/admin/products/${id}/prices/${priceId}`),
  checkPrice: (id, body) => http.post(p`/admin/products/${id}/prices/check`, body),
  addPrice: (id, body, opts) => http.post(p`/admin/products/${id}/prices`, body, opts),
  cancelPrice: (id, priceId, opts) => http.post(p`/admin/products/${id}/prices/${priceId}/cancel`, {}, opts),

  saveVersion: (versionId, body) => http.put(p`/admin/product-versions/${versionId}`, body),
  versionVariants: (versionId) => http.get(p`/admin/product-versions/${versionId}/variants`),
  saveVersionVariants: (versionId, body) => http.put(p`/admin/product-versions/${versionId}/variants`, body),
  useCurrentTemplate: (versionId, body) => http.post(p`/admin/product-versions/${versionId}/use-current-template`, body),
  submitVersion: (versionId, body) => http.post(p`/admin/product-versions/${versionId}/submit`, body),
  approveVersion: (versionId, body) => http.post(p`/admin/product-versions/${versionId}/approve`, body),
  rejectVersion: (versionId, body) => http.post(p`/admin/product-versions/${versionId}/reject`, body),
  startVersionOcr: (versionId, body, opts) => http.post(p`/admin/product-versions/${versionId}/ocr`, body, opts),
  versionOcr: (versionId) => http.get(p`/admin/product-versions/${versionId}/ocr`),

  ocrDecisions: (jobId, body) => http.put(p`/admin/ocr-jobs/${jobId}/decisions`, body),
  ocrAcceptHigh: (jobId, body) => http.post(p`/admin/ocr-jobs/${jobId}/accept-high`, body),
  ocrApply: (jobId, body) => http.post(p`/admin/ocr-jobs/${jobId}/apply`, body),
  ocrRetry: (jobId, body) => http.post(p`/admin/ocr-jobs/${jobId}/retry`, body),

  corrections: (query) => http.get('/admin/corrections', query),
  acceptCorrection: (id, body) => http.post(p`/admin/corrections/${id}/accept`, body),
  rejectCorrection: (id, body) => http.post(p`/admin/corrections/${id}/reject`, body),
}

/** Advisor / assistant side */
export const products = {
  list: (query) => http.get('/products', query),
  get: (id) => http.get(p`/products/${id}`),
  correctionFields: (id) => http.get(p`/products/${id}/corrections/fields`),
  corrections: (id) => http.get(p`/products/${id}/corrections`),
  suggestCorrection: (id, body, opts) => http.post(p`/products/${id}/corrections`, body, opts),
  commercials: (id) => http.get(p`/products/${id}/commercials`),
  saveCommercials: (id, body) => http.put(p`/products/${id}/commercials`, body),
  featureTable: (query) => http.get('/catalogue/feature-table', query),
  // My price versions (P-24) — any product the advisor can quote
  prices: (id) => http.get(p`/products/${id}/prices`),
  priceTemplate: (id) => http.get(p`/products/${id}/prices/template`),
  referencePrices: (id) => http.get(p`/products/${id}/prices/reference`),
  price: (id, priceId) => http.get(p`/products/${id}/prices/${priceId}`),
  checkPrice: (id, body) => http.post(p`/products/${id}/prices/check`, body),
  addPrice: (id, body, opts) => http.post(p`/products/${id}/prices`, body, opts),
  cancelPrice: (id, priceId, opts) => http.post(p`/products/${id}/prices/${priceId}/cancel`, {}, opts),
}

/** "Add my product" flow (advisor-owned products) */
export const myProducts = {
  types: () => http.get('/my-products/types'),
  typeTemplate: (typeId) => http.get(p`/my-products/types/${typeId}/template`),
  createType: (body, opts) => http.post('/my-products/types', body, opts),
  insurers: () => http.get('/my-products/insurers'),
  createInsurer: (body, opts) => http.post('/my-products/insurers', body, opts),
  // brochure reading (OCR)
  startReading: (body, opts) => http.post('/my-products/brochure-reading', body, opts),
  reading: (id) => http.get(p`/my-products/brochure-reading/${id}`),
  readingDecisions: (id, body) => http.put(p`/my-products/brochure-reading/${id}/decisions`, body),
  readingAcceptHigh: (id, body) => http.post(p`/my-products/brochure-reading/${id}/accept-high`, body),
  readingResult: (id, body) => http.post(p`/my-products/brochure-reading/${id}/result`, body),
  readingRetry: (id, body) => http.post(p`/my-products/brochure-reading/${id}/retry`, body),
  // product
  create: (body, opts) => http.post('/my-products', body, opts),
  update: (id, body) => http.put(p`/my-products/${id}`, body),
  setStatus: (id, body) => http.post(p`/my-products/${id}/status`, body),
}