// Screens for this section. Each entry: { id, name, figma, path, Component }
import Category from './Category'
import Company from './Company'
import BrochurePremium from './BrochurePremium'
import ReadingBrochure from './ReadingBrochure'
import BrochureNormal from './BrochureNormal'
import Product from './Product'
import ProductFixLaunchDate from './ProductFixLaunchDate'
import Variants from './Variants'
import VariantsFixSumInsured from './VariantsFixSumInsured'
import Features from './Features'
import FeaturesFixOpd from './FeaturesFixOpd'
import FeaturesAdding from './FeaturesAdding'
import Review from './Review'
import Published from './Published'

export default [
  { id: 'AP1', name: 'AP1 · Add product — Category', figma: '73:9826', path: '/x/ap1-add-product-category', Component: Category },
  { id: 'AP2', name: 'AP2 · Add product — Company', figma: '73:10040', path: '/x/ap2-add-product-company', Component: Company },
  { id: 'AP2b', name: 'AP2b · Add product — Brochure (Premium)', figma: '128:14921', path: '/x/ap2b-add-product-brochure-premium', Component: BrochurePremium },
  { id: 'AP2c', name: 'AP2c · Add product — Reading brochure', figma: '128:15182', path: '/x/ap2c-add-product-reading-brochure', Component: ReadingBrochure },
  { id: 'AP2d', name: 'AP2d · Add product — Brochure (Normal plan)', figma: '128:15470', path: '/x/ap2d-add-product-brochure-normal-plan', Component: BrochureNormal },
  { id: 'AP3', name: 'AP3 · Add product — Product', figma: '73:10261', path: '/x/ap3-add-product-product', Component: Product },
  { id: 'AP3b', name: 'AP3b · Add product — Fix value (launch date)', figma: '137:17434', path: '/x/ap3b-add-product-fix-value-launch-date', Component: ProductFixLaunchDate },
  { id: 'AP4', name: 'AP4 · Add product — Variants', figma: '73:10485', path: '/x/ap4-add-product-variants', Component: Variants },
  { id: 'AP4b', name: 'AP4b · Add product — Fix value (Plus sum insured)', figma: '137:17794', path: '/x/ap4b-add-product-fix-value-plus-sum-insured', Component: VariantsFixSumInsured },
  { id: 'AP5', name: 'AP5 · Add product — Features', figma: '73:10736', path: '/x/ap5-add-product-features', Component: Features },
  { id: 'AP5b', name: 'AP5b · Add product — Fix value (OPD)', figma: '163:17868', path: '/x/ap5b-add-product-fix-value-opd', Component: FeaturesFixOpd },
  { id: 'AP5c', name: 'AP5c · Add product — Features (ticked, fixed, adding)', figma: '163:17045', path: '/x/ap5c-add-product-features-ticked-fixed-adding', Component: FeaturesAdding },
  { id: 'AP6', name: 'AP6 · Add product — Review and submit', figma: '74:10360', path: '/x/ap6-add-product-review-and-submit', Component: Review },
  { id: 'AP7', name: 'AP7 · Products — Published', figma: '74:11116', path: '/x/ap7-products-published', Component: Published },
]
