import { MfLazyChunkLoader } from "../../../mf.config";
import { exposedComponent } from "mf-chunk-collector";
import React, { useState } from "react";
import "./styles.css";

const FormLoaderLazy = React.lazy(
  () =>
    import(
      /* webpackChunkName: "FormLoaderLazy" */ "../../modules/FormLoaderLazy"
    )
);

const AmazingForm = () => {
  const [state, setState] = useState("false");

  return (
    <div>
      <input />
      <button
        className="button"
        type="button"
        onClick={(e) => {
          e.stopPropagation();
          setState("Wow!");
        }}
      >
        Click
      </button>
      <MfLazyChunkLoader fallback="loading" chunkName="FormLoaderLazy">
        <FormLoaderLazy />
      </MfLazyChunkLoader>
      <div>{state}</div>
    </div>
  );
};

export default exposedComponent(AmazingForm);
