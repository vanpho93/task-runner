import * as _ from 'lodash'
import * as Joi from 'joi'
import { BaseProcessor } from './base-processor'
import { EProcessorName } from './metadata'
import { ApolloServer } from 'slowie'

type Input = { reason: string }
type Output = void

const schema = Joi.object({
  reason: Joi.string().max(100).min(1).exist(),
})

export class AlwaysFail extends BaseProcessor<Input, Output> {
  name = EProcessorName.ALWAYS_FAIL

  validateInput(input: Input) {
    const { error } = schema.validate(input)
    if (_.isNil(error)) return
    throw new ApolloServer.UserInputError(
      `INVALID_INPUT_FIELD`,
      { description: error.message }
    )
  }

  async doJob() {
    throw new Error('JUST FOR FAIL')
  }
}
