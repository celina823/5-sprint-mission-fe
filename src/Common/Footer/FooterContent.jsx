import { FooterSns } from "./FooterSns";
import "./Footer.css";

export function FooterContent() {
  return (
    <div className="FooterContent">
      <a className="foot1">©codeit - 2024</a>
      <div className="foot2and3">
        <div className="foot2">Privacy Policy</div>
        <div className="foot3">FAQ</div>
      </div>
      <FooterSns />
    </div>
  );
}
