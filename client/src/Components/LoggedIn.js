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
import ImageStep from "./ImageStep";
import { uploadFile, getRecommendedSongs, savePlaylist } from '../Services/ApiService';
import GeneratePlayList from "./GeneratePlayList";
import Stepper from "./Stepper";
import DropDownBox from "./DropDownBox";
import Balls from "./Balls";
class LoggedIn extends Component {
  constructor(props) {
    super(props);
    this.state = {
      useWebcam: 0,
      ImageUploaded: false,
      handleLogout: props.handleLogout,
      imageStepCallback: null,
      imageStepResults: null,
      firstFilteringCallback: null,
      firstFilteringResults: null,
      playListGenerationCallback: null,
      playListGenerationResults: null,
      songsStepResults: null,
      songsStepController: 0,
    }
  }
  getStepperSteps = (state) => {
    return [
      { name: 'Picture', enabled: true },
      { name: 'Make choices', enabled: !!state.imageStepResults },
      { name: 'Create playlist', enabled: !!state.firstFilteringCallback },
      { name: 'Enjoy', enabled: !!state.playListGenerationCallback }
    ]
  }

  handleStepperCallback = (step) => {
    switch (step.name) {
      case 'Picture':
        this.resetImageStep();
      case 'Make choices':
        this.resetFirstFiltering();
      case 'Create playlist':
        this.resetPlayListGeneration();
    }
  }

  resetImageStep = () => {
    this.setState({ imageStepCallback: null })
    this.setState({ imageStepResults: null })
  }

  resetFirstFiltering = () => {
    this.setState({ firstFilteringCallback: null })
    this.setState({ firstFilteringResults: null })
  }

  resetPlayListGeneration = () => {
    this.setState({ playListGenerationCallback: null })
    this.setState({ playListGenerationResults: null })
  }

  isLoading = () => {
    return (this.state.imageStepCallback && !this.state.imageStepResults) ||
      (this.state.playListGenerationCallback && !this.state.playListGenerationResults) ||
      (this.state.firstFilteringCallback && !this.state.firstFilteringResults)
  }

  componentDidMount() {
    this.props.handleGetSongs()
  }

  pictureUploaded = (results) => { //got back results from picture uploadFile API call
    console.warn('pictureUploaded', true)
    this.setState({ ImageUploaded: true })
    this.setState({
      imageStepResults: results
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
    this.setState({ useWebcam: 2 }, console.warn('useWebcam', 2)) //show CHOOSE FILE button
  }
  handleInputCamera = () => {
    this.setState({ useWebcam: 1 }, console.warn('useWebcam', 1)) //show CAMERA input
  }
  handleBack = () => {
    this.setState({ useWebcam: 0 }, console.warn('useWebcam', 0)) //show selection between file/camera
  }


  render() {
    const imageStepCallback = (file) => {
      this.setState({ imageStepCallback: true }, handleUpload(file))
    };

    const firstFilteringCallback = (value) => {
      this.setState({ firstFilteringCallback: value }, handleGetRecommended)
    }

    const generatePlayListCallback = (value) => {
      this.setState({ playListGenerationCallback: value }, handleSavePlaylist)
    }


    const handleUpload = (file) => {
      uploadFile(file.image)
        .then(response => {
          this.setState({
            imageStepResults: response
          });
        })
    }

    const handleGetRecommended = () => {
      getRecommendedSongs(this.state.firstFilteringCallback)
        .then((response) => {
          if (response.result === 'ok') {
            console.log(response)
            this.setState({
              recommendedSongs: response.recommendations,
              recommendedLyrics: response.lyrics
            })
            this.setState({ firstFilteringResults: response });
          }
        });
    }

    const handleSavePlaylist = () => {
      savePlaylist(this.state.playListGenerationCallback)
        .then((response) => {
          if (response.result === 'ok') {
            this.setState({ playListGenerationResults: response });
          }
        });
    }


    return (
      <>
        {/* Three states are needed for each of the upcoming components:
            0 - all not showing
            1 - one part of code is active
            2 - the other part of code is active 
            Doing so it is possible to "mute" imageStepResults while showing recommendedSongsResults*/}
        {
          <>
            <div className="logged-container">
              <div className="foreground">
                <Stepper steps={this.getStepperSteps(this.state)} callback={this.handleStepperCallback} />
                {this.isLoading() && <span>LOADING...</span>}
                {!this.state.imageStepCallback &&
                  <ImageStep callback={imageStepCallback} />
                }
                {(this.state.imageStepResults && !this.state.firstFilteringCallback) &&
                  <FirstFiltering firstFilteringInput={this.state.imageStepResults} callback={firstFilteringCallback} />
                }
                {(this.state.firstFilteringResults && !this.state.playListGenerationCallback) &&
                  <GeneratePlayList generatePlayListInput={this.state.firstFilteringResults} callback={generatePlayListCallback} />
                }
                {this.state.playListGenerationResults && JSON.stringify(this.state.playListGenerationResults)}
              </div>
              <div className="vignette">
                <DropDownBox></DropDownBox>
              </div>
              <div className="cover-container">
                <Balls />
                {/* <RenderCovers songs={this.props.songs}></RenderCovers> */}
              </div>
            </div>
          </>
        }
      </>
    )
  }
}

export default LoggedIn
