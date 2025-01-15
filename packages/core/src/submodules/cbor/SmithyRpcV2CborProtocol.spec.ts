import { struct } from "@smithy/core/schema";
import { HttpRequest } from "@smithy/protocol-http";
import { toBase64 } from "@smithy/util-base64";
import { describe, expect, test as it } from "vitest";

import { cbor } from "./cbor";
import { dateToTag } from "./parseCborBody";
import { SmithyRpcV2CborProtocol } from "./SmithyRpcV2CborProtocol";

describe(SmithyRpcV2CborProtocol.name, () => {
  const bytes = (arr: number[]) => Buffer.from(arr);

  const testCases = [
    {
      name: "document with timestamp and blob",
      schema: struct(
        "MyExtendedDocument",
        {},
        {
          timestamp: [() => "time", {}],
          blob: [() => "blob", {}],
        }
      ),
      input: {
        bool: true,
        int: 5,
        float: -3.001,
        timestamp: new Date(1_000_000),
        blob: bytes([97, 98, 99, 100]),
      },
      expected: {
        request: {},
        body: {
          bool: true,
          int: 5,
          float: -3.001,
          timestamp: dateToTag(new Date(1_000_000)),
          blob: bytes([97, 98, 99, 100]),
        },
      },
    },
    {
      name: "write to header and query",
      schema: struct(
        "MyExtendedDocument",
        {},
        {
          bool: [, { httpQuery: "bool" }],
          timestamp: [
            () => "time",
            {
              httpHeader: "timestamp",
            },
          ],
          blob: [
            () => "blob",
            {
              httpHeader: "blob",
            },
          ],
          prefixHeaders: [, { httpPrefixHeaders: "anti-" }],
          searchParams: [, { httpQueryParams: {} }],
        }
      ),
      input: {
        bool: true,
        timestamp: new Date(1_000_000),
        blob: bytes([97, 98, 99, 100]),
        prefixHeaders: {
          pasto: "cheese dodecahedron",
          clockwise: "left",
        },
        searchParams: {
          a: 1,
          b: 2,
        },
      },
      expected: {
        request: {
          headers: {
            timestamp: new Date(1_000_000).toISOString(),
            blob: toBase64(bytes([97, 98, 99, 100])),
            "anti-clockwise": "left",
            "anti-pasto": "cheese dodecahedron",
          },
          query: { bool: "true", a: "1", b: "2" },
        },
        body: {},
      },
    },
    {
      name: "timestamp with header",
      schema: struct(
        "MyShape",
        {},
        {
          myHeader: [
            ,
            {
              httpHeader: "my-header",
            },
          ],
          myTimestamp: [() => "time", {}],
        }
      ),
      input: {
        myHeader: "header!",
        myTimestamp: new Date(0),
      },
      expected: {
        request: {
          headers: {
            ["my-header"]: "header!",
          },
        },
        body: {
          myTimestamp: dateToTag(new Date(0)),
        },
      },
    },
  ];

  for (const testCase of testCases) {
    it(`should serialize HTTP Requests: ${testCase.name}`, async () => {
      const protocol = new SmithyRpcV2CborProtocol();
      expect(protocol).toBeDefined();

      const httpRequest = await protocol.serializeRequest(
        {
          input: testCase.schema,
          output: void 0,
          traits: {},
        },
        testCase.input,
        {
          endpointV2: {
            url: new URL("https://example.com/"),
          },
        }
      );

      const body = httpRequest.body;
      httpRequest.body = void 0;

      expect(httpRequest).toEqual(
        new HttpRequest({
          protocol: "https:",
          hostname: "example.com",
          ...testCase.expected.request,
        })
      );

      expect(cbor.deserialize(body)).toEqual(testCase.expected.body);
    });
  }
});
