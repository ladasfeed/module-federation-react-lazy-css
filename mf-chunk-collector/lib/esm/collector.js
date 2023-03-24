import React from "react";
import { createContext, useContext } from "react";
// METHODS
const defaultContextValue = {
    collectChunk: () => { },
};
export const ChunkCollectorContext = createContext(defaultContextValue);
export const MfLazyChunkLoaderFactory = (mfName) => ({ chunkName, fallback, children }) => {
    const context = useContext(ChunkCollectorContext);
    // also we can use https://www.npmjs.com/package/webpack-remove-code-blocks
    if (typeof window === "undefined") {
        context.collectChunk({
            type: "lazy",
            name: chunkName,
            mf: mfName,
        });
    }
    return React.createElement(React.Suspense, { fallback: fallback }, children);
};
export const MfLoader = ({ component, componentProps, mf, name, }) => {
    const context = useContext(ChunkCollectorContext);
    if (typeof window === "undefined") {
        context.collectChunk({
            type: "federation",
            name,
            mf,
        });
    }
    return React.createElement(component, {
        ...componentProps,
        contextValue: context,
    });
};
export const exposedComponent = (component) => ({ contextValue, ...componentProps }) => {
    return (React.createElement(ChunkCollectorContext.Provider, { value: contextValue || defaultContextValue }, React.createElement(component, componentProps)));
};
