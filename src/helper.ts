import * as _ from 'lodash'
import { graphql } from 'slowie'

export const getEnumValues = (enumerator: Object): string[] => {
  return Object
    .keys(enumerator)
    .filter(key => isNaN(Number(key)))
    .map(key => enumerator[key])
}

export const createEnumType = (name: string, enumerator: Object) => {
  const values = _.chain(getEnumValues(enumerator))
    .map(key => ({ [key]: { value: enumerator[key] } }))
    .reduce(_.merge)
    .value()
  return new graphql.GraphQLEnumType({
    name,
    values,
  })
}
