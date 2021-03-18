import * as _ from 'lodash'
import { Slowie } from 'slowie'

export interface IContext {
  role: string
}

export const app = new Slowie<IContext>({
  context: async (req) => ({ role: _.defaultTo(req.headers.role, 'GUEST') }),
})
