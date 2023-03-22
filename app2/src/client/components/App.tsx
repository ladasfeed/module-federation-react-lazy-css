import React, { createContext } from "react";
import { Helmet } from "react-helmet";

const StringFormatter = React.lazy(() => import("./exposed/StringFormatter"));

const Context = createContext({
  collectChunks: () => {},
});
const App = () => {
  const [state, setState] = React.useState<string>("");
  const [isVisible, setIsVisible] = React.useState<boolean>(true);

  return (
    <Context.Provider value={{ collectChunks: () => {} }}>
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

          <h2>This is the App 2 application.</h2>
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
            Toggle Content
          </button>
        </div>

        <div style={{ padding: "1rem" }}>
          {isVisible && (
            <React.Suspense fallback={<h1>Loading....</h1>}>
              <StringFormatter content={state} Context={Context as any} />
            </React.Suspense>
          )}
        </div>
      </div>
    </Context.Provider>
  );
};

export default App;
