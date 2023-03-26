import React from "react";
import { HydrationIndicator } from "../../HydratedIndicator";
import { Card } from "../Card";
import "./index.scss";

const UppercaseFormatter = ({ value = "" }: { value?: string }) => {
  return (
    <div className="uppercase-formatter-container">
      <HydrationIndicator name="UppercaseFormatter" />
      <h2>This is a lazy loaded chunk from remote application.</h2>
      <Card />
      <div>Uppercase: {value.toUpperCase()}</div>
    </div>
  );
};

export default UppercaseFormatter;
