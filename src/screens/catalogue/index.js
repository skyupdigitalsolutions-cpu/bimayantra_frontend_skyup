// Screens for this section. Each entry: { id, name, figma, path, Component }
import Policies from './Policies'
import PolicyDetail from './PolicyDetail'
import Renewals from './Renewals'
import Communications from './Communications'
import Documents from './Documents'
import Products from './Products'
import ProductsCompare from './ProductsCompare'
import ProductDetail from './ProductDetail'

export default [
  { id: '11', name: '11 · Policies', figma: '11:1403', path: '/policies', Component: Policies },
  { id: '12', name: '12 · Policy detail', figma: '11:1662', path: '/policies/1', Component: PolicyDetail },
  { id: '13', name: '13 · Renewals', figma: '12:1261', path: '/renewals', Component: Renewals },
  { id: '14', name: '14 · Communications', figma: '12:1559', path: '/communications', Component: Communications },
  { id: '15', name: '15 · Documents', figma: '12:1775', path: '/documents', Component: Documents },
  { id: '10', name: '10 · Products library', figma: '38:3490', path: '/products', Component: Products },
  { id: '10b', name: '10b · Products — Compare variants', figma: '53:8333', path: '/x/10b-products-compare-variants', Component: ProductsCompare },
  { id: '10c', name: '10c · Product detail', figma: '89:10753', path: '/products/1', Component: ProductDetail },
]
