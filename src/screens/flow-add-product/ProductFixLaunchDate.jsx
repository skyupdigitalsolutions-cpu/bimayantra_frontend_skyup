// Figma 137:17434 · AP3b · Add product — Fix value (launch date)
import Icon from '../../components/Icon'
import { ProductStep } from './_steps'
import { FixDrawer, Field, TextInput, R } from './_parts'
import { fixes } from '../../data/flow-add-product'

export default function ProductFixLaunchDate() {
  return (
    <ProductStep
      back={R.company}
      overlay={
        <FixDrawer kind="product" cancelTo={R.product} saveTo={R.product}>
          <Field label="Correct value *">
            <TextInput focused defaultValue={fixes.product.value} trailing={<Icon name="calendar" size={18} className="text-muted" />} />
          </Field>
        </FixDrawer>
      }
    />
  )
}
