const _BL = "BlobList";
const _DT = "DateTime";
const _TL = "TimestampList";

// smithy-typescript generated code
import { TypeRegistry, list as __list } from "@smithy/core/schema";

/* eslint no-var: 0 */

export const smithy_protocoltests_sharedRegistry = TypeRegistry.for("smithy.protocoltests.shared");
smithy_protocoltests_sharedRegistry.startCapture();
export var GreetingStruct: undefined;

export var BlobList = __list(_BL, {}, () => "blob");
export var BooleanList: undefined;

export var FooEnumList: undefined;

export var IntegerEnumList: undefined;

export var IntegerList: undefined;

export var NestedStringList: undefined;

export var SparseStringList: undefined;

export var StringList: undefined;

export var StringSet: undefined;

export var TimestampList = __list(_TL, {}, () => "time");
export var SparseStringMap: undefined;

smithy_protocoltests_sharedRegistry.stopCapture();
