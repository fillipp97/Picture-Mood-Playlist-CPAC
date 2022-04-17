import React, { useState } from 'react';
import Webcam from "react-webcam";
import UploadButton from './UploadButton';




const videoConstraints = {
    width: 220,
    height: 200,
    facingMode: "user"
};

export const WebcamCapture = () => {

    const [image,setImage]=useState('');
    const webcamRef = React.useRef(null);

    
    const capture = React.useCallback(
        () => {
        const imageSrc = webcamRef.current.getScreenshot();
        setImage(imageSrc)
        
        });

    function b64toBlob(dataURI) {

        var byteString = atob(dataURI.split(',')[1]);
        var ab = new ArrayBuffer(byteString.length);
        var ia = new Uint8Array(ab);
        
        for (var i = 0; i < byteString.length; i++) {
            ia[i] = byteString.charCodeAt(i);
        }
        return new Blob([ab], { type: 'image/jpeg' });
    }
     
    return (
        <div className="webcam-container">
            <div className="webcam-img">

                {image == '' ? <Webcam
                    audio={false}
                    height={490}
                    ref={webcamRef}
                    screenshotFormat="image/jpeg"
                    width={500}
                    videoConstraints={videoConstraints}
                /> : <img src={image} style={{position: 'relative', margin: '4.4vh', top: '2vh'}}/>}
            </div>
            <div >
                {image != '' ?
                    (<>
                    <button onClick={(e) => {
                        e.preventDefault();
                        setImage('')
                    }}
                        className="Button camera">
                        Retake Image</button>
                        <UploadButton file={b64toBlob(image)}></UploadButton>
                        </>
                        )
                         :
                    <button onClick={(e) => {
                        e.preventDefault();
                        capture();
                    }}
                        className="Button camera">Capture</button>
                }
            </div>
        </div>
    );
};