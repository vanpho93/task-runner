import * as _ from 'lodash'
import { ITask } from '../models/task.interface'
import * as td from 'testdouble'
import { BaseProcessor } from './base-processor'
import { EProcessorName } from './metadata'
import { app } from '../app'

class DummyProcessor extends BaseProcessor<{ input: string }, void> {
  name = 'Dummy' as EProcessorName

  async doJob(_task: ITask) { return }
}

describe('BaseProcessor', () => {
  describe('#run', () => {
    it('Success', async () => {
      const createTaskResult = td.function()
      const onSuccess = td.function()
      const doJob = td.function()
      const processor = new DummyProcessor()

      const TestResult = { create: createTaskResult }

      td.replace(app, 'getModel', () => TestResult)
      td.replace(processor, 'onSuccess', onSuccess)
      td.replace(processor, 'doJob', doJob)

      const task = {
        _id: 'some_id',
        input: 'some_input',
        other: 'other fields',
      } as any
      td.when(processor.doJob(task)).thenResolve(<any>'some_output')
      td.when(createTaskResult({ taskId: 'some_id', input: 'some_input' })).thenResolve('some_task_result')

      await processor.run(task)
      td.verify(onSuccess('some_task_result', 'some_output'))
    })
  })
})
