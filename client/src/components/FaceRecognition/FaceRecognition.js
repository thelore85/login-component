import React from "react";
import './FaceRecognition.css';

const FaceRecognition = ({ url, box }) => {

    if(url){
      return(
      <div id='image-container' className="wrapper-img">
        <div className="bounding-box" style={{ top: box.top, bottom: box.bottom, left: box.left, right: box.right}}></div>
        <img id="input-image" alt="image" className="" src={url} />
      </div>
    )}
}

export default FaceRecognition;

