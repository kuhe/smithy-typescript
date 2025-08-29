// smithy-typescript generated code
import {
  _NSL,
  _RVCL,
  _RVCLIO,
  _SL,
  _SLM,
  _a,
  _bL,
  _bLl,
  _b_,
  _eL,
  _iEL,
  _iL,
  _nSL,
  _sL,
  _sLt,
  _sS,
  _tL,
  n1,
  n2,
} from "./schemas_0";
import { list, op, struct } from "@smithy/core/schema";

/* eslint no-var: 0 */

export var RpcV2CborListInputOutput = struct(
  n1,
  _RVCLIO,
  0,
  [_sL, _sS, _iL, _bL, _tL, _eL, _iEL, _nSL, _sLt, _bLl],
  [64 | 0, 64 | 0, 64 | 1, 64 | 2, 64 | 4, 64 | 0, 64 | 1, list(n2, _NSL, 0, 64 | 0), () => StructureList, 64 | 21]
);
export var StructureListMember = struct(n1, _SLM, 0, [_a, _b_], [0, 0]);
export var StructureList = list(n1, _SL, 0, () => StructureListMember);
export var BlobList = 64 | 21;

export var BooleanList = 64 | 2;

export var FooEnumList = 64 | 0;

export var IntegerEnumList = 64 | 1;

export var IntegerList = 64 | 1;

export var NestedStringList = list(n2, _NSL, 0, 64 | 0);
export var StringList = 64 | 0;

export var TimestampList = 64 | 4;

export var RpcV2CborLists = op(
  n1,
  _RVCL,
  2,
  () => RpcV2CborListInputOutput,
  () => RpcV2CborListInputOutput
);
