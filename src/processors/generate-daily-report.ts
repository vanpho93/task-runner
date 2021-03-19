import { promisify } from 'util'
import { ITask } from '../models/task.interface'
import { BaseProcessor } from './base-processor'
import { EProcessorName } from './metadata'

type Input = void
type Output = void

export class GenerateDailyReport extends BaseProcessor<Input, Output> {
  name = EProcessorName.GENERATE_DAILY_REPORT

  async doJob(task: ITask<Input>) {
    console.log(`Gather transactions...`)
    console.log(`Gather orders...`)
    console.log(`Saving...`)
    await promisify(setTimeout)(1000)
    console.log(`Done.`)
  }
}
