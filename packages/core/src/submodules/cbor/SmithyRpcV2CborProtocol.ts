import { HttpProtocol } from "@smithy/core/protocols";
import { HttpInterceptingShapeSerializer, OperationSchema } from "@smithy/core/schema";
import type {
  HandlerExecutionContext,
  HttpRequest as IHttpRequest,
  HttpResponse as IHttpResponse,
  MetadataBearer,
} from "@smithy/types";
import { getSmithyContext } from "@smithy/util-middleware";

import { CborCodec, CborShapeSerializer } from "./CborCodec";

export class SmithyRpcV2CborProtocol extends HttpProtocol {
  private codec = new CborCodec();
  protected serializer = new HttpInterceptingShapeSerializer<CborShapeSerializer>(this.codec.createSerializer());
  protected deserializer = this.codec.createDeserializer();

  public getShapeId(): string {
    return "smithy.protocols#rpcv2Cbor";
  }

  public async serializeRequest<Input extends object>(
    operationSchema: OperationSchema,
    input: Input,
    context: HandlerExecutionContext
  ): Promise<IHttpRequest> {
    const request = await super.serializeRequest(operationSchema, input, context);
    Object.assign(request.headers, {
      "content-type": "application/cbor",
      "smithy-protocol": "rpc-v2-cbor",
      accept: "application/cbor",
    });
    if (!request.body || (request.body as Uint8Array).byteLength === 0) {
      delete request.headers["content-type"];
    } else {
      try {
        request.headers["content-length"] = String((request.body as Uint8Array).byteLength);
      } catch (e) {}
    }
    const { service, operation } = getSmithyContext(context) as {
      service: string;
      operation: string;
    };
    const path = `/service/${service}/operation/${operation}`;
    if (request.path.endsWith("/")) {
      request.path = request.path + path.slice(1);
    } else {
      request.path = request.path + path;
    }
    return request;
  }

  public async deserializeResponse<Output extends MetadataBearer>(
    operationSchema: OperationSchema,
    context: HandlerExecutionContext,
    response: IHttpResponse
  ): Promise<Output> {
    return super.deserializeResponse(operationSchema, context, response);
  }
}
