// Figma 287:35423 · IN1 · My insurers — Add insurer
import { InsurersPage, Drawer, Field, TextInput, Note, Btn, ROUTES } from './_parts'

export default function IN1MyInsurersAddInsurer() {
  return (
    <InsurersPage
      overlay={
        <Drawer
          title="Add insurer"
          sub="Add an insurer you hold an agent code with"
          closeTo={ROUTES.insurers}
          footer={
            <>
              <Btn variant="outline" center to={ROUTES.insurers} className="w-[220px] pl-5">Cancel</Btn>
              <Btn icon="check" center to={ROUTES.insurers} className="w-[214px]">Save insurer</Btn>
            </>
          }
        >
          <Field label="Insurer *"><TextInput leading="search" trailing="chev-down" defaultValue="Aditya Birla Health Insurance" /></Field>
          <Field label="Agent code *" hint="Must be unique for this insurer in your account"><TextInput focus defaultValue="ABH-90412" autoFocus /></Field>
          <Field label="Code valid until *"><TextInput trailing="calendar" defaultValue="31-03-2027" /></Field>
          <Note icon="check">New quotations with this insurer are allowed from today.</Note>
        </Drawer>
      }
    />
  )
}
