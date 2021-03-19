import * as Joi from 'joi'
import _ = require('lodash')
import { ApolloServer } from 'slowie'
import { BaseProcessor } from './base-processor'
import { EProcessorName } from './metadata'

type Input = { url: string, timeout: number }
type Output = { running: boolean }

var expression = new RegExp('(https?:\/\/(?:www\.|(?!www))[a-zA-Z0-9][a-zA-Z0-9-]+[a-zA-Z0-9]\.[^\s]{2,}|www\.[a-zA-Z0-9][a-zA-Z0-9-]+[a-zA-Z0-9]\.[^\s]{2,}|https?:\/\/(?:www\.|(?!www))[a-zA-Z0-9]+\.[^\s]{2,}|www\.[a-zA-Z0-9]+\.[^\s]{2,})')

const schema = Joi.object({
  url: Joi.string().max(100).min(10).pattern(expression).exist(),
  timeout: Joi.number().integer().optional().min(1000).max(10000)
})

export class HealCheck extends BaseProcessor<Input, Output> {
  name = EProcessorName.HEALTH_CHECK

  validateInput(input: Input) {
    const { error } = schema.validate(input)
    if (_.isNil(error)) return
    throw new ApolloServer.UserInputError(
      `INVALID_INPUT_FIELD`,
      { description: error.message }
    )
  }

  async doJob() {
    return { running: true }
  }
}
