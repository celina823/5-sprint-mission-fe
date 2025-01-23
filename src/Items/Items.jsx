import { Navigation } from "../Common/Navigation/Navigation";
import { MainItems } from "./MainItems";
import { Footer } from "../Common/Footer/Footer";
import "./Items.css";

export function Items() {
  return (
    <div className="containerAll">
      <header className="containerHeader">
        <Navigation />
      </header>
      <main className="containerMainItems">
        <MainItems />
      </main>
      <footer className="containerFooter">
        <Footer />
      </footer>
    </div>
  );
}
