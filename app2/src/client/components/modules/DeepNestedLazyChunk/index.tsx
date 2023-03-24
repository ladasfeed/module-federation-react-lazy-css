import { MfLazyChunkLoader } from "../../../mf.config";
import React from "react";

const DeepNestedLazyChunk = React.lazy(
  () =>
    import(
      /* webpackChunkName: "deepNestedLazyChunk" */ "./deepNestedLazyChunk"
    )
);
export const DeepNestedLazyChunkWrapper2 = ({ children }) => {
  return <div>{children}</div>;
};

export const DeepNestedLazyChunkWrapper1 = () => {
  return (
    <DeepNestedLazyChunkWrapper2>
      <MfLazyChunkLoader fallback="loading" chunkName="deepNestedLazyChunk">
        <DeepNestedLazyChunk />
      </MfLazyChunkLoader>
    </DeepNestedLazyChunkWrapper2>
  );
};
