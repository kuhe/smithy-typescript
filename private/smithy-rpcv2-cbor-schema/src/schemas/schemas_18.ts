// smithy-typescript generated code
import { _SSP, _SSS, _bV, _bVl, _dV, _fBV, _fV, _iV, _lV, _sV, _sVt, _tBV, n1 } from "./schemas_0";
import { op, struct } from "@smithy/core/schema";

/* eslint no-var: 0 */

export var SimpleScalarStructure = struct(
  n1,
  _SSS,
  0,
  [_tBV, _fBV, _bV, _dV, _fV, _iV, _lV, _sV, _sVt, _bVl],
  [2, 2, 1, 1, 1, 1, 1, 1, 0, 21]
);
export var SimpleScalarProperties = op(
  n1,
  _SSP,
  0,
  () => SimpleScalarStructure,
  () => SimpleScalarStructure
);
