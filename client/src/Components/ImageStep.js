import React, { useState } from 'react';
import { WebcamCapture } from './Webcam';
import UploadImage from './UploadImage';
import './ImageStep.css'
import ButtonComp from "../Styled/Button.styled";
export default function ImageStep({ callback }) {
    const [chosenInput, updateChosenInput] = useState(null);
    const chooseInput = (type) => {
        // let bar = document.getElementsByClassName("controlBar iniBar");
        // console.log(bar);
        // bar.classList.add("picBar");
        updateChosenInput(type);
    }
    const uploadButton = <button className='button-upload' onClick={() => chooseInput('UPLOAD')}>Choose image</button>;
    const cameraButton = <button className='button-camera' onClick={() => chooseInput('CAMERA')}>Take picture</button>;
    const backButton = <button className='button-back' onClick={() => chooseInput(null)}>Back</button>;
    // const uploadButton = <ButtonComp onClick={() => chooseInput('UPLOAD')} text="Choose image"></ButtonComp>;
    // const cameraButton = <ButtonComp onClick={() => chooseInput('CAMERA')} text="Take picture" ></ButtonComp>;
    // const backButton = <ButtonComp onClick={() => chooseInput(null)} text="Back" ></ButtonComp>;
    return (
        <div className="div-content">

            <div className="div-wave">
                <span className="wave"></span>
                <span className="wave"></span>
                <span className="wave"></span>
                <span className="wave"></span>
                <span className="wave"></span>
                <span className="wave"></span>
                <span className="wave"></span>
            </div>

            <div className="div-action">
                <h1>Get ready.</h1>
                <h3>Choose or take a picture to experience your Picture-Mood-Playlist!</h3>
                <div className="controlBar">
                    {!chosenInput &&
                        <>{cameraButton}{uploadButton}</>
                    }
                    {chosenInput === 'CAMERA' &&
                        <WebcamCapture callback={callback} />
                    }
                    {chosenInput === 'UPLOAD' &&
                        <UploadImage callback={callback} />
                    }
                    {chosenInput && backButton}
                    </div>
            </div>

            <div className="div-wave">
                <span className="wave"></span>
                <span className="wave"></span>
                <span className="wave"></span>
                <span className="wave"></span>
                <span className="wave"></span>
                <span className="wave"></span>
                <span className="wave"></span>
            </div>

        </div>
    )
}
