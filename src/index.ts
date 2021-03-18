import { app } from './app'

import './models/task.model'
import './models/task-result.model'

app.mongoose.connect(
  'mongodb://localhost:27017/slowie1000',
  {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false,
    useCreateIndex: true,
  }
)

app.getServer().listen(
  3000,
  () => console.log('Play server started at http://localhost:3000')
)
