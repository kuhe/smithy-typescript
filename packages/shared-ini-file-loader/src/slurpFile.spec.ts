// ToDo: Change to "fs/promises" when supporting nodejs>=14
import { promises } from "fs";
import { afterEach, beforeEach, describe, expect, test as it, vi } from "vitest";

vi.mock("fs", () => ({ promises: { readFile: vi.fn() } }));

describe("slurpFile", () => {
  const UTF8 = "utf8";
  const getMockFileContents = (path: string, options = UTF8) => JSON.stringify({ path, options });

  beforeEach(() => {
    (promises.readFile as any).mockImplementation(async (path: any, options: any) => {
      await new Promise((resolve) => setTimeout(resolve, 100));
      return getMockFileContents(path, options);
    });
  });

  afterEach(() => {
    vi.clearAllMocks();
    vi.resetModules();
  });

  describe("makes one readFile call for a filepath irrespective of slurpFile calls", () => {
    it.each([10, 100, 1000, 10000])("parallel calls: %d ", async (num: number) => {
      const { slurpFile } = await import("./slurpFile");
      const mockPath = "/mock/path";
      const mockPathContent = getMockFileContents(mockPath);

      expect(promises.readFile).not.toHaveBeenCalled();
      const fileContentArr = await Promise.all(Array(num).fill(slurpFile(mockPath)));
      expect(fileContentArr).toStrictEqual(Array(num).fill(mockPathContent));

      // There is one readFile call even through slurpFile is called in parallel num times.
      expect(promises.readFile).toHaveBeenCalledTimes(1);
      expect(promises.readFile).toHaveBeenCalledWith(mockPath, UTF8);
    });

    it("two parallel calls and one sequential call", async () => {
      const { slurpFile } = await import("./slurpFile");
      const mockPath = "/mock/path";
      const mockPathContent = getMockFileContents(mockPath);

      expect(promises.readFile).not.toHaveBeenCalled();
      const fileContentArr = await Promise.all([slurpFile(mockPath), slurpFile(mockPath)]);
      expect(fileContentArr).toStrictEqual([mockPathContent, mockPathContent]);

      // There is one readFile call even through slurpFile is called in parallel twice.
      expect(promises.readFile).toHaveBeenCalledTimes(1);
      expect(promises.readFile).toHaveBeenCalledWith(mockPath, UTF8);

      const fileContent = await slurpFile(mockPath);
      expect(fileContent).toStrictEqual(mockPathContent);

      // There is one readFile call even through slurpFile is called for the third time.
      expect(promises.readFile).toHaveBeenCalledTimes(1);
    });
  });

  it("makes multiple readFile calls with based on filepaths", async () => {
    const { slurpFile } = await import("./slurpFile");

    const mockPath1 = "/mock/path/1";
    const mockPathContent1 = getMockFileContents(mockPath1);

    const mockPath2 = "/mock/path/2";
    const mockPathContent2 = getMockFileContents(mockPath2);

    expect(promises.readFile).not.toHaveBeenCalled();
    const fileContentArr = await Promise.all([slurpFile(mockPath1), slurpFile(mockPath2)]);
    expect(fileContentArr).toStrictEqual([mockPathContent1, mockPathContent2]);

    // There are two readFile calls as slurpFile is called in parallel with different filepaths.
    expect(promises.readFile).toHaveBeenCalledTimes(2);
    expect(promises.readFile).toHaveBeenNthCalledWith(1, mockPath1, UTF8);
    expect(promises.readFile).toHaveBeenNthCalledWith(2, mockPath2, UTF8);

    const fileContent1 = await slurpFile(mockPath1);
    expect(fileContent1).toStrictEqual(mockPathContent1);
    const fileContent2 = await slurpFile(mockPath2);
    expect(fileContent2).toStrictEqual(mockPathContent2);

    // There is one readFile call even through slurpFile is called for the third time.
    expect(promises.readFile).toHaveBeenCalledTimes(2);
  });

  it("makes multiple readFile calls when called with ignoreCache option", async () => {
    const { slurpFile } = await import("./slurpFile");

    const mockPath1 = "/mock/path/1";
    const mockPathContent1 = getMockFileContents(mockPath1);

    expect(promises.readFile).not.toHaveBeenCalled();
    const fileContentArr = await Promise.all([
      slurpFile(mockPath1, { ignoreCache: true }),
      slurpFile(mockPath1, { ignoreCache: true }),
    ]);
    expect(fileContentArr).toStrictEqual([mockPathContent1, mockPathContent1]);

    // There are two readFile calls as slurpFile is called in parallel with the same filepath.
    expect(promises.readFile).toHaveBeenCalledTimes(2);
    expect(promises.readFile).toHaveBeenNthCalledWith(1, mockPath1, UTF8);
    expect(promises.readFile).toHaveBeenNthCalledWith(2, mockPath1, UTF8);

    const fileContent1 = await slurpFile(mockPath1);
    expect(fileContent1).toStrictEqual(mockPathContent1);

    // There is no readFile call since slurpFile is now called without refresh.
    expect(promises.readFile).toHaveBeenCalledTimes(2);
  });
});
