import * as _ from 'lodash'
import { ITask } from '../models/task.interface'
import { BaseProcessor } from './base-processor'
import { EProcessorName } from './metadata'

type Input = void
type Output = void

export class Dummy extends BaseProcessor<Input, Output> {
  name = EProcessorName.DUMMY

  async doJob(task: ITask<Input>) {
    console.log(`Dummy ${task._id} started...`)
    console.log(`Dummy ${task._id} finished...`)
  }
}
