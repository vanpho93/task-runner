import * as _ from 'lodash'
import * as scalars from 'graphql-scalars'
import { Schema } from 'mongoose'
import { graphql, IField, EDefaultApis } from 'slowie'
import { ITaskResult } from './task-result.interface'
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
    read: { type: scalars.GraphQLJSONObject },
  },
  db: { type: Schema.Types.Mixed },
}

const output: IField<IContext, string> = {
  graphql: {
    read: { type: scalars.GraphQLJSONObject },
  },
  db: { type: Schema.Types.Mixed },
}

const error: IField<IContext, string> = {
  graphql: {
    read: { type: graphql.GraphQLString },
  },
  db: { type: String },
}

const startedAt: IField<IContext, number> = {
  graphql: {
    read: { type: scalars.DateTimeResolver },
  },
  db: { type: Date, default: Date.now },
}

const finishedAt: IField<IContext, number> = {
  graphql: {
    read: { type: scalars.DateTimeResolver },
  },
  db: { type: Date },
}

const success: IField<IContext, boolean> = {
  graphql: {
    read: { type: graphql.GraphQLBoolean },
  },
  db: { type: Boolean },
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
    success,
  },
  hideDefaultApis: [
    EDefaultApis.CREATE,
    EDefaultApis.REMOVE,
    EDefaultApis.UPDATE,
  ],
})

TaskResult.createIndexes()
