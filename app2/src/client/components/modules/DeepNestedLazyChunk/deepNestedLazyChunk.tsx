import React from "react";
import { HydrationIndicator } from "../../HydratedIndicator";
// @ts-ignore
import s from "./index.scss";

export default () => {
  return (
    <div className={s.container}>
      <HydrationIndicator name="Deep nested lazy chunk" />
      <h2>Hello, i am deep nested lazy chunk!</h2>
    </div>
  );
};
