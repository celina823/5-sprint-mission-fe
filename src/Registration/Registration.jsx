import { Navigation } from "../Common/Navigation/Navigation";
import { Footer } from "../Common/Footer/Footer";
import { MainRegistration } from "./MainRegistration";

export function Registration() {
  return (
    <div className="containerAll">
      <header className="containerHeader">
        <Navigation />
      </header>
      <main className="containerMainRegistration">
        <MainRegistration />
      </main>
      <footer className="containerFooter">
        <Footer />
      </footer>
    </div>
  );
}
