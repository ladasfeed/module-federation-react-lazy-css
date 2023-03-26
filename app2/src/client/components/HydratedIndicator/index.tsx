import React, { useEffect, useState } from "react";
import s from "./styles.scss";

export const HydrationIndicator = ({ name }: { name?: string }) => {
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    setHydrated(true);
  }, []);

  return (
    <div className={s.container}>
      <div className={`${s.indicator} ${hydrated ? s.hydrated : ""}`} />
      Component {name} is {hydrated ? "hydrated" : "not hydrated"}
    </div>
  );
};
