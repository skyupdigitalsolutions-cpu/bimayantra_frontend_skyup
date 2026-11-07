// Figma 287:35674 · IN2 · My insurers — Deactivate
import { InsurersPage, Dialog, Field, TextInput, Btn, ROUTES } from './_parts'

export default function IN2MyInsurersDeactivate() {
  return (
    <InsurersPage
      overlay={
        <Dialog
          top={160}
          icon="box"
          title="Deactivate ICICI Lombard?"
          body="New quotations for this insurer stop at once. Existing quotations and policies stay."
          actions={
            <>
              <Btn variant="outline" to={ROUTES.insurers} className="pl-5">Cancel</Btn>
              <Btn variant="danger" icon="x" to="/x/in3-my-insurers-inactive-insurer">Deactivate</Btn>
            </>
          }
        >
          <Field label="Reason (optional)"><TextInput defaultValue="Agency agreement ended" /></Field>
        </Dialog>
      }
    />
  )
}
