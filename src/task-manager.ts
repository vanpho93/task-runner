import * as _ from 'lodash'
import { CronJob } from 'cron'
import { promisify } from 'util'
import { ITask } from './models/task.interface'
import { processors } from './processors'
import { IProcessor } from './processors/metadata'
import { app } from './app'

export class TaskManager {
  private static jobs: _.Dictionary<CronJob> = {}
  private static runningTaskIds: string[] = []

  static registerTask(task: ITask) {
    console.log(`[REGISTER_TASK]: ${task._id}`)
    if (_.identity(this.jobs[task._id])) throw new Error('Task registerd already')
    const processor = _.find(processors, { name: task.processor })
    if (_.isNil(processor)) throw new Error(`Processor ${task.processor} not found`)
    const job = new CronJob(
      task.scheduledAt,
      async () => {
        this.runningTaskIds.push(task._id)
        await this.runTask(task).catch(console.log)
        _.remove(this.runningTaskIds, task._id)
      }
    )
    this.jobs[task._id] = job
    job.start()
  }

  private static isTaskValid(task: ITask) {
    if (task.paused) return false
    return _.inRange(
      Date.now(),
      task.issuedAt.getTime(),
      _.defaultTo(task.expiredAt, new Date('9999-01-01')).getTime(),
    )
  }

  private static async runTask(task: ITask) {
    console.log(`[RUN_TASK][${task._id}] validate`)
    const processor = _.find(processors, { name: task.processor }) as IProcessor<any>
    if (_.isNil(processor)) throw new Error(`Processor ${task.processor} not found`)
    const freshedTask = await app.getModel<ITask>('Task').findById(task._id)
    if (_.isNil(freshedTask)) return this.removeTask(task)

    if (!this.isTaskValid(task)) return this.removeTask(task)
    console.log(`[RUN_TASK][${task._id}]: start `)
    await processor.run(task)
    console.log(`[RUN_TASK][${task._id}]: finished`)
  }

  static removeTask(task: ITask) {
    console.log(`[REMOVE_TASK]: ${task._id}`)
    const job = this.jobs[task._id]
    if (_.isNil(job)) return
    job.stop()
    delete this.jobs[task._id]
  }

  private static getActiveTasks() {
    const now = new Date()
    const notExists = { $exists: false }
    return app.getModel('Task').find({
      paused: false,
      $or: [
        { issuedAt: notExists, expiredAt: notExists },
        { issuedAt: { $lt: now }, expiredAt: { $gt: now } },
        { issuedAt: { $lt: now }, expiredAt: notExists },
        { issuedAt: notExists, expiredAt: { $gt: now } },
      ]
    })
  }

  static async loadTasksOnInit() {
    const activeTasks = await this.getActiveTasks()
    activeTasks.forEach(task => this.registerTask(task.toObject()))
  }

  static stop(forceStopAfter = 1000) {
    _.forEach(this.jobs, job => job.stop())
    return new Promise<void>(async (resolve, _reject) => {
      setTimeout(resolve, forceStopAfter)
      while(true) {
        if (_.isEmpty(this.runningTaskIds)) return resolve()
        await promisify(setTimeout)(200)
      }
    })
  }

  static clean() {
    _.forEach(this.jobs, (job) => {
      if (_.isFunction(job.stop)) job.stop()
    })
    this.jobs = {}
    this.runningTaskIds = []
  }
}
