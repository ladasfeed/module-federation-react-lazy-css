import React, { useEffect } from "react";
import { Helmet } from "react-helmet";
import { ChunkCollectorContext, MfLoader } from "mf-chunk-collector";
import { DeepNestedMF } from "./deepNestedMf";

const AmazingForm = React.lazy(
  // @ts-ignore
  () => import("app2/AmazingForm") as Promise<{ default: React.FC<any> }>
);

const App = ({ collectChunk = () => {} }: any) => {
  const [state, setState] = React.useState<string>("");

  useEffect(() => {
    alert("hydrated app1");
  }, []);

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

        <div style={{ padding: "1rem" }}>
          <h1>Module Federation Example: React 18 Code Splitting</h1>

          <h2>This is the App 1 application.</h2>
        </div>

        <div style={{ padding: "1rem" }}>
          <h3>Type something into this input</h3>
          <input
            type="text"
            value={state}
            onChange={(e) => setState(e.target.value)}
            placeholder="Luke, I am your father..."
          />
        </div>

        <DeepNestedMF content={state} />
        <div style={{ padding: "1rem" }}>
          {/* <React.Suspense fallback={<h1>Loading....</h1>}> */}
          <MfLoader
            mf="app2"
            component={AmazingForm}
            componentProps={{ content: state }}
            name="AmazingForm"
          />
          {/* </React.Suspense> */}
        </div>
      </div>
    </ChunkCollectorContext.Provider>
  );
};

export default App;
