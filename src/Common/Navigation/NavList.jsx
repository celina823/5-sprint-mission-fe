import NavHomeImg from "../../Assets/NavHome.png";
// import loginFace from "../../Assets/loginFace.png";
import "./NavList.css";

export function NavList() {
  return (
    <div className="NavListDisplay">
      <div className="NavMenu">
        <img className="HomeImg" src={NavHomeImg} />
        <div className="NavListArticle">자유게시판</div>
        <div className="NavListMarket">중고마켓</div>
      </div>
      <button className="NavListLogin">
        로그인
        {/* <img src={loginFace} alt="로그인 유저 이미지" /> */}
      </button>
    </div>
  );
}
