import React from "react";
import './FaceRecognition.css';

const FaceRecognition = ({ url }) => {
  return(
      <div id='image-container' className="wrapper">
        <img alt="image" className="" src={url}/>
      </div>
    )
}

export default FaceRecognition;

