import IconFacebook from "../../Assets/Ic_facebook.png";
import IconTwitter from "../../Assets/Ic_twitter.png";
import IconYoutube from "../../Assets/Ic_youtube.png";
import IconInstagram from "../../Assets/Ic_instagram.png";

export function FooterSns() {
  return (
    <>
      <div className="FooterSnsDisplay">
        <a href="https://www.facebook.com/" target="_blank">
          <img src={IconFacebook} />
        </a>
        <a href="https://x.com/" target="_blank">
          <img src={IconTwitter} />
        </a>
        <a href="https://www.youtube.com/" target="_blank">
          <img src={IconYoutube} />
        </a>
        <a href="https://www.instagram.com/" target="_blank">
          <img src={IconInstagram} />
        </a>
      </div>
    </>
  );
}
