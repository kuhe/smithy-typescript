import { deref, ListSchema, StructureSchema } from "@smithy/core/schema";
import { copyDocumentWithTransform, parseEpochTimestamp } from "@smithy/smithy-client";
import { Codec, Schema, ShapeDeserializer, ShapeSerializer } from "@smithy/types";

import { cbor } from "./cbor";
import { dateToTag } from "./parseCborBody";

/* eslint @typescript-eslint/no-unused-vars: 0 */

export class CborCodec implements Codec {
  public createSerializer(): CborShapeSerializer {
    return new CborShapeSerializer();
  }
  public createDeserializer(): CborShapeDeserializer {
    return new CborShapeDeserializer();
  }
}

export class CborShapeSerializer implements ShapeSerializer {
  private value: unknown;

  public write(schema: Schema, value: unknown): void {
    // Uint8Array (blob) is already supported by cbor serializer.

    // As for timestamps, we don't actually need to refer to the schema since
    // all Date objects have a uniform serialization target.
    this.value = copyDocumentWithTransform(value, (_: any) => {
      if (_ instanceof Date) {
        return dateToTag(_);
      }
      return _;
    });
  }

  public async flush(): Promise<Uint8Array> {
    const buffer = cbor.serialize(this.value);
    this.value = undefined;
    return buffer as Uint8Array;
  }
}

export class CborShapeDeserializer implements ShapeDeserializer {
  public read(schema: Schema, bytes: Uint8Array): any {
    const data: any = cbor.deserialize(bytes);
    return this.readValue(schema, data);
  }

  private readValue(schema: Schema, value: any): any {
    if (typeof schema === "string") {
      if (schema === "time" || schema === "epoch-seconds") {
        return parseEpochTimestamp(value);
      }
      if (schema === "blob") {
        return value;
      }
    }
    switch (typeof value) {
      case "undefined":
      case "boolean":
      case "number":
      case "string":
      case "bigint":
      case "symbol":
        return value;
      case "function":
      case "object":
        if (value === null) {
          return null;
        }
        if (Array.isArray(value)) {
          const newArray = new Array(value.length);
          let i = 0;
          for (const item of value) {
            newArray[i++] = this.readValue(schema instanceof ListSchema ? deref(schema.valueSchema) : void 0, item);
          }
          return newArray;
        }
        if ("byteLength" in (value as Uint8Array)) {
          return value;
        }
        if (value instanceof Date) {
          return value;
        }
        const newObject = {} as any;
        for (const key of Object.keys(value)) {
          newObject[key] = this.readValue(
            schema instanceof StructureSchema ? deref(schema.members[key]?.[0]) : void 0,
            value[key]
          );
        }
        return newObject;
      default:
        return value;
    }
  }

  public getContainerSize(): number {
    throw new Error("Method not implemented.");
  }
}
