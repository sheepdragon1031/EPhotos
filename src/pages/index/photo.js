import React from "react";


const Checkmark = ({ selected }) => (
  <div
    style={
      selected
        ? { left: ".5rem", top: ".5rem", position: "absolute", zIndex: "100" ,  width: '24px' , height: '24px' , display: 'block'}
        : { display: 'none'}
    }  >
    <svg
      style={{ fill: "white", position: "absolute", left: "0rem", top: "0rem" }}
      width="24px"
      height="24px"
    >
      <circle cx="12.5" cy="12.2" r="8.292" />
    </svg>
    <svg
      style={
        selected ?  
          {fill: "#06befa", position: "absolute" , left: "0rem", top: "0rem" } :
          {fill: "#9E9E9E", position: "absolute" , left: "0rem", top: "0rem" }
        }

      width="24px"
      height="24px"
    >
      <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z" />
    </svg>
  </div>
);

const imgStyle = {
  transition: "transform .135s cubic-bezier(0.0,0.0,0.2,1),opacity linear .15s"
};
const selectedImgStyle = {
  transform: "translateZ(0px) scale3d(0.9, 0.9, 1)",
  transition: "transform .135s cubic-bezier(0.0,0.0,0.2,1),opacity linear .15s"
};
const cont = {
  backgroundColor: "#eee",
  cursor: "pointer",
  overflow: "hidden",
  position: "relative"
};

const Photo = ({ index, onClick, photo, margin, direction, top, left }) => {
  const sx = (100 - (30 / photo.width) * 100) / 100;
  const sy = (100 - (30 / photo.height) * 100) / 100;
  selectedImgStyle.transform = `translateZ(0px) scale3d(${sx}, ${sy}, 1)`;


  // const imgStyle = { margin: margin };
  if (direction === "column") {
    imgStyle.position = "absolute";
    imgStyle.left = left;
    imgStyle.top = top;
  }
  const handleClick = event => {
    onClick(event, { photo, index });
  };
  return (
    <div
      style={{ margin, height: photo.height, width: photo.width, ...cont,pointerEvents: 'auto' }}
      className={!photo.selected ? "not-selected" : ""}
    >
      <Checkmark selected={photo.selected ? true : false} style={{ pointerEvents: 'auto'}} />
      <img
        style={photo.selected
          ? { ...imgStyle, ...selectedImgStyle }
          : { ...imgStyle }}
        {...photo}
        onClick={onClick ? handleClick : null}
        alt={photo.alt}
      />
    </div>
  );
};

export default Photo;
