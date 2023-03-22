import { createContext, useContext } from "react";
import type {
  ChunkType,
  ContextType,
  MfChunkLoaderPropsType,
} from "../../../app2/src/client/components/lib";

// lib
const MfContextGenerator = () => {
  return createContext<ContextType>({
    collectChunk: () => {},
  });
};
export const MfChunkLoader = <T extends ChunkType>(
  props: MfChunkLoaderPropsType<T>
) => {
  const context = useContext(props.context);
  if (typeof window === "undefined") {
    context.collectChunk({
      type: props.type,
      name: props.name,
      mf: props.mf,
    });
  }

  return props.children as React.ReactElement<any, any>;
};

// local
export const ChunkCollectorContext = MfContextGenerator();
