// Figma 287:38431 · AS1 · Assistant — Disable
import { AssistantsPage, Dialog, Btn, ROUTES } from './_parts'

export default function AS1AssistantDisable() {
  return (
    <AssistantsPage
      overlay={
        <Dialog
          icon="users"
          title="Disable Priya K?"
          body="She’s logged out on every device straight away. Her past work stays in the activity log."
          actions={
            <>
              <Btn variant="outline" to={ROUTES.assistants} className="pl-5">Cancel</Btn>
              <Btn variant="danger" icon="x" to="/x/as2-assistant-disabled">Disable assistant</Btn>
            </>
          }
        />
      }
    />
  )
}
