// smithy-typescript generated code
import { RpcV2ProtocolClientResolvedConfig, ServiceInputTypes, ServiceOutputTypes } from "../RpcV2ProtocolClient";
import { SparseNullsOperationInputOutput } from "../models/models_0";
import { SparseNullsOperation } from "../schemas/smithy.protocoltests.rpcv2Cbor";
import { Command as $Command } from "@smithy/smithy-client";
import { MetadataBearer as __MetadataBearer } from "@smithy/types";

/**
 * @public
 */
export type { __MetadataBearer };
export { $Command };
/**
 * @public
 *
 * The input for {@link SparseNullsOperationCommand}.
 */
export interface SparseNullsOperationCommandInput extends SparseNullsOperationInputOutput {}
/**
 * @public
 *
 * The output of {@link SparseNullsOperationCommand}.
 */
export interface SparseNullsOperationCommandOutput extends SparseNullsOperationInputOutput, __MetadataBearer {}

/**
 * @public
 *
 * @example
 * Use a bare-bones client and the command you need to make an API call.
 * ```javascript
 * import { RpcV2ProtocolClient, SparseNullsOperationCommand } from "@smithy/smithy-rpcv2-cbor"; // ES Modules import
 * // const { RpcV2ProtocolClient, SparseNullsOperationCommand } = require("@smithy/smithy-rpcv2-cbor"); // CommonJS import
 * const client = new RpcV2ProtocolClient(config);
 * const input = { // SparseNullsOperationInputOutput
 *   sparseStringList: [ // SparseStringList
 *     "STRING_VALUE",
 *   ],
 *   sparseStringMap: { // SparseStringMap
 *     "<keys>": "STRING_VALUE",
 *   },
 * };
 * const command = new SparseNullsOperationCommand(input);
 * const response = await client.send(command);
 * // { // SparseNullsOperationInputOutput
 * //   sparseStringList: [ // SparseStringList
 * //     "STRING_VALUE",
 * //   ],
 * //   sparseStringMap: { // SparseStringMap
 * //     "<keys>": "STRING_VALUE",
 * //   },
 * // };
 *
 * ```
 *
 * @param SparseNullsOperationCommandInput - {@link SparseNullsOperationCommandInput}
 * @returns {@link SparseNullsOperationCommandOutput}
 * @see {@link SparseNullsOperationCommandInput} for command's `input` shape.
 * @see {@link SparseNullsOperationCommandOutput} for command's `response` shape.
 * @see {@link RpcV2ProtocolClientResolvedConfig | config} for RpcV2ProtocolClient's `config` shape.
 *
 * @throws {@link RpcV2ProtocolServiceException}
 * <p>Base exception class for all service exceptions from RpcV2Protocol service.</p>
 *
 */
export class SparseNullsOperationCommand extends $Command
  .classBuilder<
    SparseNullsOperationCommandInput,
    SparseNullsOperationCommandOutput,
    RpcV2ProtocolClientResolvedConfig,
    ServiceInputTypes,
    ServiceOutputTypes
  >()
  .m(function (this: any, Command: any, cs: any, config: RpcV2ProtocolClientResolvedConfig, o: any) {
    return [];
  })
  .s("RpcV2Protocol", "SparseNullsOperation", {})
  .n("RpcV2ProtocolClient", "SparseNullsOperationCommand")
  .f(void 0, void 0)
  .sc(SparseNullsOperation)
  .build() {
  /** @internal type navigation helper, not in runtime. */
  protected declare static __types: {
    api: {
      input: SparseNullsOperationInputOutput;
      output: SparseNullsOperationInputOutput;
    };
    sdk: {
      input: SparseNullsOperationCommandInput;
      output: SparseNullsOperationCommandOutput;
    };
  };
}
