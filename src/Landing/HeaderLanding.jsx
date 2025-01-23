import pandaHomeImage from "../Assets/NavHome.png";

export function HeaderLanding() {
  return (
    <div id="head-box">
      <div id="headContainer" class="head-box">
        <a rel="home" class="home" href="/">
          <img className="panda-home" src={pandaHomeImage} />
        </a>
        <a href="./login/login.html" target="_self">
          <button
            class="login-btn"
            onclick="location.href='./login/login.html'"
          >
            로그인
          </button>
        </a>
      </div>
    </div>
  );
}
