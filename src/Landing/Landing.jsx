import React from "react";
import { HeaderLanding } from "./HeaderLanding";
import { MainLanding } from "./MainLanding";
import { FooterLanding } from "./FooterLanding";
import "./Landing.css";

export function Landing() {
  return (
    <div>
      <HeaderLanding />
      <MainLanding />
      <FooterLanding />
    </div>
  );
}
