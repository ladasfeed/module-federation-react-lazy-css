import React, { useEffect, useState } from "react";
// @ts-ignore
import s from "./styles.css";

export const HydrationIndicator = ({ name }: { name?: string }) => {
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    setHydrated(true);
  }, []);

  return (
    <div className={"container"}>
      <div
        style={{
          margin: 10,
          width: 50,
          height: 50,
          backgroundColor: hydrated ? "green" : "red",
        }}
      />
      Component {name} is {hydrated ? "hydrated" : "not hydrated"}
    </div>
  );
};
