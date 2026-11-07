// Screens for this section. Each entry: { id, name, figma, path, Component }
import AdminCatalogue from './AdminCatalogue'
import DashboardNewProduct from './DashboardNewProduct'
import ProductsNew from './ProductsNew'
import AddReading from './AddReading'
import AddReview from './AddReview'
import AddSend from './AddSend'

export default [
  { id: 'AD1', name: 'AD1 · SkyUp Admin — Catalogue (product published)', figma: '129:15020', path: '/x/ad1-skyup-admin-catalogue-product-published', Component: AdminCatalogue },
  { id: '01b', name: '01b · Dashboard — New product from SkyUp', figma: '129:15302', path: '/x/01b-dashboard-new-product-from-skyup', Component: DashboardNewProduct },
  { id: '10e', name: '10e · Products — New from SkyUp', figma: '129:15495', path: '/x/10e-products-new-from-skyup', Component: ProductsNew },
  { id: 'ADa', name: 'ADa · SkyUp Admin — Add product (reading brochure)', figma: '133:15701', path: '/x/ada-skyup-admin-add-product-reading-brochure', Component: AddReading },
  { id: 'ADb', name: 'ADb · SkyUp Admin — Review extracted values', figma: '133:15930', path: '/x/adb-skyup-admin-review-extracted-values', Component: AddReview },
  { id: 'ADc', name: 'ADc · SkyUp Admin — Review and send for approval', figma: '133:16297', path: '/x/adc-skyup-admin-review-and-send-for-approval', Component: AddSend },
]
