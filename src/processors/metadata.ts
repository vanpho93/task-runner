import { ITask } from '../models/task.interface'

export interface IProcessor<Input> {
  run(task: ITask<Input>): Promise<void>
}

export enum EProcessorName {
  HEALTH_CHECK = 'HEALTH_CHECK',
  ALWAYS_FAIL = 'ALWAYS_FAIL',
  SAVE_LOG_TO_FILE = 'SAVE_LOG_TO_FILE',
  GENERATE_DAILY_REPORT = 'GENERATE_DAILY_REPORT',
}
