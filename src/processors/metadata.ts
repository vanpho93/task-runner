import { ITask } from '../tasks/task.interface'

export interface IProcessor<Input> {
  run(task: ITask<Input>): Promise<void>
}

export enum EProcessorName {
  HEALTH_CHECK = 'HEALTH_CHECK',
  COPY_DATA_TO_BIG_QUERY = 'COPY_DATA_TO_BIG_QUERY',
  SAVE_LOG_TO_FILES = 'SAVE_LOG_TO_FILES',
  GENERATE_REPORT = 'GENERATE_REPORT',
}
