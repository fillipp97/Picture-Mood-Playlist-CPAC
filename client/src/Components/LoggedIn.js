import { Component } from "react";
import UploadImage from './UploadImage';
import { WebcamCapture} from './Webcam'

class LoggedIn extends Component{
  constructor(props){
    super(props);
    this.state={
      useWebcam: 0,
    }
  }


    render(){
        const {useWebcam}=this.state;
        let input;
        if(useWebcam===0){
          input = false
        }
        if(useWebcam===1){
           input=(<WebcamCapture/>)
        }
        if(useWebcam===2){
           input=(<UploadImage></UploadImage>)
        }

        if(this.props.login===2){
            return(
                
                    <>
                      <h1>Upload Your Image!</h1>
                      {input}

                      <div className='controlButtons'>      
                      
                      <button className='Button' onClick={this.props.handleGetSongs}>GET YOUR SONGS</button>
                      <button className='Button' onClick={this.props.handleCovers}>Get songs Covers</button>
                      <button className='Button' onClick={this.props.logout}>LOGOUT</button>
                      </div>
                      <div className='albumArtContainer'>
                        {this.props.renderCovers()}
      
                      </div>
                      
                      </>
                
            )
        }
    }
}

export default LoggedIn