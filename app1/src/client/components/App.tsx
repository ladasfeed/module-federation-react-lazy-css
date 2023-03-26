import React, { useEffect } from "react";
import { Helmet } from "react-helmet";
import { ChunkCollectorContext, MfLoader } from "mf-chunk-collector";
import { DeepNestedMF } from "./deepNestedMf";
import { HydrationIndicator } from "./HydratedIndicator";

const AmazingForm = React.lazy(
  // @ts-ignore
  () => import("app2/AmazingForm") as Promise<{ default: React.FC<any> }>
);

const App = ({ collectChunk = () => {} }: any) => {
  const [state, setState] = React.useState<string>("");
  const [isVisible, setIsVisible] = React.useState(false);

  return (
    <ChunkCollectorContext.Provider value={{ collectChunk }}>
      <div
        style={{
          padding: "1rem",
          borderRadius: "0.25rem",
          border: "4px dashed #fc451e",
        }}
      >
        <Helmet>
          <title>SSR MF Example</title>
        </Helmet>

        <div>
          <h1>Host application</h1>
        </div>
        <HydrationIndicator name="Host application" />

        <div style={{ padding: "1rem" }}>
          <h3>Type something into this input</h3>
          <input
            type="text"
            value={state}
            onChange={(e) => setState(e.target.value)}
            placeholder="..."
          />
        </div>

        <DeepNestedMF content={state} />
        <button onClick={() => setIsVisible(!isVisible)}>
          Toggle visibility
        </button>
        <div style={{ padding: "1rem" }}>
          {isVisible && (
            <MfLoader
              // @ts-ignore
              fallback="Loading"
              mf="app2"
              component={AmazingForm}
              componentProps={{ content: state }}
              name="AmazingForm"
            />
          )}
        </div>
      </div>
    </ChunkCollectorContext.Provider>
  );
};

export default App;
