const _D = "Defaults";
const _EIO = "EmptyInputOutput";
const _F = "Float16";
const _FS = "FractionalSeconds";
const _FSO = "FractionalSecondsOutput";
const _GWE = "GreetingWithErrors";
const _NIO = "NoInputOutput";
const _OIO = "OptionalInputOutput";
const _OWD = "OperationWithDefaults";
const _OWDI = "OperationWithDefaultsInput";
const _OWDO = "OperationWithDefaultsOutput";
const _RS = "RecursiveShapes";
const _RVCDM = "RpcV2CborDenseMaps";
const _RVCL = "RpcV2CborLists";
const _RVCLIO = "RpcV2CborListInputOutput";
const _RVCSM = "RpcV2CborSparseMaps";
const _SNO = "SparseNullsOperation";
const _SSP = "SimpleScalarProperties";
const _SSS = "SimpleScalarStructure";
const _bL = "blobList";
const _bV = "blobValue";
const _d = "datetime";
const _dB = "defaultBlob";
const _dT = "defaultTimestamp";
const _de = "defaults";
const _eB = "emptyBlob";
const _tL = "timestampList";

// smithy-typescript generated code
import { Unit } from "./smithy.api";
import { BlobList, TimestampList } from "./smithy.protocoltests.shared";
import { TypeRegistry, op as __op, struct as __struct } from "@smithy/core/schema";

/* eslint no-var: 0 */

export const smithy_protocoltests_rpcv2CborRegistry = TypeRegistry.for("smithy.protocoltests.rpcv2Cbor");
smithy_protocoltests_rpcv2CborRegistry.startCapture();
export var ClientOptionalDefaults: undefined;

export var Defaults = __struct(
  _D,
  {},
  {
    [_dT]: [() => "time", {}],
    [_dB]: [() => "blob", {}],
    [_eB]: [() => "blob", {}],
  }
);
export var EmptyStructure: undefined;

export var Float16Output: undefined;

export var FractionalSecondsOutput = __struct(
  _FSO,
  {},
  {
    [_d]: [() => "date-time", {}],
  }
);
export var GreetingWithErrorsOutput: undefined;

export var OperationWithDefaultsInput = __struct(
  _OWDI,
  {},
  {
    [_de]: [() => Defaults, {}],
  }
);
export var OperationWithDefaultsOutput = __struct(
  _OWDO,
  {},
  {
    [_dT]: [() => "time", {}],
    [_dB]: [() => "blob", {}],
    [_eB]: [() => "blob", {}],
  }
);
export var RecursiveShapesInputOutput: undefined;

export var RecursiveShapesInputOutputNested1: undefined;

export var RecursiveShapesInputOutputNested2: undefined;

export var RpcV2CborDenseMapsInputOutput: undefined;

export var RpcV2CborListInputOutput = __struct(
  _RVCLIO,
  {},
  {
    [_tL]: [() => TimestampList, {}],
    [_bL]: [() => BlobList, {}],
  }
);
export var RpcV2CborSparseMapsInputOutput: undefined;

export var SimpleScalarStructure = __struct(
  _SSS,
  {},
  {
    [_bV]: [() => "blob", {}],
  }
);
export var SimpleStructure: undefined;

export var SparseNullsOperationInputOutput: undefined;

export var StructureListMember: undefined;

export var StructureList: undefined;

export var TestStringList: undefined;

export var DenseBooleanMap: undefined;

export var DenseNumberMap: undefined;

export var DenseSetMap: undefined;

export var DenseStringMap: undefined;

export var DenseStructMap: undefined;

export var SparseBooleanMap: undefined;

export var SparseNumberMap: undefined;

export var SparseSetMap: undefined;

export var SparseStructMap: undefined;

export var TestStringMap: undefined;

export var EmptyInputOutput = __op(
  _EIO,
  {},
  () => EmptyStructure,
  () => EmptyStructure
);
export var Float16 = __op(
  _F,
  {},
  () => Unit,
  () => Float16Output
);
export var FractionalSeconds = __op(
  _FS,
  {},
  () => Unit,
  () => FractionalSecondsOutput
);
export var GreetingWithErrors = __op(
  _GWE,
  {},
  () => Unit,
  () => GreetingWithErrorsOutput
);
export var NoInputOutput = __op(
  _NIO,
  {},
  () => Unit,
  () => Unit
);
export var OperationWithDefaults = __op(
  _OWD,
  {},
  () => OperationWithDefaultsInput,
  () => OperationWithDefaultsOutput
);
export var OptionalInputOutput = __op(
  _OIO,
  {},
  () => SimpleStructure,
  () => SimpleStructure
);
export var RecursiveShapes = __op(
  _RS,
  {},
  () => RecursiveShapesInputOutput,
  () => RecursiveShapesInputOutput
);
export var RpcV2CborDenseMaps = __op(
  _RVCDM,
  {},
  () => RpcV2CborDenseMapsInputOutput,
  () => RpcV2CborDenseMapsInputOutput
);
export var RpcV2CborLists = __op(
  _RVCL,
  {},
  () => RpcV2CborListInputOutput,
  () => RpcV2CborListInputOutput
);
export var RpcV2CborSparseMaps = __op(
  _RVCSM,
  {},
  () => RpcV2CborSparseMapsInputOutput,
  () => RpcV2CborSparseMapsInputOutput
);
export var SimpleScalarProperties = __op(
  _SSP,
  {},
  () => SimpleScalarStructure,
  () => SimpleScalarStructure
);
export var SparseNullsOperation = __op(
  _SNO,
  {},
  () => SparseNullsOperationInputOutput,
  () => SparseNullsOperationInputOutput
);
smithy_protocoltests_rpcv2CborRegistry.stopCapture();
