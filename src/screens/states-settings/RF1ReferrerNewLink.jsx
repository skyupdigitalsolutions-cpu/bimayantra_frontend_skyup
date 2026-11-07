// Figma 287:37735 · RF1 · Referrer — New link
import { ReferrersPage, Dialog, Btn, ROUTES } from './_parts'

export default function RF1ReferrerNewLink() {
  return (
    <ReferrersPage
      overlay={
        <Dialog
          tone="blue"
          icon="link"
          title="Give Manjunath K a new link?"
          body="The old link K7MX4QPA stops working at once. Referrals already received are kept."
          actions={
            <>
              <Btn variant="outline" to={ROUTES.referrers} className="pl-5">Cancel</Btn>
              <Btn icon="link" to={ROUTES.referrers}>Create new link</Btn>
            </>
          }
        />
      }
    />
  )
}
