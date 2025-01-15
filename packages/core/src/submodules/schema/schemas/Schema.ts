import type { MemberSchema, TraitsSchema } from "@smithy/types";

/**
 * @internal
 */
export abstract class Schema implements TraitsSchema {
  protected constructor(public traits: Record<string, any>) {}

  public static isMemberSchema(schema: unknown): schema is MemberSchema {
    return Array.isArray(schema);
  }
}
