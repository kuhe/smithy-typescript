import { NormalizedSchema, TypeRegistry } from "@smithy/core/schema";
import { Schema, ShapeDeserializer } from "@smithy/types";
import { toUtf8 } from "@smithy/util-utf8";

import { FromStringShapeDeserializer } from "./FromStringShapeDeserializer";

export class HttpInterceptingShapeDeserializer<CodecShapeDeserializer extends ShapeDeserializer<any>>
  implements ShapeDeserializer<string | Uint8Array>
{
  private stringDeserializer: FromStringShapeDeserializer;

  public constructor(
    private codecDeserializer: CodecShapeDeserializer,
    registry: TypeRegistry,
    defaultTimestampParser: (time: string) => Date
  ) {
    this.stringDeserializer = new FromStringShapeDeserializer(registry, defaultTimestampParser);
  }
  public read(schema: Schema, data: string | Uint8Array): any | Promise<any> {
    const ns = NormalizedSchema.of(schema);
    if (ns.isMemberSchema()) {
      const traits = ns.getMergedTraits();

      if (traits.httpHeader) {
        return this.stringDeserializer.read(ns, toUtf8(data));
      }
    }
    return this.codecDeserializer.read(ns, data);
  }
  public getContainerSize(): number {
    throw new Error("Method not implemented.");
  }
}
