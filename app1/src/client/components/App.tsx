import React, { useEffect } from "react";
import { Helmet } from "react-helmet";
import { ChunkCollectorContext, MfChunkLoader } from "../lib";

const Content = React.lazy(
  // @ts-ignore
  () => import("app2/StringFormatter") as Promise<{ default: React.FC<any> }>
);

const App = ({ collectChunk = () => {} }: any) => {
  const [state, setState] = React.useState<string>("");
  const [isVisible, setIsVisible] = React.useState<boolean>(true);

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

        <div style={{ padding: "1rem" }}>
          <button onClick={() => setIsVisible((value) => !value)}>
            Toggle micro frontend
          </button>
        </div>

        <div style={{ padding: "1rem" }}>
          {isVisible && (
            <React.Suspense fallback={<h1>Loading....</h1>}>
              <MfChunkLoader
                mf="app2"
                type="federation"
                context={ChunkCollectorContext}
                name="StringFormatter"
              >
                <Content content={state} Context={ChunkCollectorContext} />
              </MfChunkLoader>
            </React.Suspense>
          )}
        </div>
      </div>
    </ChunkCollectorContext.Provider>
  );
};

export default App;
