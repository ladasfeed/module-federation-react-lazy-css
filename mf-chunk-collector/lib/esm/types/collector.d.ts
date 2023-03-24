import React from "react";
import { ReactNode } from "react";
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
};
export declare const ChunkCollectorContext: React.Context<ContextType>;
export declare const MfLazyChunkLoaderFactory: (mfName: string) => ({ chunkName, fallback, children }: MfChunkLoaderPropsType) => JSX.Element;
export declare const MfLoader: <T extends React.FC<{}>>({ component, componentProps, mf, name, }: MfLoaderPropsType<T>) => React.FunctionComponentElement<{}>;
export declare const exposedComponent: <T extends React.FC<{}>>(component: T) => ({ contextValue, ...componentProps }: Parameters<T>[0] & {
    contextValue?: ContextType | undefined;
}) => JSX.Element;
//# sourceMappingURL=collector.d.ts.map