import axios, { AxiosResponse } from "axios";
import {
  CollectedChunkDataType,
  FederationStatsExposesType,
  StatsDataCacheType,
  RequiredRemotesType,
} from "./cssCollector.types";

const REMOTES_MAP = {
  app2: "http://localhost:3001/static",
};

export const extractFederatedModuleCssFromStats = (federationStats) => {
  const exposesAsArray = Object.entries(
    federationStats.data.federatedModules[0]
      .exposes as FederationStatsExposesType
  );
  const extractCssChunksFromExposedModule = (
    chunksObject: FederationStatsExposesType[string][0]
  ): Array<string> => {
    return Object.entries(chunksObject).reduce(
      (acc, [_innerChunkName, innerChunkChildren]) => {
        acc.push(...innerChunkChildren.filter((item) => item.includes(".css")));
        return acc;
      },
      []
    );
  };

  const federationChunksMap = exposesAsArray.reduce(
    (chunksAcc, [key, value]) => {
      const remoteComponentId = key.replace("./", "");

      chunksAcc[remoteComponentId] = extractCssChunksFromExposedModule(
        value[0]
      );

      return chunksAcc;
    },
    {} as { [key: string]: Array<string> }
  );

  return federationChunksMap;
};

export const extractLazyChunksFromStats = (
  stats: AxiosResponse<{ assetsByChunkName: { [key: string]: Array<string> } }>
) => {
  return Object.entries(stats.data.assetsByChunkName).reduce(
    (acc, [key, value]) => {
      acc[key] = value.filter((item) => item.includes(".css"));
      return acc;
    },
    {} as { [key: string]: Array<string> }
  );
};

export const fetchRemoteStats = async (
  mf: string,
  statsDataCache: StatsDataCacheType
) => {
  const [federationStats, lazyStats] = await Promise.all([
    axios.get(`${REMOTES_MAP[mf]}/federation-stats.json`),
    axios.get(`${REMOTES_MAP[mf]}/stats.json`),
  ]);

  statsDataCache[mf] = {
    federationStats: extractFederatedModuleCssFromStats(federationStats),
    lazyStats: extractLazyChunksFromStats(lazyStats),
  };
  return;
};

export const fetchStatsForRequiredRemotes = ({
  requiredRemotes,
  statsDataCache,
}: {
  requiredRemotes: RequiredRemotesType;
  statsDataCache: StatsDataCacheType;
}) => {
  const promises = requiredRemotes.map((mf) =>
    fetchRemoteStats(mf, statsDataCache)
  );
  return Promise.all(promises);
};

export const getRequiredCssChunksByCollectedData = (
  statsDataCache: StatsDataCacheType,
  mfChunks: Array<CollectedChunkDataType>
) => {
  const cssChunks = [];
  mfChunks.forEach((chunk) => {
    const statsSource =
      chunk.type == "federation" ? "federationStats" : "lazyStats";

    const chunks = statsDataCache[chunk.mf][statsSource][chunk.name].map(
      (cssChunkName) => `${REMOTES_MAP[chunk.mf]}/${cssChunkName}`
    );

    cssChunks.push(...chunks);
  });

  return cssChunks;
};

export const initChunkCollector = () => {
  let collectedChunksData = [];
  let requiredRemotes = [];
  const statsDataCache: StatsDataCacheType = {};
  const collectChunk = (chunkData: CollectedChunkDataType) => {
    collectedChunksData.push(chunkData);
    if (chunkData.type == "federation") {
      requiredRemotes.push(chunkData.mf);
    }
  };

  return {
    collectChunk,
    finish: async () => {
      try {
        await fetchStatsForRequiredRemotes({ requiredRemotes, statsDataCache });

        const cssChunks = getRequiredCssChunksByCollectedData(
          statsDataCache,
          collectedChunksData
        );

        return cssChunks
          .map((chunk) => `<link rel="stylesheet" href="${chunk}">`)
          .join("");
      } catch (e) {
        console.error(e, "Something went wrong with chunk collector...");
        return "";
      }
    },
  };
};
