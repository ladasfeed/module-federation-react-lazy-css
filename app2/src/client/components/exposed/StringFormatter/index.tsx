import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { MfChunkLoader } from "../../lib";
import { Card } from "../../modules/Card";
import "./index.css";

const UppercaseFormatter = React.lazy(
  () =>
    import(
      /* webpackChunkName: "uppercase-formatter" */ "../../modules/UppercaseFormatter"
    )
);

console.log(UppercaseFormatter, "UppercaseFormatter");

export interface PropsType {
  content?: string;
  Context?: React.Context<any>;
}

const StringFormatter: React.FC<PropsType> = ({ Context, content = "" }) => {
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

      <Card />
      <React.Suspense fallback="loading">
        {state && (
          <MfChunkLoader
            type="lazy"
            mf={"app2"}
            name="uppercase-formatter"
            context={Context}
          >
            <UppercaseFormatter value={content} />
          </MfChunkLoader>
        )}
      </React.Suspense>
    </div>
  );
};

export default StringFormatter;
