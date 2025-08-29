// smithy-typescript generated code
import { _OIO, _SS, _v, n1 } from "./schemas_0";
import { op, struct } from "@smithy/core/schema";

/* eslint no-var: 0 */

export var SimpleStructure = struct(n1, _SS, 0, [_v], [0]);
export var OptionalInputOutput = op(
  n1,
  _OIO,
  0,
  () => SimpleStructure,
  () => SimpleStructure
);
