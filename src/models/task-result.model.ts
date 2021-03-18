import * as _ from 'lodash'
import { ITaskResult } from './task-result.interface'
import { graphql, IField, EDefaultApis } from 'slowie'
import { app, IContext } from '../app'
import { builtInFields } from './shared'

const processor: IField<IContext, string> = {
  graphql: {
    default: { type: graphql.GraphQLString },
    create: { type: graphql.GraphQLNonNull(graphql.GraphQLString) },
    update: null,
  },
  db: { type: String },
}

const input: IField<IContext, string> = {
  graphql: {
    read: { type: graphql.GraphQLString },
  },
  db: { type: String },
}

const output: IField<IContext, string> = {
  graphql: {
    read: { type: graphql.GraphQLString },
  },
  db: { type: String },
}

const error: IField<IContext, string> = {
  graphql: {
    read: { type: graphql.GraphQLString },
  },
  db: { type: String },
}

const startedAt: IField<IContext, number> = {
  graphql: {
    read: { type: graphql.GraphQLInt },
  },
  db: { type: Date, default: () => new Date() },
}

const finishedAt: IField<IContext, number> = {
  graphql: {
    read: { type: graphql.GraphQLInt },
  },
  db: { type: Date },
}

const sucess: IField<IContext, boolean> = {
  graphql: {
    read: { type: graphql.GraphQLBoolean },
  },
  db: { type: Boolean, required: true, default: false },
}

export const TaskResult = app.createModel<ITaskResult<any, any>>({
  name: 'TaskResult',
  schema: {
    _id: builtInFields.id,
    processor,
    input,
    output,
    error,
    startedAt,
    finishedAt,
    sucess,
  },
  hideDefaultApis: [
    EDefaultApis.CREATE,
    EDefaultApis.REMOVE,
    EDefaultApis.UPDATE,
  ],
})

TaskResult.createIndexes()
