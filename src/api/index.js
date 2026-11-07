// import { api } from '../api' → api.leads.list({ status: 'NEW' })
import * as authMod from './endpoints/auth'
import * as teamMod from './endpoints/team'
import * as salesMod from './endpoints/sales'
import * as catalogueMod from './endpoints/catalogue'
import * as afterSaleMod from './endpoints/after-sale'
import * as engageMod from './endpoints/engage'
import * as adminMod from './endpoints/admin'
import * as publicMod from './endpoints/public'
import * as devMod from './endpoints/dev'

export const api = {
  ...authMod, ...teamMod, ...salesMod, ...catalogueMod, ...afterSaleMod, ...engageMod, ...adminMod,
  public: publicMod.publicApi,
  exports: adminMod.exportsApi,
  dev: devMod.dev,
}
export { ApiError, onSessionEnded, setStepUpHandler, newIdempotencyKey, request, http } from './client'
export * from './hooks'