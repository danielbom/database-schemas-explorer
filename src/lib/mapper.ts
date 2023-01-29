export type MapperSchema<IN, OUT> = {
  [K in keyof OUT]: (it: IN) => OUT[K]
}

export function map<IN, OUT>(schema: MapperSchema<IN, OUT>, it: IN): OUT {
  const result: any = {}
  for (const key in schema) {
    result[key] = schema[key](it)
  }
  return result
}

export function createSchema<IN, OUT>(schema: MapperSchema<IN, OUT>): MapperSchema<IN, OUT> {
  return schema
}

export function createMapper<IN, OUT>(schema: MapperSchema<IN, OUT>): (it: IN) => OUT {
  return (it: IN) => map(schema, it)
}

export function define<IN, OUT>(schema: MapperSchema<IN, OUT>) {
  return { schema, map: createMapper(schema) }
}
