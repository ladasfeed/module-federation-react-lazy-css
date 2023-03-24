import React from "react";
import { Helmet } from "react-helmet";
import { renderToPipeableStream } from "react-dom/server";

import App from "../client/components/App";
import { Writable } from "stream";
import {
  fetchAllStats,
  getRequiredCssChunksByCollectedData,
  initChunkCollector,
} from "./lib/cssCollector";

export default async (req, res, next) => {
  const helmet = Helmet.renderStatic();
  let didError = false;

  const writeable = new Writable({
    write(chunk: any, encoding: any, callback: any) {
      res.write(chunk, encoding, callback);
    },
    final(callback) {
      callback();
    },
  });

  const chunkCollector = initChunkCollector();

  const stream = renderToPipeableStream(
    <App collectChunk={chunkCollector.collectChunk} />,
    {
      async onAllReady() {
        const cssChunks = await chunkCollector.finish();
        // const cssChunks = [];

        res.statusCode = didError ? 500 : 200;
        res.setHeader("Content-type", "text/html");
        res.write(`
        <html ${helmet.htmlAttributes.toString()}>
        <head>
          ${cssChunks}
          ${helmet.title.toString()}
          ${helmet.meta.toString()}
          ${helmet.link.toString()}
        </head>
        <body><div id="root">`);

        stream.pipe(writeable).on("finish", () => {
          res.write(
            `</div><script async data-chunk="main" src="http://localhost:3000/static/main.js"></script></body></html>`
          );
          res.end();
        });
      },
      onShellError() {
        res.statusCode = 500;
        res.send(`<h1>An error occurred</h1>`);
      },
      onError(err) {
        didError = true;
        console.error(err);
      },
    }
  );
};
