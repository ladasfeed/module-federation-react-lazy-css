import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { Card } from "../../modules/Card";
// @ts-ignore
import Image from "../../image.jpg";
import "./index.css";

import { exposedComponent } from "mf-chunk-collector";
import { MfLazyChunkLoader } from "../../../mf.config";

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

  React.useEffect(() => {
    alert("StringFormatter hydrated successfully");
  }, []);

  return (
    <div className="test">
      <h2>Remote application</h2>
      <p>This component from remote application.</p>
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
        <div className="back"></div>
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
