import { expect } from 'chai'
import { CronJob } from 'cron'
import * as _ from 'lodash'
import { ITask } from './models/task.interface'
import * as td from 'testdouble'
import { TaskManager } from './task-manager'
import { app } from './app'
import './models/task.model'

describe('TaskManager', () => {
  beforeEach('Clean TaskManager', () => {
    TaskManager.clean()
  })

  describe('#registerTask', () => {
    it('Success', () => {
      td.replace(_, 'find')
      td.replace(TaskManager, 'runTask')
      td.replace(CronJob.prototype, 'start')

      td
        .when(_.find(td.matchers.anything(), { name: 'SOME_PROCESSOR' }))
        .thenReturn('faked_processor')

      TaskManager.registerTask(<any>{
        _id: 'task_id',
        processor: 'SOME_PROCESSOR',
        scheduledAt: '* * * * * *'
      })

      expect(TaskManager['jobs']['task_id']).instanceOf(CronJob)
    })

    it('registered', () => {
      const taskId = 'some_id'
      TaskManager['jobs'][taskId] = <any>[{ stop() {} }]
      expect(() => TaskManager.registerTask(<any>{ _id: taskId }) )
        .to.throw('Task registerd already')
    })

    it('Processor not found', () => {
      expect(() => TaskManager.registerTask(<any>{ _id: 'some_id', processor: 'NOT_EXIST' }))
        .to.throw('Processor NOT_EXIST not found')
    })
  })

  it('#isValidTask', () => {
    const ONE_DAY = 86400000
    const yesterday = new Date(Date.now() - ONE_DAY)
    const tomorow = new Date(Date.now() + ONE_DAY)

    expect(TaskManager['isTaskValid'](<any>{ issuedAt: yesterday, paused: true })).to.equal(false)
    expect(TaskManager['isTaskValid'](<any>{ issuedAt: yesterday, paused: false })).to.equal(true)
    expect(TaskManager['isTaskValid'](<any>{ issuedAt: yesterday })).to.equal(true)
    expect(TaskManager['isTaskValid'](<any>{ issuedAt: tomorow })).to.equal(false)
    expect(TaskManager['isTaskValid'](<any>{ issuedAt: yesterday, expiredAt: yesterday })).to.equal(false)
    expect(TaskManager['isTaskValid'](<any>{ issuedAt: yesterday, expiredAt: tomorow })).to.equal(true)
  })

  it('#removeTask', () => {
    const taskId = 'some_id'
    const task = { _id: taskId } as any as ITask
    const job = { stop: td.function() } as any as CronJob
    TaskManager['jobs'][taskId] = job

    TaskManager.removeTask(task)
    expect(TaskManager['jobs'][taskId]).to.equal(undefined)
    td.verify(job.stop())

    TaskManager.removeTask(task)
  })

  it('#getActiveTasks', async () => {
    await app.getModel('Task').deleteMany({})

    const ONE_DAY = 86400000
    const yesterday = new Date(Date.now() - ONE_DAY)
    const tomorow = new Date(Date.now() + ONE_DAY)
    const scheduledAt = 'does not matter'

    await app.getModel('Task').insertMany([
      { _id: 'a', scheduledAt, issuedAt: yesterday, expiredAt: undefined, paused: true },
      { _id: 'b', scheduledAt, issuedAt: yesterday, expiredAt: undefined, paused: false },
      { _id: 'c', scheduledAt, issuedAt: tomorow, expiredAt: undefined, paused: false },
      { _id: 'd', scheduledAt, issuedAt: yesterday, expiredAt: yesterday, paused: false },
      { _id: 'e', scheduledAt, issuedAt: yesterday, expiredAt: tomorow, paused: false },
      { _id: 'f', scheduledAt, issuedAt: yesterday, expiredAt: tomorow, paused: true },
    ])

    expect(_.map(await TaskManager['getActiveTasks'](), '_id')).to.deep.equal(['b', 'e'])
  })

  it('#loadTasksOnInit', async () => {
    td.replace(TaskManager, 'getActiveTasks', () => [
      { toObject: () => 'a' },
      { toObject: () => 'b' },
    ])
    const registerTask = td.function()
    td.replace(TaskManager, 'registerTask', registerTask)
    await TaskManager.loadTasksOnInit()
    td.verify(registerTask('a'))
    td.verify(registerTask('b'))
  })
})
