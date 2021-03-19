import * as _ from 'lodash'
import { BaseProcessor } from '../processors/base-processor'
import { processors } from '../processors'
import { TaskManager } from '../task-manager'
import { Task } from './task.model'

Task.hook.beforeCreate(async (_ctx, task) => {
  const processor = _.find(processors, { name: task.processor }) as BaseProcessor<any, any>
  await processor.validateInput(task.input)
})

Task.hook.afterCreate((_ctx, createdTask) => {
  TaskManager.registerTask(createdTask)
})

Task.hook.afterUpdate((_ctx, updatedTask) => {
  TaskManager.removeTask(updatedTask)
  TaskManager.registerTask(updatedTask)
})

Task.hook.afterRemove((_ctx, removedTask) => {
  TaskManager.removeTask(removedTask)
})
