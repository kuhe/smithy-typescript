import type { OperationSchema as IOperationSchema, SchemaRef } from "@smithy/types";

import { TypeRegistry } from "../TypeRegistry";
import { Schema } from "./Schema";

export class OperationSchema extends Schema implements IOperationSchema {
  public constructor(
    public traits: Record<string, any>,
    public input: SchemaRef,
    public output: SchemaRef
  ) {
    super(traits);
  }
}

export function op(
  name: string,
  traits: Record<string, any> = {},
  input: SchemaRef,
  output: SchemaRef
): OperationSchema {
  const schema = new OperationSchema(traits, input, output);
  if (TypeRegistry.active) {
    TypeRegistry.active.register(name, schema);
  }
  return schema;
}
