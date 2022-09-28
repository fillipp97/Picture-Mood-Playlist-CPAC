import { Component } from "react";
import UploadImage from './UploadImage';
import { WebcamCapture } from './Webcam'
import './LoggedIn.css'

import { MdPhotoCamera, MdTitle } from 'react-icons/md'
import { BiGame, BiLogOutCircle } from 'react-icons/bi'
import { BsMusicNoteList } from 'react-icons/bs'
import RenderCovers from "./RenderCovers";

import FirstFiltering from "./FirstFiltering";
import ImageStep from "./ImageStep";
import { uploadFile, getRecommendedSongs, savePlaylist } from '../Services/ApiService';
import GeneratePlayList from "./GeneratePlayList";
import Stepper from "./Stepper";
import { BounceLoader } from 'react-spinners'
import Balls from "./Balls";
import ForegroundChange from "../Styled/ForegroundChange.styled";
import FadeInLefth1 from "../Styled/FadeInLefth1.styled";

class LoggedIn extends Component {
  constructor(props) {
    super(props);
    this.state = {
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
      { name: 'Picture', icon: <MdPhotoCamera />, enabled: true },
      { name: 'Make choices', icon: <BiGame />, enabled: !!state.imageStepResults },
      { name: 'Create playlist', icon: <MdTitle />, enabled: !!state.firstFilteringCallback },
      { name: 'Enjoy', icon: <BsMusicNoteList />, enabled: !!state.playListGenerationCallback },
      { name: 'Logout', icon: <BiLogOutCircle />, enabled: true }
    ]
  }

  handleStepperCallback = (step) => {
    console.log(step.name)
    switch (step.name) {
      case 'Picture':
        this.resetPlayListGeneration()
        this.resetFirstFiltering()
        this.resetImageStep();
        ForegroundChange("foreground", 500, "brighten")
        break
      case 'Make choices':
        this.resetPlayListGeneration()
        this.resetFirstFiltering();
        break
      case 'Create playlist':
        this.resetPlayListGeneration();
        break
      case 'Logout':
        this.props.logout();
        break


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


  imageStepCallback = (file) => {
    this.setState({ imageStepCallback: true }, this.handleUpload(file))
  };
  handleUpload = (file) => {
    uploadFile(file.image)
      .then(response => {
        this.setState({
          imageStepResults: response
        });
      })
  }

  firstFilteringCallback = (value) => {
    this.setState({ firstFilteringCallback: value }, this.handleGetRecommended)
  }
  handleGetRecommended = () => {
    getRecommendedSongs(this.state.firstFilteringCallback)
      .then((response) => {
        if (response.result === 'ok') {
          console.log("firstFilteringResults:response:", response)
          this.setState({
            recommendedSongs: response.recommendations,
            recommendedLyrics: response.lyrics
          })
          this.setState({ firstFilteringResults: response, showGeneratePlaylist: true });
        }
      });
  }

  generatePlayListCallback = (value) => {
    this.setState({ playListGenerationCallback: value }, this.handleSavePlaylist)
  }
  handleSavePlaylist = () => {
    savePlaylist(this.state.playListGenerationCallback)
      .then((response) => {
        console.log("playListGenerationResults:response:", response)
        if (response.result === 'ok') {
          this.setState({
            playListGenerationResults: response,
          });
        }
      });
  }

  render() {
    return (
      <>

        {
          <>
            <div className="logged-container">
              <header id="App-header" className="App-header"> <Stepper steps={this.getStepperSteps(this.state)} callback={this.handleStepperCallback} /> </header>

              <div className="foreground">
                <div className="Contents">
                  <div className="div-loader">
                    {this.isLoading() && <><BounceLoader className="loader" color="white" /> {ForegroundChange("foreground", 500, "darken")}</>}
                  </div>


                  {!this.state.imageStepCallback &&
                    <ImageStep callback={this.imageStepCallback} />
                  }
                  {(this.state.imageStepResults && !this.state.firstFilteringCallback) &&
                    <FirstFiltering firstFilteringInput={this.state.imageStepResults} callback={this.firstFilteringCallback} />
                  }
                  {(this.state.firstFilteringResults && !this.state.playListGenerationCallback) &&
                    <GeneratePlayList generatePlayListInput={this.state.firstFilteringResults} callback={this.generatePlayListCallback} show={this.state.showGeneratePlaylist} />
                  }
                  {this.state.playListGenerationResults && <div className=".div-generated-playlist-body"><FadeInLefth1 text={"The song has been generated"} /> <FadeInLefth1 text={"ENJOY!"} /></div>}
                </div>
              </div>

              <div className="cover-container">
                {/* {this.props.songs.length > 0 && <Balls songs={this.props.songs} />} */}



                <RenderCovers songs={this.props.songs}></RenderCovers>
              </div>
            </div>
          </>
        }
      </>
    )
  }
}

export default LoggedIn
