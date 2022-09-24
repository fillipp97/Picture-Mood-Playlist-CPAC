import React, { useState } from 'react';
import { WebcamCapture } from './Webcam';
import UploadImage from './UploadImage';

export default function ImageStep({ callback }) {
    const [chosenInput, updateChosenInput] = useState(null);
    const chooseInput = (type) => {
        updateChosenInput(type);
    }

    const uploadButton = <button className='Button' onClick={() => chooseInput('UPLOAD')}>Choose image</button>;
    const cameraButton = <button className='Button' onClick={() => chooseInput('CAMERA')}>Take picture</button>;
    const backButton = <button className='Button' onClick={() => chooseInput(null)}>Back</button>;

    return (
        <div style={{ background: "gray" }}>
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
    )
}
