import * as _ from 'lodash'
import { Schema } from 'mongoose'
import { isValidCron } from 'cron-validator'
import * as scalars from 'graphql-scalars'

import { ITask } from './task.interface'
import { ApolloServer, graphql, IField } from 'slowie'
import { app, IContext } from '../app'
import { builtInFields } from './shared'
import { EProcessorName } from '../processors/metadata'
import { createEnumType } from '../helper'

const processorEnum = createEnumType('Processor', EProcessorName)

const processor: IField<IContext, string> = {
  graphql: {
    default: { type: processorEnum },
    create: { type: graphql.GraphQLNonNull(processorEnum) },
    update: null,
  },
  db: { type: String },
}

const paused: IField<IContext, boolean> = {
  graphql: {
    default: { type: graphql.GraphQLBoolean },
  },
  db: { type: Boolean, required: true, default: false },
}

const input: IField<IContext, string> = {
  graphql: {
    default: { type: scalars.GraphQLJSONObject },
    create: { type: graphql.GraphQLNonNull(scalars.GraphQLJSONObject) },
    update: null,
  },
  db: { type: Schema.Types.Mixed },
}

const runnedTime: IField<IContext, number> = {
  graphql: {
    read: { type: graphql.GraphQLInt },
  },
  db: { type: Number, default: 0 },
}

const scheduledAt: IField<IContext, string> = {
  graphql: {
    read: { type: graphql.GraphQLString },
    create: { type: graphql.GraphQLNonNull(graphql.GraphQLString) },
  },
  validate: (_context, value) => {
    if (isValidCron(value, { seconds: true })) return
    throw new ApolloServer.UserInputError('INVALID_CRON_DESCRIPTION')
  },
  db: { type: String, required: true },
}

const issuedAt: IField<IContext, string> = {
  graphql: {
    default: { type: scalars.DateTimeResolver },
  },
  db: { type: Date, required: true, default: Date.now },
}

const expiredAt: IField<IContext, string> = {
  graphql: {
    default: { type: scalars.DateTimeResolver },
  },
  db: { type: Date },
}

export const Task = app.createModel<ITask>({
  name: 'Task',
  schema: {
    _id: builtInFields.id,
    processor,
    input,
    runnedTime,
    scheduledAt,
    issuedAt,
    expiredAt,
    paused,
  },
})

Task.createIndexes()
