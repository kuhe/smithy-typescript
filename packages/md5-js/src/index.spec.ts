import { fromBase64 } from "@smithy/util-base64";
import { toHex } from "@smithy/util-hex-encoding";
import { describe, expect, test as it } from "vitest";

import { Md5 } from "./";
const hashVectors = require("hash-test-vectors");

describe("Md5", () => {
  let idx = 0;
  for (const { input, ...results } of hashVectors) {
    const expected = results["md5"];
    it(`should calculate a MD5 hash of ${expected} for test vector ${++idx}`, async () => {
      const hash = new Md5();
      hash.update(fromBase64(input));
      expect(toHex(await hash.digest())).toBe(expected);
    });
  }
});
