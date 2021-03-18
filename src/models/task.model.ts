import * as _ from 'lodash'
import * as scalars from 'graphql-scalars'
import { ITask } from './task.interface'
import { graphql, IField } from 'slowie'
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
    default: { type: scalars.GraphQLJSONObject },
    create: { type: graphql.GraphQLNonNull(scalars.GraphQLJSONObject) },
    update: null,
  },
  db: { type: String },
}

const timeCount: IField<IContext, number> = {
  graphql: {
    default: { type: graphql.GraphQLInt },
  },
  db: { type: Number },
}

const runnedTime: IField<IContext, number> = {
  graphql: {
    read: { type: graphql.GraphQLInt },
  },
  db: { type: Number, default: 0 },
}

const scheduledAt: IField<IContext, string> = {
  graphql: {
    default: { type: graphql.GraphQLString },
    create: { type: graphql.GraphQLNonNull(graphql.GraphQLString) },
  },
  db: { type: String, required: true },
}

const issuedAt: IField<IContext, string> = {
  graphql: {
    default: { type: graphql.GraphQLString },
    create: { type: graphql.GraphQLNonNull(graphql.GraphQLString) },
  },
  db: { type: Date, required: true },
}

const expiredAt: IField<IContext, string> = {
  graphql: {
    default: { type: graphql.GraphQLString },
    create: { type: graphql.GraphQLNonNull(graphql.GraphQLString) },
  },
  db: { type: Date },
}

export const Task = app.createModel<ITask>({
  name: 'Task',
  schema: {
    _id: builtInFields.id,
    processor,
    input,
    timeCount,
    runnedTime,
    scheduledAt,
    issuedAt,
    expiredAt,
  },
})

Task.createIndexes()
