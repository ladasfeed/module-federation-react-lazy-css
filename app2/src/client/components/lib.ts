import { createContext, ReactNode, useContext } from "react";

// lib
export type ChunkType = "federation" | "lazy";

export type CollectedChunkType = {
  type: ChunkType;
  name: string;
  mf?: string;
};

export type MfChunkLoaderPropsType<T extends ChunkType> = {
  children: ReactNode;
  name: string;
  context: React.Context<ContextType>;
  type: T;
} & (T extends "federation" ? { mf: string } : { mf?: string });

export type ContextType = {
  collectChunk: (chunk: CollectedChunkType) => void;
};

export const MfContextGenerator = () => {
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
