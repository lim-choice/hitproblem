import { Carousel } from "antd";
import { motion } from "framer-motion";
import React, { useRef, useState } from "react";

const slideContents = [
  {
    title: "문제를 풀어보자",
    subtitle: "문제가 이것밖에 없나? 졸려도 문제 풀어보자",
    button: "문제 풀러 가기",
    background: "#3b3b52",
    buttonStyle: {},
  },
  {
    title: "문제 통계 확인해보자",
    subtitle: "시험 본 문제 내용들 확인 ㄱㄱ?",
    button: "통계 확인하기",
    background: "#fcb8b7",
    buttonStyle: { background: "black" },
  },
];

const BannerSlide = ({
  active,
  title,
  subtitle,
  buttonText,
  background,
  buttonStyle,
}: any) => (
  <div
    style={{
      height: 400,
      background: background,
      color: "#fff",
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
    }}
  >
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={active ? { opacity: 1, y: 0 } : { opacity: 0 }}
      transition={{ duration: 0.6 }}
      style={{ textAlign: "center" }}
    >
      <h1 style={{ fontSize: "36px", marginBottom: 12 }}>{title}</h1>
      <p style={{ fontSize: "18px", opacity: 0.8 }}>{subtitle}</p>
      {buttonText && (
        <motion.button
          whileHover={{ scale: 1.1 }}
          style={{
            marginTop: 20,
            padding: "10px 24px",
            background: "#4a90e2",
            border: "none",
            borderRadius: 8,
            color: "#fff",
            fontSize: 16,
            cursor: "pointer",
            ...buttonStyle,
          }}
        >
          {buttonText}
        </motion.button>
      )}
    </motion.div>
  </div>
);

const MainCarousel = () => {
  const [activeSlide, setActiveSlide] = useState(0);
  const carouselRef = useRef<any>(null);

  const goToNext = () => {
    if (carouselRef.current) {
      carouselRef.current.next();
    }
  };

  const goToPrev = () => {
    if (carouselRef.current) {
      carouselRef.current.prev();
    }
  };

  return (
    <div style={{ position: "relative" }}>
      {/* Carousel 본체 */}
      <Carousel
        ref={carouselRef}
        autoplay
        afterChange={(index) => setActiveSlide(index)}
        dots={false}
      >
        {slideContents.map((item, index) => (
          <BannerSlide
            key={index}
            active={index === activeSlide}
            title={item.title}
            subtitle={item.subtitle}
            buttonText={item.button}
            buttonStyle={item.buttonStyle}
            background={item.background}
          />
        ))}
      </Carousel>

      {/* 현재 페이지 표시 */}
      <div
        style={{
          position: "absolute",
          bottom: 16,
          right: 80,
          background: "rgba(0,0,0,0.5)",
          padding: "6px 12px",
          borderRadius: 8,
          color: "#fff",
          fontSize: 14,
        }}
      >
        {activeSlide + 1} / {slideContents.length}
      </div>

      {/* < > 버튼 */}
      <button
        onClick={goToPrev}
        style={{
          position: "absolute",
          top: "50%",
          left: 16,
          transform: "translateY(-50%)",
          background: "rgba(0,0,0,0.4)",
          color: "#fff",
          border: "none",
          padding: "8px 12px",
          borderRadius: "50%",
          fontSize: 18,
          cursor: "pointer",
        }}
      >
        ‹
      </button>
      <button
        onClick={goToNext}
        style={{
          position: "absolute",
          top: "50%",
          right: 16,
          transform: "translateY(-50%)",
          background: "rgba(0,0,0,0.4)",
          color: "#fff",
          border: "none",
          padding: "8px 12px",
          borderRadius: "50%",
          fontSize: 18,
          cursor: "pointer",
        }}
      >
        ›
      </button>
    </div>
  );
};

export default MainCarousel;
