import React, { useState, useEffect } from "react";
import "../../scss/components/bannerSlider.scss";

const BannerSlider = () => {
  const ImageSlides = [
    {
      Banner_url: "https://cdn.myanimelist.net/images/anime/1208/94745l.webp",
      title: "Fullmetal Alchemist: Brotherhood",
      subtitle: "Fullmetal Alchemist: Brotherhood",
    },
    {
      Banner_url: "https://cdn.myanimelist.net/images/anime/1015/138006l.webp",
      title: "Sousou no Frieren",
      subtitle: "Frieren The Slayer",
    },
    {
      Banner_url: "https://img.youtube.com/vi/hKHepjfj5Tw/maxresdefault.jpg",
      title: "Shingeki no Kyojin Season 3 Part 2",
      subtitle: "Attack on Titan Season 3 Part 2",
    },
    {
      Banner_url: "https://cdn.myanimelist.net/images/anime/3/72078l.webp",
      title: "Gintama",
      subtitle: "Gintama Season 4",
    },
    {
      Banner_url: "https://cdn.myanimelist.net/images/anime/1245/116760l.webp",
      title: "Gintama: The Final",
      subtitle: "Gintama: The Very Final",
    },
  ];

  const [imageSlides, setImageSlides] = useState([]);
  const [activeIndex, setActiveIndex] = useState(0);

  // Set slides on component mount
  useEffect(() => {
     setImageSlides(ImageSlides);
   const interval = setInterval(() => {
      setActiveIndex((prevIndex) =>
        prevIndex === ImageSlides.length - 1 ? 0 : prevIndex + 1
      );
    }, 3000);
    return ()=> clearInterval(interval)
  }, []);
  
  

  const Slider = ({ slides, activeIndex }) => {
    return (
      <>
        {slides.map((item, idx) => (
          <div
            key={idx}
            className={`banner-container ${idx === activeIndex ? "active" : "inactive"}`}
            style={{
              backgroundImage: `url(${item.Banner_url})`,
            }}
          >
           <div className="overlay"></div>
            <div className="description-container">
              <div className="description-wrapper">
                <label>{item.title}</label>
                <label>{item.subtitle}</label> {/* Fixed property name */}
              </div>
              <button className="watch-Btn">Watch Now</button>
            </div>
            
          </div>
        ))}
      </>
    );
  };

  const Dots = ({ slides, activeIndex, onClick }) => {
    return (
      <div className="dots-container">
        {slides.map((__, idx) => (
          <span
            key={idx}
            className={`dot ${activeIndex === idx ? "active-dot" : ""}`}
            onClick={() => onClick(idx)}
          ></span>
        ))}
      </div>
    );
  };

  return (
    <section data-component="bannerSlider">
      <Slider activeIndex={activeIndex} slides={imageSlides} />
      <Dots
        activeIndex={activeIndex}
        slides={imageSlides}
        onClick={(e) => setActiveIndex(e)}
      />
    </section>
  );
};

export default BannerSlider;