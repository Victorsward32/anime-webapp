import React from "react";
import "../../scss/components/animeCards.scss";
import square from "../../assets/icons/coner-cut-square.svg";
const AnimeCard = ({ animeImg, description, onClick, rating }) => {
  const getStars = (rating) => {
    const starsArray = [];
    const fullStars = Math.floor(rating); // full stars count
    const hasHalfStar = rating % 1 >= 0.5; // check if half star needed
    // Add full stars
    Array(fullStars)
      .fill(0)
      .forEach((_, i) => starsArray.push({ type: "full", id: `full-${i}` }));

    // Add half star if needed
    if (hasHalfStar) {
      starsArray.push({ type: "half", id: "half-star" });
    }

    // Add empty stars for the remaining
    const emptyStars = 5 - starsArray.length;
    Array(emptyStars)
      .fill(0)
      .forEach((_, i) => starsArray.push({ type: "empty", id: `empty-${i}` }));

    return starsArray;
  };
  return (
    <div
      data-component="AnimeCard"
      onClick={onClick}
    >
      <div className="Image-container">
        <img src={animeImg} className="anime-poster" alt="animePoster" />
        <div className="overlay">
          <img src={square} alt="squareImg" className="squareImg" />
          <span>Watch this</span>
        </div>
      </div>
      <p className="animeDescription">{description}</p>
      <div className="rating-contianer">
        {getStars(rating).map((star) => {
          return (
            <span key={star.id} className={`star ${star.type}`}>
              ★
            </span>
          );
        })}
      </div>
    </div>
  );
};

export default AnimeCard;
