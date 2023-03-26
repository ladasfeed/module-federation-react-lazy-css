import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { Card } from "../../modules/Card";
// @ts-ignore
import Image from "../../image.jpg";
import s from "./index.scss";

import { exposedComponent } from "mf-chunk-collector";
import { MfLazyChunkLoader } from "../../../mf.config";
import { HydrationIndicator } from "../../HydratedIndicator";

const UppercaseFormatter = React.lazy(
  () =>
    import(
      /* webpackChunkName: "UppercaseFormatter" */ "../../modules/UppercaseFormatter"
    )
);

export interface PropsType {
  content?: string;
}

const StringFormatter: React.FC<PropsType> = ({ content = "" }) => {
  const data = useForm();
  const [state, setState] = useState(true);

  return (
    <div className={s.container}>
      <h2>StringFormatter</h2>
      <HydrationIndicator name="StringFormatter" />
      <p>
        Censored content: <strong>{content.replace("fuck", "")}</strong>
      </p>
      <button onClick={() => setState(!state)}>
        Load Uppercase formatter! Now it is {state ? "visible" : "not visible"}
      </button>

      <br />
      <br />
      <div>
        This is a background image
        <div className={s.back}></div>
      </div>
      <div>
        This is an image in tag <br />
        <br />
        <img
          style={{ objectFit: "cover" }}
          width={100}
          height={100}
          src={Image}
        />
      </div>

      <Card />
      {state && (
        <MfLazyChunkLoader fallback="loading" chunkName="UppercaseFormatter">
          <UppercaseFormatter value={content} />
        </MfLazyChunkLoader>
      )}
    </div>
  );
};

export default exposedComponent(StringFormatter);
