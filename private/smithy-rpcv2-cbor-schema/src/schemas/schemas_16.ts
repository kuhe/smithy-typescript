// smithy-typescript generated code
import { _RVCSM, _RVCSMIO, _SBM, _SNM, _SSM, _SSMp, _sBM, _sNM, _sSM, _sSMp, _sSMpa, n1 } from "./schemas_0";
import { SparseStringMap } from "./schemas_17";
import { GreetingStruct } from "./schemas_21";
import { map, op, struct } from "@smithy/core/schema";

/* eslint no-var: 0 */

export var RpcV2CborSparseMapsInputOutput = struct(
  n1,
  _RVCSMIO,
  0,
  [_sSM, _sNM, _sBM, _sSMp, _sSMpa],
  [
    [() => SparseStructMap, 0],
    [() => SparseNumberMap, 0],
    [() => SparseBooleanMap, 0],
    [() => SparseStringMap, 0],
    [() => SparseSetMap, 0],
  ]
);
export var SparseBooleanMap = map(
  n1,
  _SBM,
  {
    [_s]: 1,
  },
  0,
  2
);
export var SparseNumberMap = map(
  n1,
  _SNM,
  {
    [_s]: 1,
  },
  0,
  1
);
export var SparseSetMap = map(
  n1,
  _SSM,
  {
    [_s]: 1,
  },
  0,
  64 | 0
);
export var SparseStructMap = map(
  n1,
  _SSMp,
  {
    [_s]: 1,
  },
  0,
  () => GreetingStruct
);
export var RpcV2CborSparseMaps = op(
  n1,
  _RVCSM,
  0,
  () => RpcV2CborSparseMapsInputOutput,
  () => RpcV2CborSparseMapsInputOutput
);
