// smithy-typescript generated code
import { _RS, _RSIO, _RSION, _RSIONe, _b, _f, _n, _rM, n1 } from "./schemas_0";
import { op, struct } from "@smithy/core/schema";

/* eslint no-var: 0 */

export var RecursiveShapesInputOutput = struct(n1, _RSIO, 0, [_n], [() => RecursiveShapesInputOutputNested1]);
export var RecursiveShapesInputOutputNested1 = struct(
  n1,
  _RSION,
  0,
  [_f, _n],
  [0, () => RecursiveShapesInputOutputNested2]
);
export var RecursiveShapesInputOutputNested2 = struct(
  n1,
  _RSIONe,
  0,
  [_b, _rM],
  [0, () => RecursiveShapesInputOutputNested1]
);
export var RecursiveShapes = op(
  n1,
  _RS,
  0,
  () => RecursiveShapesInputOutput,
  () => RecursiveShapesInputOutput
);
