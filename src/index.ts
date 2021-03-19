import { app } from './app'

import './models/task.model'
import './models/task-result.model'
import './models/task.hook'
import { TaskManager } from './task-manager'

app.mongoose.connect(
  'mongodb://localhost:27017/slowie1000',
  {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false,
    useCreateIndex: true,
  }
)

const server = app.getServer()

async function start() {
  const { url } = await server.listen(3000)
  console.log(`🚀  Server ready at ${url}`)
  TaskManager.loadTasksOnInit()
}

start()

async function stop() {
  await server.stop()
  console.log('Server stopped.')
  await TaskManager.stop()
  const force = false
  await app.mongoose.connection.close(force)
  console.log('MongoDb connection closed.')
  process.exit(0)
}

['SIGINT', 'SIGTERM', 'SIGQUIT', 'SIGHUP']
  .forEach(signal => process.on(signal, stop))
