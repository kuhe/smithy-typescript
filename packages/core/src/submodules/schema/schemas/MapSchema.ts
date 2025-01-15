import type { MapSchema as IMapSchema, SchemaRef } from "@smithy/types";

import { TypeRegistry } from "../TypeRegistry";
import { Schema } from "./Schema";

export class MapSchema extends Schema implements IMapSchema {
  public constructor(
    public traits: Record<string, any>,
    public valueSchema: SchemaRef
  ) {
    super(traits);
  }
}

export function map(name: string, traits: Record<string, any> = {}, valueSchema: SchemaRef = void 0): MapSchema {
  const schema = new MapSchema(traits, typeof valueSchema === "function" ? valueSchema() : valueSchema);
  if (TypeRegistry.active) {
    TypeRegistry.active.register(name, schema);
  }
  return schema;
}
