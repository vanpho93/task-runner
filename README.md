# Task runner

## How to run

```bash
$ cp sample.env .env && yarn install && yarn start
```

Open `http://localhost:3000`, there should be a graphql playground running, from here, we can `CRUD tasks` or get list of `tasks` of `task results`.

Please check the `DATABASE_URL` in `.env` and update it to your mongodb if needed.

## Structure

### Models
I used my own framework `slowie` to create all needed graphql apis. All model definitions are in `src/models`.

### Processors
All processors derived from the abstract `BaseProcessor`, the derived class will have to override the `name` field and `doJob()` method.

### Task manager
Task manager is responsible for `registerTask`, `removeTask`, `loadTasksOnInit`. I used hooks to connect with `models` and task manager, take a look at `src/models/task.hook.ts`

## Testing
I want to apply TDD for this project but the time is limited so I cannot. I only write unit tests for `TaskManager` and `BaseProcessor`. The tests show my view about unit test: focus on the unit, fake all other functions even those functions can be used in the test case.

## Sample requests

### Create a task

```graphql
mutation {
  createTask (
    input: {
      processor: SAVE_LOG_TO_FILE
      // base on the processor, input may be different, see how each processor#validateInput
      input: { source: "from_the_root", destination: "to_the_leaf" }
      scheduledAt: "*/5 * * * * *"
      issuedAt: "2020-12-03T10:15:30Z"
      expiredAt: "2021-12-03T10:15:30Z"
    }
  )
  {
    _id
    processor
    input
    runnedTime
    scheduledAt
    issuedAt
    expiredAt
  }
}
```

### List all tasks
```graphql
{
  getTasks (
    offset: 0
    limit: 10
  ) {
    totalDocs
    docs {
      _id
      input
      processor 
    }
  }
}
```

### Remove a task

```graphql
mutation {
  removeTask(_id:"6b6dac485414b3d4") {
    _id
    processor
  }
}
```

### List task results

```graphql
{
  getTaskResults (
    offset: 0
    limit: 10
  ) {
    totalDocs
    docs {
      _id
      input
      processor 
    }
  }
}
```