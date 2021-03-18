export interface ITaskResult<Input, Output> {
  _id: string
  taskId: string
  input: Input
  output?: Output
  startedAt: Date
  finishedAt?: Date
  success: boolean
  error?: string
}
