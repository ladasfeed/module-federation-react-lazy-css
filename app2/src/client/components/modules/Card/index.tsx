import React from "react";
// @ts-ignore
import RayBanIcon from "./rayBan.svg";
// @ts-ignore
import s from "./index.scss";

export const Card = () => {
  return (
    <div className={s.container}>
      This is a simple UI component from remote app
      <RayBanIcon />
    </div>
  );
};
