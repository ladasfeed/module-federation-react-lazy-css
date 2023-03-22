export type FederationStatsExposesType = {
  [key: string]: Array<{
    [key: string]: Array<string>;
  }>;
};

export type RequiredRemotesType = Array<string>;

export type CollectedChunkDataType = {
  type: "federation" | "lazy";
  name: string;
  mf?: string;
};

export type StatsDataCacheType = {
  [key: string]: {
    federationStats: {
      [key: string]: Array<string>;
    };
    lazyStats: {
      [key: string]: Array<string>;
    };
  };
};
