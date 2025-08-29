// smithy-typescript generated code
import { _DSM, _DSMe, _RVCDM, _RVCDMIO, _dBM, _dNM, _dSM, _dSMe, _dSMen, n1 } from "./schemas_0";
import { GreetingStruct } from "./schemas_21";
import { map, op, struct } from "@smithy/core/schema";

/* eslint no-var: 0 */

export var RpcV2CborDenseMapsInputOutput = struct(
  n1,
  _RVCDMIO,
  0,
  [_dSM, _dNM, _dBM, _dSMe, _dSMen],
  [() => DenseStructMap, 128 | 1, 128 | 2, 128 | 0, map(n1, _DSM, 0, 0, 64 | 0)]
);
export var DenseBooleanMap = 128 | 2;

export var DenseNumberMap = 128 | 1;

export var DenseSetMap = map(n1, _DSM, 0, 0, 64 | 0);
export var DenseStringMap = 128 | 0;

export var DenseStructMap = map(n1, _DSMe, 0, 0, () => GreetingStruct);
export var RpcV2CborDenseMaps = op(
  n1,
  _RVCDM,
  0,
  () => RpcV2CborDenseMapsInputOutput,
  () => RpcV2CborDenseMapsInputOutput
);
