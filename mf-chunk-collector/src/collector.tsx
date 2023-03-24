import React, { ReactElement } from "react";
import { createContext, ReactNode, useContext } from "react";

// TYPES
export type ChunkType = "federation" | "lazy";

export type CollectedChunkType = {
  type: ChunkType;
  name: string;
  mf?: string;
};

export type ContextType = {
  collectChunk: (chunk: CollectedChunkType) => void;
};

export type MfChunkLoaderPropsType = {
  children: ReactNode;
  chunkName: string;
  fallback?: ReactNode;
};

export type MfLoaderPropsType<T extends React.FC> = {
  mf: string;
  name: string;
  component: T;
  componentProps: Parameters<T>[0];
  fallback?: React.ReactNode;
};

// METHODS
const defaultContextValue = {
  collectChunk: () => {},
};

export const ChunkCollectorContext =
  createContext<ContextType>(defaultContextValue);

export const MfLazyChunkLoaderFactory =
  (mfName: string) =>
  ({ chunkName, fallback, children }: MfChunkLoaderPropsType) => {
    const context = useContext(ChunkCollectorContext);
    // also we can use https://www.npmjs.com/package/webpack-remove-code-blocks
    if (typeof window === "undefined") {
      context.collectChunk({
        type: "lazy",
        name: chunkName,
        mf: mfName,
      });
    }

    return <React.Suspense fallback={fallback}>{children}</React.Suspense>;
  };

export const MfLoader = <T extends React.FC>({
  component,
  componentProps,
  mf,
  name,
  fallback,
}: MfLoaderPropsType<T>) => {
  const context = useContext(ChunkCollectorContext);
  if (typeof window === "undefined") {
    context.collectChunk({
      type: "federation",
      name,
      mf,
    });
  }

  return (
    <React.Suspense fallback={fallback}>
      {React.createElement(component, {
        ...componentProps,
        contextValue: context,
      })}
    </React.Suspense>
  );
};

export const exposedComponent =
  <T extends React.FC>(component: T) =>
  ({
    contextValue,
    ...componentProps
  }: Parameters<T>[0] & { contextValue?: ContextType }) => {
    return (
      <ChunkCollectorContext.Provider
        value={contextValue || defaultContextValue}
      >
        {React.createElement(component, componentProps)}
      </ChunkCollectorContext.Provider>
    );
  };
