// Figma 287:37948 · RF2 · Referrer — Disable
import { ReferrersPage, Dialog, Btn, ROUTES } from './_parts'

export default function RF2ReferrerDisable() {
  return (
    <ReferrersPage
      overlay={
        <Dialog
          icon="x"
          title="Disable Manjunath K?"
          body="He’s logged out everywhere and his link stops working. You can enable him again later."
          actions={
            <>
              <Btn variant="outline" to={ROUTES.referrers} className="pl-5">Cancel</Btn>
              <Btn variant="danger" icon="x" to="/x/rf3-referrer-disabled">Disable referrer</Btn>
            </>
          }
        />
      }
    />
  )
}
