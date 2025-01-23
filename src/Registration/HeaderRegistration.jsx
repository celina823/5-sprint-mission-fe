import pandaHomeImage from "../Assets/Group 19.png";

export function HeaderRegistration() {
  return (
    <div id="head-box">
      <div id="headContainer" class="head-box">
        <a rel="home" class="home" href="/">
          <img className="panda-home" src={pandaHomeImage} />
        </a>
        <div className="NavListArticle">자유게시판</div>
        <div className="NavListMarket">중고마켓</div>
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
