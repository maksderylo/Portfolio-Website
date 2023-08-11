import React from "react";
import { Carousel } from "react-responsive-carousel";
import "react-responsive-carousel/lib/styles/carousel.min.css";
import './carousel.css'
import {useNavigate} from 'react-router-dom';

const Carousell = () => {
  const navigate = useNavigate();

  function navHome(where){
    //setMenu("fullscreen");

    setTimeout(function(){
      window.scrollTo(0, 0);
      navigate(`${where}`);
      setTimeout(function(){
        //setMenu("closed");
    }, 1500);
  }, 500);
  
  
  };


  const renderIndicator = (onClickHandler, isSelected, index) => {
    if (isSelected) {
      return (
        <span
          style={{
            backgroundColor: "#000",
            borderRadius: "50%",
            display: "inline-block",
            height: "6px",
            margin: "0 3px",
            width: "6px",
          }}
          onClick={onClickHandler}
          onKeyDown={onClickHandler}
          value={index}
          key={index}
          role="button"
          tabIndex={0}
          aria-label={`Slide ${index + 1}`}
        ></span>
      );
    }

    return (
      <span
        style={{
          backgroundColor: "#fff",
          borderRadius: "50%",
          display: "inline-block",
          height: "6px",
          margin: "0 3px",
          width: "6px",
        }}
        onClick={onClickHandler}
        onKeyDown={onClickHandler}
        value={index}
        key={index}
        role="button"
        tabIndex={0}
        aria-label={`Slide ${index + 1}`}
      ></span>
    );
  };

  return (
    <div id="car">
    <Carousel
      autoPlay={true}
      infiniteLoop={true}
      showThumbs={false}
      showArrows={false}
      renderIndicator={renderIndicator}
      showStatus={false}
    >
      <div className="slide">
        <div className="inslide" id="workslide">
        <div><p onClick={() => navHome('/about')}>Hi</p></div>
          </div>
      </div>
      <div className="slide">
      <div className="inslide">
      <div className="butdiv"><button>Work!</button></div>
          </div>
      </div>
      <div className="slide">
      <div className="inslide">
          <h1>3</h1>
          </div>
      </div>
    </Carousel>
    </div>
  );
};

export default Carousell;