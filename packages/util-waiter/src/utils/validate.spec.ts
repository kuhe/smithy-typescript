import { beforeEach, describe, expect, test as it } from "vitest";

import { WaiterOptions } from "../waiter";
import { validateWaiterOptions } from "./validate";

describe(validateWaiterOptions.name, () => {
  let waiterOptions: WaiterOptions<any>;

  beforeEach(() => {
    waiterOptions = {
      maxWaitTime: 120,
      minDelay: 20,
      maxDelay: 1200,
      client: "client",
    };
  });

  it("should not throw an error when maxDelay is proper", () => {
    waiterOptions.maxDelay = 300;
    waiterOptions.minDelay = 200;
    waiterOptions.maxWaitTime = 250;
    try {
      validateWaiterOptions(waiterOptions);
    } catch (e) {
      expect(e).toBe("SHOULD NOT ERROR HERE");
    }
  });

  it("should not throw an error when maxDelay is less than minDelay", () => {
    waiterOptions.maxDelay = 120;
    waiterOptions.minDelay = 200;
    waiterOptions.maxWaitTime = 250;
    try {
      validateWaiterOptions(waiterOptions);
      expect(1).toBe("SHOULD NOT GET HERE");
    } catch (e) {
      expect(e.toString()).toBe(
        "Error: WaiterConfiguration.maxDelay [120] must be greater than WaiterConfiguration.minDelay [200] for this waiter"
      );
    }
  });

  it("should not throw an error when maxWaitTime is proper", () => {
    waiterOptions.maxWaitTime = 300;
    waiterOptions.minDelay = 200;
    try {
      validateWaiterOptions(waiterOptions);
    } catch (e) {
      expect(e).toBe("SHOULD NOT ERROR HERE");
    }
  });

  it("should not throw an error with small decimal numbers", () => {
    waiterOptions.maxWaitTime = 0.5;
    waiterOptions.minDelay = 0.0001;
    waiterOptions.maxDelay = 0.4;
    validateWaiterOptions(waiterOptions);
  });

  it("should throw when maxWaitTime is less than 0", () => {
    waiterOptions.maxWaitTime = -2;
    waiterOptions.minDelay = -1;
    try {
      validateWaiterOptions(waiterOptions);
    } catch (e) {
      expect(e.toString()).toBe("Error: WaiterConfiguration.maxWaitTime must be greater than 0");
    }
  });

  it("should throw when maxWaitTime is less than minDelay", () => {
    waiterOptions.maxWaitTime = 150;
    waiterOptions.minDelay = 200;
    try {
      validateWaiterOptions(waiterOptions);
    } catch (e) {
      expect(e.toString()).toBe(
        "Error: WaiterConfiguration.maxWaitTime [150] must be greater than WaiterConfiguration.minDelay [200] for this waiter"
      );
    }
  });

  it("should throw when maxWaitTime is equal tominDelay", () => {
    waiterOptions.maxWaitTime = 200;
    waiterOptions.minDelay = 200;
    try {
      validateWaiterOptions(waiterOptions);
    } catch (e) {
      expect(e.toString()).toBe(
        "Error: WaiterConfiguration.maxWaitTime [200] must be greater than WaiterConfiguration.minDelay [200] for this waiter"
      );
    }
  });
});
