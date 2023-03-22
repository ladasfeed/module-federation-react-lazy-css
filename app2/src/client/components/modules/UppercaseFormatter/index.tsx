import React from "react";
import { Card } from "../Card";
import "./index.css";

const UppercaseFormatter = ({ value = "" }: { value?: string }) => {
  React.useEffect(() => {
    alert("UppercaseFormatter hydrated successfully");
  }, []);

  return (
    <div className="uppercase-formatter-container">
      <h2>This is a lazy loaded chunk from remote application.</h2>
      <Card />
      <div>Uppercase: {value.toUpperCase()}</div>
    </div>
  );
};

export default UppercaseFormatter;
