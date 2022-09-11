import { Component } from "react";
import UploadImage from './UploadImage';
import { WebcamCapture } from './Webcam'
import './LoggedIn.css'
import Entertainment from "./Entertainment";
import RenderCovers from "./RenderCovers";
import {
  CSSTransition,
  Transition,
  TransitionGroup,
} from 'react-transition-group';
import axios from "axios";
import FirstFiltering from "./FirstFiltering";
import { getRecommendedSongs } from '../Services/ApiService';

class LoggedIn extends Component {
  constructor(props) {
    super(props);
    this.state = {
      useWebcam: 0,
      ImageUploaded: false,
      handleLogout: props.handleLogout,
      imageStepResults: null,
      imageStepController: 1,
      firstFilteringCallback: null,
      songsStepResults: null,
      songsStepController: 0,
    }
  }

  componentDidMount() {
    this.props.handleGetSongs()
  }

  pictureUploaded = (results) => {
    this.setState({ ImageUploaded: true })
    this.setState({
      imageStepResults: results,
      imageStepController: 2
    });
  }

  splitVector = (urls) => {
    const chunkSize = 20;
    const vertSize = 10;
    const Matrix = Array();
    for (let i = 0; i < vertSize * chunkSize; i += chunkSize) {
      const chunk = Array()
      for (let j = 0; j < chunkSize; j++) {
        let index = (i + j + Math.floor(Math.random() * urls.length)) % urls.length
        chunk.push(urls[index])
      }
      Matrix.push(chunk)
    }
    return Matrix
  }

  renderCovers = () => {
    const { songs } = this.props;
    let urls = songs.map((item) =>
      item.track.album.images[2].url //1 is the most resoluted 2 is the least
    )

    if (typeof (urls) !== 'undefined' && urls != null) {
      let vectors = this.splitVector(urls)
      console.log(vectors)

      let covers = (vectors.map((url_vector, id) => (
        <div key={id} className={"cover-container-internal" + (id % 2)} style={{ animationDelay: Math.random() * 3 + 's' }}>
          {url_vector.map((url, id) => (
            <img key={id} src={url} ></img>))}

        </div>
      )))
      this.setState(covers)
    }
  }


  handleInputPicture = () => {
    this.setState({ useWebcam: 2 })
  }
  handleInputCamera = () => {
    this.setState({ useWebcam: 1 })
  }
  handleBack = () => {
    this.setState({ useWebcam: 0 })
  }


  handleGetRecommended = () => {
    getRecommendedSongs(this.state.firstFilteringCallback)
      .then((response) => {
        if (response.result === 'ok') {
          console.log(response)
          this.setState({
            recommendedSongs: response.recommendations,
            recommendedLyrics: response.lyrics
          })
          console.log('/getSongs response', response)
        }
      });
  }


  render() {
    const { useWebcam } = this.state;
    let input;
    if (useWebcam === 0) {
      input = (
        <>
          <div className="uploadChoiceContainer">

            <button className='Button' onClick={this.handleInputPicture}>Upload Picture</button>
            <button className='Button' onClick={this.props.logout}>Logout</button>

            <button className='Button' onClick={this.handleInputCamera}>Take a Picture</button>

          </div>
        </>
      )
    }
    if (useWebcam === 1) {
      input = (
        <>
          <WebcamCapture onUpload={this.pictureUploaded} />
          <button className='Button camera' onClick={this.handleBack}>Back</button>
        </>
      )

    }
    if (useWebcam === 2) {
      input = (<>
        <UploadImage onUpload={this.pictureUploaded}></UploadImage>
        <button className='Button camera' onClick={this.handleBack}>Back</button>
      </>
      )
    }

    const firstFilteringCallback = (value) => {
      this.setState({ firstFilteringCallback: value })
    }


    return (
      <>
        {/* Three states are needed for each of the upcoming components:
            0 - all not showing
            1 - one part of code is active
            2 - the other part of code is active 
            Doing so it is possible to "mute" imageStepResults while showing recommendedSongsResults*/}
        {
          this.state.imageStepController === 1 && <>
            <div className="logged-container">

              <div className="foreground">
                <h1 >Upload Your Image!</h1>
                {input}
              </div>
              <div className="vignette"></div>
              <div className="cover-container">

                {/* <RenderCovers songs={this.props.songs}></RenderCovers> */}
              </div>
            </div>
          </>



        }

        {
          this.state.imageStepController === 2 &&
          <>
            <div className="logged-container">

              <div className="foreground">
                <FirstFiltering firstFilteringInput={this.state.imageStepResults} callback={firstFilteringCallback} />
                <button className="Button" onClick={this.handleGetRecommended}>Send Song Request</button>
              </div>
              <div className="vignette"></div>
              <div className="cover-container">

                {/* <RenderCovers songs={this.props.songs}></RenderCovers> */}
              </div>
            </div>
          </>
        }

        {
          this.state.songsStepController === 1 &&
          <>

            <div>songsStepController is {this.state.songsStepController}</div>

          </>
        }


        {
          this.state.songsStepController === 2 &&
          <>

            <div>songsStepController is {this.state.songsStepController}</div>

          </>
        }





      </>
    )
  }
}

export default LoggedIn