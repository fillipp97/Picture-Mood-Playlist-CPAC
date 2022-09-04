import React, { useState, useEffect } from 'react';
import UploadImage from './Components/UploadImage';
import WebcamCapture from './Components/WebcamCapture';
import { isLoggedIn, logIn, uploadFile, getTracks } from './Services/ApiService';

export default function App() {
  const [applicationError, setApplicationError] = useState(null);
  const [loggedIn, setLoggedIn] = useState(null);
  const [authLink, setAuthLink] = useState(null);
  const [imageFile, setImageFile] = useState(null);

  useEffect(() => {
    applicationError && console.error(applicationError.response)
  }, [applicationError]);

  const getWebcamCaptureFile = (file) => {
    setImageFile(file)
  }
  const getUploadImageFile = (file) => {
    setImageFile(file)
  }
  useEffect(() => {
    console.log('setImageFile', imageFile)
    uploadFile(imageFile).then(data => {
      console.log(data)
    }).catch(error => {
      setApplicationError(error)
    })
  }, [imageFile]);

  const checkIfLoggedIn = () => {
    isLoggedIn().then(logged => {
      setLoggedIn(logged)
    }).catch(error => {
      setApplicationError(error)
    })
  }
  useEffect(() => {
    console.log('setLoggedIn', loggedIn)
  }, [loggedIn]);

  const handleOnClickLogin = async () => {
    logIn()
      .then((response) => {
        setAuthLink(response)
        window.location = authLink
        //SHOULD REANALIZE IF LOGGED IN WHEN COMING BACK!
      }).catch((error) => {
          setApplicationError(error)
      })
  }

  checkIfLoggedIn()

  return (
    <div>
      {loggedIn &&
      <p>Logged in</p>}
      {!loggedIn &&
      <button onClick={() => handleOnClickLogin()}>LOG IN</button>}
      {!imageFile &&
        <UploadImage callback={getUploadImageFile} />}
      {!imageFile &&
        <WebcamCapture callback={getWebcamCaptureFile} />
      }
    </div>
  );
}
