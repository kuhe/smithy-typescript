import type { SchemaRef, StructureSchema as IStructureSchema } from "@smithy/types";

import { TypeRegistry } from "../TypeRegistry";
import { Schema } from "./Schema";

export class StructureSchema extends Schema implements IStructureSchema {
  public constructor(
    public traits: Record<string, any>,
    public members: Record<string, [SchemaRef, Record<string, any>]>
  ) {
    super(traits);
  }
}

export function struct(
  name: string,
  traits: Record<string, any> = {},
  members: Record<string, [SchemaRef, Record<string, any>]> = {}
): StructureSchema {
  const schema = new StructureSchema(traits, members);
  if (TypeRegistry.active) {
    TypeRegistry.active.register(name, schema);
  }
  return schema;
}
