// smithy-typescript generated code
import {
  _COD,
  _D,
  _OWD,
  _OWDI,
  _OWDO,
  _cOD,
  _dB,
  _dBe,
  _dBef,
  _dD,
  _dE,
  _dF,
  _dI,
  _dIE,
  _dL,
  _dLe,
  _dM,
  _dS,
  _dSe,
  _dT,
  _de,
  _eB,
  _eS,
  _fB,
  _me,
  _oTLD,
  _tLD,
  _zB,
  _zD,
  _zF,
  _zI,
  _zL,
  _zS,
  n1,
} from "./schemas_0";
import { op, struct } from "@smithy/core/schema";

/* eslint no-var: 0 */

export var ClientOptionalDefaults = struct(n1, _COD, 0, [_me], [1]);
export var Defaults = struct(
  n1,
  _D,
  0,
  [
    _dS,
    _dB,
    _dL,
    _dT,
    _dBe,
    _dBef,
    _dSe,
    _dI,
    _dLe,
    _dF,
    _dD,
    _dM,
    _dE,
    _dIE,
    _eS,
    _fB,
    _eB,
    _zB,
    _zS,
    _zI,
    _zL,
    _zF,
    _zD,
  ],
  [0, 2, 64 | 0, 4, 21, 1, 1, 1, 1, 1, 1, 128 | 0, 0, 1, 0, 2, 21, 1, 1, 1, 1, 1, 1]
);
export var OperationWithDefaultsInput = struct(
  n1,
  _OWDI,
  0,
  [_de, _cOD, _tLD, _oTLD],
  [() => Defaults, () => ClientOptionalDefaults, 0, 1]
);
export var OperationWithDefaultsOutput = struct(
  n1,
  _OWDO,
  0,
  [
    _dS,
    _dB,
    _dL,
    _dT,
    _dBe,
    _dBef,
    _dSe,
    _dI,
    _dLe,
    _dF,
    _dD,
    _dM,
    _dE,
    _dIE,
    _eS,
    _fB,
    _eB,
    _zB,
    _zS,
    _zI,
    _zL,
    _zF,
    _zD,
  ],
  [0, 2, 64 | 0, 4, 21, 1, 1, 1, 1, 1, 1, 128 | 0, 0, 1, 0, 2, 21, 1, 1, 1, 1, 1, 1]
);
export var TestStringList = 64 | 0;

export var TestStringMap = 128 | 0;

export var OperationWithDefaults = op(
  n1,
  _OWD,
  0,
  () => OperationWithDefaultsInput,
  () => OperationWithDefaultsOutput
);
