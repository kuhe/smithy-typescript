// smithy-typescript generated code
import { ValidationException as __ValidationException } from "../models/index";
import { _VE, _VEF, _VEFL, _fL, _m, _p, n0 } from "./schemas_0";
import { error, list, struct } from "@smithy/core/schema";

/* eslint no-var: 0 */

export var ValidationException = error(
  n0,
  _VE,
  {
    [_e]: _c,
  },
  [_m, _fL],
  [0, () => ValidationExceptionFieldList],

  __ValidationException
);
export var ValidationExceptionField = struct(n0, _VEF, 0, [_p, _m], [0, 0]);
export var ValidationExceptionFieldList = list(n0, _VEFL, 0, () => ValidationExceptionField);
