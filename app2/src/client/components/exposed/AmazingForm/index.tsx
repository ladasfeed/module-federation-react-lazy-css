import { MfLazyChunkLoader } from "../../../mf.config";
import { exposedComponent } from "mf-chunk-collector";
import React, { useState } from "react";
import s from "./styles.scss";
import { HydrationIndicator } from "../../HydratedIndicator";

const FormLoaderLazy = React.lazy(
  () =>
    import(
      /* webpackChunkName: "FormLoaderLazy" */ "../../modules/FormLoaderLazy"
    )
);

const AmazingForm = () => {
  const [state, setState] = useState("false");

  return (
    <div className={s.container}>
      <h2>This is another exposed component AmazingForm</h2>
      <HydrationIndicator name="AmazingForm" />
      <input />
      <button
        className={s.button}
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
