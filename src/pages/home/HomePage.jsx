import React, { useRef, useState, useEffect } from "react";
import Header from "../../components/header/Header";
import BannerSlider from "../../components/slider/BannerSlider";
import "../../scss/pages/homePage.scss";
import DropDown from "../../components/dropDown/DropDown";
import AnimeCard from "../../components/cards/AnimeCard";
import { useNavigate } from "react-router-dom";
import useFetch from "../../hooks/useFetchData";

const HomePage = () => {
  const [page, setPage] = useState(1);
  const [selectedValue, setSelectedValue] = useState("");
  const navigate = useNavigate();
  const loadingRef = useRef();
  console.log("HomePage",selectedValue)

  // useFetch handles pagination, rate limiting, duplicates
  const { data: animeData, loading, error, hasNextPage } = useFetch(
    "https://api.jikan.moe/v4/top/anime",
    { page, autoPaginate: true, uniqueById: true },
    []
  );

  const arr = ["TV", "Movie", "ONA", "OVA"];
  const arr2 = ["Genre", "Movie", "ONA", "OVA"];
  const arr3 = ["Year", "Movie", "ONA", "OVA"];

  // Intersection Observer for infinite scroll
  useEffect(() => {
    if (!loadingRef.current) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && hasNextPage && !loading) {
          setPage((prev) => prev + 1);
        }
      },
      { threshold: 1 }
    );

    observer.observe(loadingRef.current);

    return () => {
      if (loadingRef.current) observer.unobserve(loadingRef.current);
    };
  }, [hasNextPage, loading]);

  const handleNavigation = (item) => {
    navigate(`/anime-details/${item.mal_id}`);
  };

  //handle onChhange on Category 
  const handleDropDownChange =(value)=>{
    setSelectedValue(value);
  }

  return (
    <div data-component="home">
      <Header />
      <BannerSlider />

      <div className="divider">
        <label className="divider-title">Anime</label>
        <div></div>
        <div className="Filter">
          <DropDown arr={arr}  onChange={handleDropDownChange} />
          <DropDown arr={arr2}  onChange={handleDropDownChange} />
          <DropDown arr={arr3}  onChange={handleDropDownChange} />
        </div>
      </div>

      <section className="anime-wrapper">
        <div className="anime-card-container">
          {animeData.map((item) => (
            <AnimeCard
              key={item.mal_id}
              animeImg={item.images.webp.image_url}
              description={item.title}
              rating={item.score ? item.score / 2 : 0}
              onClick={() => handleNavigation(item)}
            />
          ))}
        </div>

        {/*  Intersection Observer trigger */}
        <div ref={loadingRef} className="end-message">
          {loading ? "🎌 LOADING... 🎌" : hasNextPage ? "Scroll for more" : "No more results"}
        </div>

        {error && <p style={{ color: "red" }}>Error: {error.message}</p>}
      </section>
    </div>
  );
};

export default HomePage;
