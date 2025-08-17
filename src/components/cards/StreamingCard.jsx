import React from "react";
import "../../scss/components/streamingCard.scss";

const StreamingCard = ({ name, image, isCircle = false, role }) => {
  //   console.log("image", image);
  return (
    <div data-component="StreamingCards">
      {isCircle === true ? (
        <div className="StreamingCard1">
          <img src={image} className="image" alt="" />
          <div className="description">
            <span>{name || "Name"}</span>
          </div>
        </div>
      ) : (
        <div className="StreamingCard2">
          <img src={image} className="squre-image" alt="" />
          <div className="description">
            <span>{name || "Name"}</span>
            <span>{role || "Role"}</span>
          </div>
        </div>
      )}
    </div>
  );
};

export default StreamingCard;