import React from "react";
import './FaceRecognition.css';

const FaceRecognition = ({ url, faceDetection }) => {
  return(
      <div id='image-container' className="wrapper">
        <img id="input-image" alt="image" className="" src={url} />
        <div className="bounding-box" style={{ top: faceDetection.topRow, right: faceDetection.rightCol , bottom: faceDetection.bottomRow, left: faceDetection.leftCol }}></div>
      </div>
    )
}

export default FaceRecognition;

