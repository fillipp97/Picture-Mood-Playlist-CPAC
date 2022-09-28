import React, { useState } from 'react';
import Webcam from "react-webcam";
import { useEffect } from 'react';

function getWindowDimensions() {
    const { innerWidth: width, innerHeight: height } = window;
    return {
        width,
        height
    };
}



const videoConstraints = {
    width: 220,
    height: 200,
    facingMode: "user"
};

export const WebcamCapture = ({ callback }) => {

    const [image, setImage] = useState('');
    const webcamRef = React.useRef(null);
    const { height, width } = useWindowDimensions();

    const sendPicture = () => {
        callback({
            image: b64toBlob(image)
        });
    };

    const capture = React.useCallback(
        () => {
            const imageSrc = webcamRef.current.getScreenshot();
            setImage(imageSrc)

        });

    function useWindowDimensions() {
        const [windowDimensions, setWindowDimensions] = useState(getWindowDimensions());

        useEffect(() => {
            function handleResize() {
                setWindowDimensions(getWindowDimensions());
            }

            window.addEventListener('resize', handleResize);
            return () => window.removeEventListener('resize', handleResize);
        }, []);

        return windowDimensions;
    }


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

                {image === '' ? <Webcam
                    audio={false}
                    height={0.5 * height}
                    ref={webcamRef}
                    screenshotFormat="image/jpeg"
                    width={0.5 * height}
                    videoConstraints={videoConstraints}
                /> : <img src={image} className="animated" />}
            </div>
            <div >
                {image !== '' ?
                    (<div className='div-camera-taken-pictures'>
                        <button onClick={(e) => {
                            e.preventDefault();
                            setImage('')
                        }}
                            className="button-camera-retake">
                            Retake Image</button>
                        <button onClick={sendPicture} className="button-camera-upload">Upload</button>
                    </div>
                    )
                    :
                    <div className='cameraButtons'>
                        <button onClick={(e) => {
                            e.preventDefault();
                            capture();
                        }}
                            className="button-capture">Capture</button>
                    </div>
                }
            </div>
        </div>
    );
};