import helloPandaImage from "../Assets/Img_home_top.png";
import shoppingPandaImage from "../Assets/Frame 2608833.png";
import searchingImage from "../Assets/Img_home_02.png";
import folderImage from "../Assets/Img_home_03.png";
import TradingPandaImage from "../Assets/Img_home_bottom.png";

export function MainLanding() {
  return (
    // 줄바꿈 <br>들 css 'white-space'속성 추가로 수정해보기
    <div>
      <div class="sky-top">
        <div class="top-nemo">
          <div class="box1-text">
            <div class="box1-ht">
              일상의 모든 물건을
              <br />
              거래해 보세요
            </div>
            <a class="goo" href="./items/index.html" target="_blank">
              <button class="goo-btn">구경하러 가기</button>{" "}
            </a>
          </div>
          <img src={helloPandaImage} width="50%" alt="장바구니 든 판다" />
        </div>
      </div>
      <div class="hotItemArea">
        <div class="heart-nemo">
          <img
            src={shoppingPandaImage}
            width="50%"
            alt="쇼핑하는 판다 이미지"
          />
          <div class="box2-text">
            <div class="blue-it"> Hot item </div>
            <div class="box2-ht">
              인기 상품을
              <br /> 확인해 보세요
            </div>
            <div class="smallExplanation">
              가장 HOT한 중고거래 물품을 판다 마켓에서 확인해 보세요
            </div>
          </div>
        </div>
      </div>

      <div class="searchArea">
        <div class="search-nemo">
          <div class="box3-text">
            <div class="blue-it"> Search </div>
            <div class="box3-ht">
              구매를 원하는
              <br /> 상품을 검색하세요
            </div>
            <div class="smallExplanation">
              구매하고 싶은 물품은 검색해서 쉽게 찾아보세요
            </div>
          </div>
          <img width="50%" src={searchingImage} alt="검색하는 이미지" />
        </div>
      </div>

      <div class="registerArea">
        <div class="folder-nemo">
          <img src={folderImage} width="50%" alt="판매등록 이미지" />
          <div class="box4-text">
            <div class="blue-it"> Register </div>
            <div class="box4-ht">
              판매를 원하는
              <br /> 상품을 등록하세요
            </div>
            <div class="smallExplanation">
              어떤 물건이든 판매하고 싶은 상품을 쉽게 등록하세요
            </div>
          </div>
        </div>
      </div>

      <div class="sky-bottom">
        <div class="bottom-nemo">
          <div class="box5-text">
            믿을 수 있는
            <br /> 판다마켓 중고 거래
          </div>
          <img width="50%" src={TradingPandaImage} alt="거래하는 판다" />
        </div>
      </div>
    </div>
  );
}
