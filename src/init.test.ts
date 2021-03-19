import * as td from 'testdouble'
import * as mongoose from 'mongoose'

before(() => mongoose.connect(
  process.env.DATABASE_URL as string,
  { useNewUrlParser: true, useUnifiedTopology: true, useFindAndModify: false }
))

beforeEach(() => {
  td.reset()
})

after(() => mongoose.disconnect())
