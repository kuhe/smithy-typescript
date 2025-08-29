// smithy-typescript generated code
import { ComplexError as __ComplexError, InvalidGreeting as __InvalidGreeting } from "../models/index";
import { _CE, _CNED, _F, _GWE, _GWEO, _IG, _M, _N, _TL, _g, n1 } from "./schemas_0";
import { Unit } from "./schemas_5";
import { error, op, struct } from "@smithy/core/schema";

/* eslint no-var: 0 */

export var ComplexError = error(
  n1,
  _CE,
  {
    [_e]: _c,
  },
  [_TL, _N],
  [0, () => ComplexNestedErrorData],

  __ComplexError
);
export var ComplexNestedErrorData = struct(n1, _CNED, 0, [_F], [0]);
export var GreetingWithErrorsOutput = struct(n1, _GWEO, 0, [_g], [0]);
export var InvalidGreeting = error(
  n1,
  _IG,
  {
    [_e]: _c,
  },
  [_M],
  [0],

  __InvalidGreeting
);
export var GreetingWithErrors = op(
  n1,
  _GWE,
  2,
  () => Unit,
  () => GreetingWithErrorsOutput
);
