import { MfLoader } from "mf-chunk-collector";
import React from "react";

const StringFormatter = React.lazy(
  // @ts-ignore
  () => import("app2/StringFormatter") as Promise<{ default: React.FC<any> }>
);

export const DeepNestedMF = ({ content }) => {
  const [isVisible, setIsVisible] = React.useState<boolean>(true);

  return (
    <div>
      <div style={{ padding: "1rem" }}>
        <button onClick={() => setIsVisible((value) => !value)}>
          Toggle micro frontend
        </button>
      </div>
      <br />
      Deep nested mf:
      <div>
        {isVisible && (
          <MfLoader
            component={StringFormatter}
            componentProps={{ content }}
            mf="app2"
            name="StringFormatter"
          />
        )}
      </div>
    </div>
  );
};
