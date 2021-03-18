import * as _ from 'lodash'
import { customAlphabet } from 'nanoid'
import { graphql } from 'slowie'

const nanoid = customAlphabet('1234567890abcdef', 16)

export const builtInFields = {
  id: {
    graphql: {
      default: { type: graphql.GraphQLString },
      create: null,
      update: null,
    },
    db: { type: String, default: nanoid },
  },
  createdAt: {
    read: { type: graphql.GraphQLString },
  },
  updatedAt: {
    read: { type: graphql.GraphQLString },
  },
}

export interface IBaseModel {
  _id: string
}
