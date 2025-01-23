import IconFacebook from "../Assets/Ic_facebook.png";
import IconTwitter from "../Assets/Ic_twitter.png";
import IconYoutube from "../Assets/Ic_youtube.png";
import IconInstagram from "../Assets/Ic_instagram.png";

export function FooterLanding() {
  return (
    <div class="footerBox">
      <footer class="footers">
        <div class="footer-ct">
          <div class="codeit-2024">
            <span class="foot1"> ⓒcodeit - 2024</span>
          </div>
          <div class="ppfaq">
            <a
              class="foot2"
              target="_black"
              src="./privacy/index.html"
              rel="noreferrer noopener"
            >
              Privacy Policy
            </a>
            <a
              class="foot3"
              target="_black"
              href="./faq/index.html"
              rel="noreferrer noopener"
            >
              FAQ
            </a>
          </div>
          <div class="sns-item">
            <a
              class="item-1"
              width="50%"
              href="https://www.facebook.com/"
              target="_blank"
            >
              <img class="facebook" src={IconFacebook} alt="facebook" />
            </a>
            <a class="item-2" width="50%" href="https://x.com/" target="_blank">
              <img class="facebook" src={IconTwitter} alt="twitter" />
            </a>
            <a
              class="item-3"
              width="50%"
              href="https://www.youtube.com/"
              target="_blank"
            >
              <img class="facebook" src={IconYoutube} alt="youtube" />
            </a>
            <a
              class="item-4"
              width="50%"
              href="https://www.instagram.com/"
              target="_blank"
            >
              <img class="facebook" src={IconInstagram} alt="instagram" />
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
}
