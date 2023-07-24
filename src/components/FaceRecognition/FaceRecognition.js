import React from "react";
import './FaceRecognition.css';

const FaceRecognition = ({ url, box }) => {
  return(
      <div id='image-container' className="wrapper">
        <div className="bounding-box" style={{ top: box.top, right: box.right , bottom: box.bottom, left: box.left }}></div>
        <img id="input-image" alt="image" className="" src={url} />
      </div>
    )
}

export default FaceRecognition;

