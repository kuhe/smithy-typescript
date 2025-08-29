// smithy-typescript generated code
import { _SNO, _SNOIO, _SSL, _sSL, _sSMp, n1, n2 } from "./schemas_0";
import { SparseStringMap } from "./schemas_17";
import { list, op, struct } from "@smithy/core/schema";

/* eslint no-var: 0 */

export var SparseNullsOperationInputOutput = struct(
  n1,
  _SNOIO,
  0,
  [_sSL, _sSMp],
  [
    [() => SparseStringList, 0],
    [() => SparseStringMap, 0],
  ]
);
export var SparseStringList = list(
  n2,
  _SSL,
  {
    [_s]: 1,
  },
  0
);
export var SparseNullsOperation = op(
  n1,
  _SNO,
  0,
  () => SparseNullsOperationInputOutput,
  () => SparseNullsOperationInputOutput
);
