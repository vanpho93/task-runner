import { ITask } from '../models/task.interface'
import { app } from '../app'
import { Document } from 'mongoose'
import { EProcessorName, IProcessor } from './metadata'

export abstract class BaseProcessor<Input, Output> implements IProcessor<Input> {
  abstract name: EProcessorName

  validateInput(_input: Input): Promise<void> | void {}

  abstract doJob(task: ITask<Input>): Promise<Output>

  private get TaskResult() { return app.getModel('TaskResult') }

  async run(task: ITask<Input>) {
    await this.validateInput(task.input)
    const taskResult = await this.TaskResult.create({
      taskId: task._id,
      input: task.input,
    })
    try {
      const output = await this.doJob(task)
      await this.onSuccess(taskResult, output)
    } catch (error) {
      await this.onFailed(taskResult, error)
    }
  }

  private async onSuccess(taskResult: Document, output: Output) {
    await this.TaskResult.findByIdAndUpdate(
      taskResult._id,
      {
        output,
        success: true,
        finishedAt: new Date(),
      }
    )
    await app.getModel('Task').findByIdAndUpdate(
      taskResult['taskId'],
      { $set: { runnedTime: { $inc: 1 } } }
    )
  }

  private onFailed(taskResult: Document, error: Error) {
    return this.TaskResult.findByIdAndUpdate(
      taskResult._id,
      {
        success: false,
        finishedAt: new Date(),
        error: error.stack,
      }
    )
  }
}
