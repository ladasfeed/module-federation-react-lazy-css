import path from "path";
import cors from "cors";
import render from "./server-entry";

function middleware(express, app, done) {
  app.use(cors());

  app.use("/static", express.static(path.join(process.cwd(), "dist/client")));
  app.use("/server", express.static(path.join(process.cwd(), "dist/server")));

  app.get("/*", render());

  done();
}

export default middleware;
