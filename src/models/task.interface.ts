export interface ITask<Input = any> {
  _id: string
  processor: string
  input: Input
  runnedTime: number
  scheduledAt: string
  paused: boolean
  expiredAt?: Date
  issuedAt: Date
}
