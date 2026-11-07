// Figma 163:17045 · AP5c · Add product — Features (ticked, fixed, adding)
import { FeaturesStep } from './_steps'
import { tickedAfter } from '../../data/flow-add-product'

export default function FeaturesAdding() {
  return <FeaturesStep ticked={tickedAfter} corrected adding extraDividers />
}
