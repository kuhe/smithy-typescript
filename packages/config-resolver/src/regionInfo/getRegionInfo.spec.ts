import { afterEach, beforeEach, describe, expect, test as it, vi } from "vitest";

import { getHostnameFromVariants } from "./getHostnameFromVariants";
import { getRegionInfo } from "./getRegionInfo";
import { getResolvedHostname } from "./getResolvedHostname";
import { getResolvedPartition } from "./getResolvedPartition";
import { getResolvedSigningRegion } from "./getResolvedSigningRegion";
import { PartitionHash } from "./PartitionHash";
import { RegionHash } from "./RegionHash";

vi.mock("./getHostnameFromVariants");
vi.mock("./getResolvedHostname");
vi.mock("./getResolvedPartition");
vi.mock("./getResolvedSigningRegion");

describe(getRegionInfo.name, () => {
  const mockPartition = "mockPartition";
  const mockSigningService = "mockSigningService";

  const mockRegion = "mockRegion";
  const mockRegionRegex = "mockRegionRegex";
  const mockHostname = "{region}.mockHostname.com";
  const mockEndpointRegion = "mockEndpointRegion";
  const mockEndpointHostname = "{region}.mockEndpointHostname.com";

  enum RegionCase {
    REGION = "Region",
    ENDPOINT = "Endpoint",
    REGION_AND_ENDPOINT = "Region and Endpoint",
  }

  const getMockRegionHash = (regionCase: RegionCase): RegionHash => ({
    ...((regionCase === RegionCase.REGION || regionCase === RegionCase.REGION_AND_ENDPOINT) && {
      [mockRegion]: {
        variants: [{ hostname: mockHostname, tags: [] }],
      },
    }),
    ...((regionCase === RegionCase.ENDPOINT || regionCase === RegionCase.REGION_AND_ENDPOINT) && {
      [mockEndpointRegion]: {
        variants: [{ hostname: mockEndpointHostname, tags: [] }],
      },
    }),
  });

  const getMockPartitionHash = (regionCase: RegionCase): PartitionHash => ({
    [mockPartition]: {
      regions: [mockRegion, `${mockRegion}2`, `${mockRegion}3`],
      regionRegex: mockRegionRegex,
      variants: [{ hostname: mockHostname, tags: [] }],
      ...((regionCase === RegionCase.ENDPOINT || regionCase === RegionCase.REGION_AND_ENDPOINT) && {
        endpoint: mockEndpointRegion,
      }),
    },
  });

  const getMockResolvedRegion = (regionCase: RegionCase): string =>
    regionCase !== RegionCase.ENDPOINT ? mockRegion : mockEndpointRegion;

  const getMockResolvedPartitionOptions = (partitionHash: PartitionHash) => ({ partitionHash });

  const getMockRegionInfoOptions = (regionHash: RegionHash, getResolvedPartitionOptions: any) => ({
    ...getResolvedPartitionOptions,
    signingService: mockSigningService,
    regionHash,
  });

  beforeEach(() => {
    vi.mocked(getHostnameFromVariants).mockReturnValue(mockHostname);
    vi.mocked(getResolvedHostname).mockReturnValue(mockHostname);
    vi.mocked(getResolvedPartition).mockReturnValue(mockPartition);
    vi.mocked(getResolvedSigningRegion).mockReturnValue(undefined);
  });

  afterEach(() => {
    expect(getHostnameFromVariants).toHaveBeenCalledTimes(2);
    expect(getResolvedHostname).toHaveBeenCalledTimes(1);
    expect(getResolvedPartition).toHaveBeenCalledTimes(1);
    vi.clearAllMocks();
  });

  describe("returns data based on options passed", () => {
    it.each(Object.values(RegionCase))("%s", (regionCase) => {
      const mockRegionHash = getMockRegionHash(regionCase);
      const mockPartitionHash = getMockPartitionHash(regionCase);

      const mockGetResolvedPartitionOptions = getMockResolvedPartitionOptions(mockPartitionHash);
      const mockGetRegionInfoOptions = getMockRegionInfoOptions(mockRegionHash, mockGetResolvedPartitionOptions);

      const mockResolvedRegion = getMockResolvedRegion(regionCase);
      const mockRegionHostname = mockGetRegionInfoOptions.regionHash[mockResolvedRegion]?.hostname;
      const mockPartitionHostname = mockGetRegionInfoOptions.partitionHash[mockPartition]?.hostname;

      vi.mocked(getHostnameFromVariants).mockReturnValueOnce(mockRegionHostname);
      vi.mocked(getHostnameFromVariants).mockReturnValueOnce(mockPartitionHostname);

      expect(getRegionInfo(mockRegion, mockGetRegionInfoOptions)).toEqual({
        signingService: mockSigningService,
        hostname: mockHostname,
        partition: mockPartition,
      });

      expect(getResolvedHostname).toHaveBeenCalledWith(mockResolvedRegion, {
        regionHostname: mockRegionHostname,
        partitionHostname: mockPartitionHostname,
      });
      expect(getResolvedPartition).toHaveBeenCalledWith(mockRegion, mockGetResolvedPartitionOptions);
      expect(getResolvedSigningRegion).toHaveBeenCalledWith(mockHostname, {
        regionRegex: mockRegionRegex,
        useFipsEndpoint: false,
      });
    });
  });

  describe("returns signingRegion if resolved by getResolvedSigningRegion", () => {
    const getMockRegionHashWithSigningRegion = (
      regionCase: RegionCase,
      mockRegionHash: RegionHash,
      mockSigningRegion: string
    ): RegionHash => ({
      ...mockRegionHash,
      ...((regionCase === RegionCase.REGION || regionCase === RegionCase.REGION_AND_ENDPOINT) && {
        [mockRegion]: {
          ...mockRegionHash[mockRegion],
          signingRegion: mockSigningRegion,
        },
      }),
      ...((regionCase === RegionCase.ENDPOINT || regionCase === RegionCase.REGION_AND_ENDPOINT) && {
        [mockEndpointRegion]: {
          ...mockRegionHash[mockEndpointRegion],
          signingRegion: mockSigningRegion,
        },
      }),
    });

    it.each(Object.values(RegionCase))("%s", (regionCase) => {
      const mockSigningRegion = "mockSigningRegion";
      vi.mocked(getResolvedSigningRegion).mockReturnValueOnce(mockSigningRegion);
      const mockRegionHash = getMockRegionHash(regionCase);
      const mockPartitionHash = getMockPartitionHash(regionCase);

      const mockGetResolvedPartitionOptions = getMockResolvedPartitionOptions(mockPartitionHash);
      const mockGetRegionInfoOptions = getMockRegionInfoOptions(mockRegionHash, mockGetResolvedPartitionOptions);

      const mockResolvedRegion = getMockResolvedRegion(regionCase);
      const mockRegionHostname = mockGetRegionInfoOptions.regionHash[mockResolvedRegion]?.hostname;
      const mockPartitionHostname = mockGetRegionInfoOptions.partitionHash[mockPartition]?.hostname;

      vi.mocked(getHostnameFromVariants).mockReturnValueOnce(mockRegionHostname);
      vi.mocked(getHostnameFromVariants).mockReturnValueOnce(mockPartitionHostname);

      const mockRegionHashWithSigningRegion = getMockRegionHashWithSigningRegion(
        regionCase,
        mockRegionHash,
        mockSigningRegion
      );

      expect(
        getRegionInfo(mockRegion, { ...mockGetRegionInfoOptions, regionHash: mockRegionHashWithSigningRegion })
      ).toEqual({
        signingService: mockSigningService,
        hostname: mockHostname,
        partition: mockPartition,
        signingRegion: mockSigningRegion,
      });

      expect(getResolvedHostname).toHaveBeenCalledWith(mockResolvedRegion, {
        regionHostname: mockRegionHostname,
        partitionHostname: mockPartitionHostname,
      });
      expect(getResolvedPartition).toHaveBeenCalledWith(mockRegion, mockGetResolvedPartitionOptions);
      expect(getResolvedSigningRegion).toHaveBeenCalledWith(mockHostname, {
        signingRegion: mockSigningRegion,
        regionRegex: mockRegionRegex,
        useFipsEndpoint: false,
      });
    });
  });

  describe("returns signingService if present in regionHash", () => {
    const getMockRegionHashWithSigningService = (
      regionCase: RegionCase,
      mockRegionHash: RegionHash,
      mockSigningService: string
    ): RegionHash => ({
      ...mockRegionHash,
      ...((regionCase === RegionCase.REGION || regionCase === RegionCase.REGION_AND_ENDPOINT) && {
        [mockRegion]: {
          ...mockRegionHash[mockRegion],
          signingService: mockSigningService,
        },
      }),
      ...((regionCase === RegionCase.ENDPOINT || regionCase === RegionCase.REGION_AND_ENDPOINT) && {
        [mockEndpointRegion]: {
          ...mockRegionHash[mockEndpointRegion],
          signingService: mockSigningService,
        },
      }),
    });

    it.each(Object.values(RegionCase))("%s", (regionCase) => {
      const mockSigningServiceInRegionHash = "mockSigningServiceInRegionHash";
      const mockRegionHash = getMockRegionHash(regionCase);
      const mockPartitionHash = getMockPartitionHash(regionCase);

      const mockGetResolvedPartitionOptions = getMockResolvedPartitionOptions(mockPartitionHash);
      const mockGetRegionInfoOptions = getMockRegionInfoOptions(mockRegionHash, mockGetResolvedPartitionOptions);

      const mockResolvedRegion = getMockResolvedRegion(regionCase);
      const mockRegionHostname = mockGetRegionInfoOptions.regionHash[mockResolvedRegion]?.hostname;
      const mockPartitionHostname = mockGetRegionInfoOptions.partitionHash[mockPartition]?.hostname;

      vi.mocked(getHostnameFromVariants).mockReturnValueOnce(mockRegionHostname);
      vi.mocked(getHostnameFromVariants).mockReturnValueOnce(mockPartitionHostname);

      const mockRegionHashWithSigningRegion = getMockRegionHashWithSigningService(
        regionCase,
        mockRegionHash,
        mockSigningServiceInRegionHash
      );

      expect(
        getRegionInfo(mockRegion, { ...mockGetRegionInfoOptions, regionHash: mockRegionHashWithSigningRegion })
      ).toEqual({
        signingService: mockSigningServiceInRegionHash,
        hostname: mockHostname,
        partition: mockPartition,
      });

      expect(getResolvedHostname).toHaveBeenCalledWith(mockResolvedRegion, {
        regionHostname: mockRegionHostname,
        partitionHostname: mockPartitionHostname,
      });
      expect(getResolvedPartition).toHaveBeenCalledWith(mockRegion, mockGetResolvedPartitionOptions);
      expect(getResolvedSigningRegion).toHaveBeenCalledWith(mockHostname, {
        regionRegex: mockRegionRegex,
        useFipsEndpoint: false,
      });
    });
  });

  it("throws error if hostname is not defined", () => {
    vi.mocked(getResolvedHostname).mockReturnValueOnce(undefined);
    const mockRegionHash = getMockRegionHash(RegionCase.REGION);
    const mockPartitionHash = getMockPartitionHash(RegionCase.REGION);
    expect(() => {
      getRegionInfo(mockRegion, {
        signingService: mockSigningService,
        regionHash: mockRegionHash,
        partitionHash: mockPartitionHash,
      });
    }).toThrow();
  });
});
