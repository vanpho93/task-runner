import { AlwaysFail } from './always-fail'
import { GenerateDailyReport } from './generate-daily-report'
import { HealCheck } from './health-check'
import { SaveLogToFile } from './save-logs-to-file'

export const processors = [
  new AlwaysFail(),
  new GenerateDailyReport(),
  new HealCheck(),
  new SaveLogToFile(),
]
