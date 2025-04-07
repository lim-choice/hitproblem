import { Carousel } from "antd";

const contentStyle: React.CSSProperties = {
  height: "400px",
  color: "#fff",
  lineHeight: "400px",
  textAlign: "center",
  background: "#364d79",
  //borderRadius: 16,
};

const MainCarousel = () => (
  <Carousel autoplay dotPosition="bottom">
    <div>
      <div style={contentStyle}>배너 1: 이벤트 or 신규 문제</div>
    </div>
    <div>
      <div style={contentStyle}>배너 2: SQL 문제 모음</div>
    </div>
    <div>
      <div style={contentStyle}>배너 3: Python 연습 문제</div>
    </div>
  </Carousel>
);

export default MainCarousel;
