import * as _ from 'lodash'
import * as Joi from 'joi'
import { ApolloServer } from 'slowie'
import { promisify } from 'util'
import { ITask } from '../models/task.interface'
import { BaseProcessor } from './base-processor'
import { EProcessorName } from './metadata'

type Input = { source: string, destination: number }
type Output = void

const schema = Joi.object<Input>({
  source: Joi.string().max(100).min(1).exist(),
  destination: Joi.string().max(100).min(1).exist(),
})

export class SaveLogToFile extends BaseProcessor<Input, Output> {
  name = EProcessorName.SAVE_LOG_TO_FILE

  validateInput(input: Input) {
    const { error } = schema.validate(input)
    if (_.isNil(error)) return
    throw new ApolloServer.UserInputError(
      `INVALID_INPUT_FIELD`,
      { description: error.message }
    )
  }
  async doJob(task: ITask<Input>) {
    console.log(`Gather the logs from ${task.input.source}`)
    console.log(`Saving...`)
    await promisify(setTimeout)(1000)
    console.log(`Saved to ${task.input.destination}`)
    console.log(`Done`)
  }
}
