import axios, { AxiosResponse } from "axios";
import {
  CollectedChunkDataType,
  FederationStatsExposesType,
  StatsDataCacheType,
  RequiredRemotesType,
  WebpackStatsStructureType,
} from "./cssCollector.types";

const REMOTES_MAP = {
  app2: "http://localhost:3001/static",
};

/**
  Gets federationStats file structure
  Transform it into usable shape >>
  {
    'Header': ['header.25wj213k12hk.css'],
    'Footer': ['footer.g23dgs3fas1.css'],
  }
 */
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
        // i do not have an idea why it is an array, like there could be several micro-frontend instances
        value[0]
      );

      return chunksAcc;
    },
    {} as { [key: string]: Array<string> }
  );

  return federationChunksMap;
};

/**
  Gets stats.json as param
  Transform it into usable shape >>
  {
    'LazyLoadedChunk1': ['lazy1.25wj213k12hk.css'],
    'LazyLoadedChunk2': ['lazy2.25wj213k12hk.css'],
  }
 */
export const extractLazyChunksFromStats = (
  stats: AxiosResponse<WebpackStatsStructureType>
) => {
  return Object.entries(stats.data.assetsByChunkName).reduce(
    (acc, [key, value]) => {
      acc[key] = value.filter((item) => item.includes(".css"));
      return acc;
    },
    {} as { [key: string]: Array<string> }
  );
};

/**
  Fetch federation-stats.json and stats.json
  Transform them them into usable shape
 */
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

/**
  Fetch federation-stats.json and stats.json for every remote listed in the first argument
  Save data to the second argument statsDataCache
 */
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

/**
  Gets all needed css chunks from statsDataCache 
  using manually collected chunks from the JSX
  @param statsDataCache cache to store data
  @param mfChunks data about mfs and lazy loaded chunks
 */
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

  const finish = async () => {
    try {
      // load and store stats
      await fetchStatsForRequiredRemotes({ requiredRemotes, statsDataCache });

      // extract css from stats by collected chunks data
      const cssChunks = getRequiredCssChunksByCollectedData(
        statsDataCache,
        collectedChunksData
      );

      // make a final string
      return cssChunks
        .map((chunk) => `<link rel="stylesheet" href="${chunk}">`)
        .join("");
    } catch (e) {
      console.error(e, "Something went wrong with chunk collector...");
      return "";
    }
  };

  return {
    collectChunk,
    finish,
  };
};
