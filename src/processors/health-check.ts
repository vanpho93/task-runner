import { BaseProcessor } from './base-processor'
import { EProcessorName } from './metadata'

type Input = { url: string, timeout: number }
type Output = { running: boolean }

export class HealCheck extends BaseProcessor<Input, Output> {
  name = EProcessorName.HEALTH_CHECK

  validateInput() {
    
  }

  async doJob() {
    return { running: true }
  }
}
