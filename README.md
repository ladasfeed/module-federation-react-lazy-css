## REACT + SSR + MODULE FEDERATION + STYLES CHUNKS COLLECTING + NESTED LAZY MF CHUNKS

## Running

Run `yarn` to install the dependencies.
Run `yarn run linkAll` to link local package.
Run `yarn start` this will build and start all applications.

- [localhost:3000](http://localhost:3000/) (app1)
- [localhost:3001](http://localhost:3001/) (app2)

## Visualization 
![image](https://user-images.githubusercontent.com/57018343/227779550-a0414513-5e26-44a5-8c0f-0177f2e20fbf.png)



## HOST SERVER SIDE

Server side should be modified. Briefly:

```tsx
// WORKAROUND
// We have to use Writable to avoid cutting html.
const writeable = new Writable({
  write(chunk: any, encoding: any, callback: any) {
    res.write(chunk, encoding, callback);
  },
  final(callback) {
    callback();
  },
});

// Initialize chunk collector
// It creates cache objects and function collectChunk
// in order to gain information from react components
const chunkCollector = initChunkCollector();

const stream = renderToPipeableStream(
  // pass collectChunk to react
  // Host app and microfrontends will use that function
  // in order to collect information about used chunks
  <App collectChunk={chunkCollector.collectChunk} />,
  {
    async onAllReady() {
      // Fetch stats from different microfrontends;
      // use collected data from react to get needed chunks from the stats;
      // generate a ready-to-use string;
      const cssChunks = await chunkCollector.finish();

      res.statusCode = didError ? 500 : 200;
      res.setHeader("Content-type", "text/html");
      res.write(`
        <html>
        <head>
          ${cssChunks}
        </head>
        <body>
        <div id="root">`);

      stream.pipe(writeable).on("finish", () => {
        res.write(
          `</div><script async data-chunk="main" src="http://localhost:3000/static/main.js"></script></body></html>`
        );
        res.end();
      });
    },
  }
);
```

## HOST

Host application is wrapped in ChunkCollectorContext. It is needed to spread access to server side chunkCollector for every component in the application.

```tsx
import { ChunkCollectorContext } from "mf-chunk-collector";

// we get collectChunk from the server side!
const App = ({ collectChunk = () => {} }: any) => {
  return (
    <ChunkCollectorContext.Provider value={{ collectChunk }}>
      // any logic here
    </ChunkCollectorContext.Provider>
  );
};
```

---

Let's connect a component from remote

```tsx
import { MfLoader } from "mf-chunk-collector";

const StringFormatter = React.lazy(() => import("app2/StringFormatter"));

const App = ({ collectChunk = () => {} }: any) => {
  return (
    <ChunkCollectorContext.Provider value={{ collectChunk }}>
      <MfLoader
        component={StringFormatter}
        componentProps={{ anyPropHere }}
        mf="app2" // mf name
        name="StringFormatter" // name of exposed component
      />
      ;
    </ChunkCollectorContext.Provider>
  );
};
```

---

## REMOTE

Let's initialize exposed component on remote

```tsx
const StringFormatter: React.FC<PropsType> = ({ content = "" }) => {
  return <div className="test"></div>;
};

// exposedComponent gets a context value and provides it via local Context instance
export default exposedComponent(StringFormatter);
```

Easy!

---

Lets upgrade a component above and mount one internal lazy buddy.

```tsx
// mf.config.ts
import { MfLazyChunkLoaderFactory } from "mf-chunk-collector";

export const MfLazyChunkLoader = MfLazyChunkLoaderFactory("app2");

// StringFormatter.tsx
const UppercaseFormatter = React.lazy(
  () =>
    import(
      /* webpackChunkName: "uppercase-formatter" */ "../../modules/UppercaseFormatter"
    )
);

const StringFormatter: React.FC<PropsType> = ({ content = "" }) => {
  return (
    <div className="test">
      <MfLazyChunkLoader
        fallback="loading"
        // name should match webpackChunkName, this is only dangerous place
        name="uppercase-formatter"
      >
        <UppercaseFormatter value={content} />
      </MfLazyChunkLoader>
    </div>
  );
};

export default exposedComponent(StringFormatter);
```

You can easily connect inner lazy component for every level of nesting without any props drilling, everything is already connected inside the package (exposedComponent <--> LazyLoadedWrapper)
