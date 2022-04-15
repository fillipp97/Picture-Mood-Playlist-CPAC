import { Component } from "react";
import UploadImage from './UploadImage';
import { WebcamCapture} from './Webcam'
import './LoggedIn.css'
class LoggedIn extends Component{
  constructor(props){
    super(props);
    this.state={
      useWebcam: 0,
      urls: []
    }
  }


  componentDidMount(){
    this.props.handleGetSongs()
  }

 splitVector=(urls)=>{
   const chunkSize = 10;
   const Matrix = Array(Math.floor(urls.length/10))
   for(let i=0; i<urls.length; i+=chunkSize){
     const chunk = Array(10)
     for(let j=0; j<10;j++){
       chunk.push(urls[i+j])
     }
     Matrix.push(chunk)
   }
   return Matrix
  }

  renderCovers=()=>{
    const {songs}=this.props;
    let urls = songs.map((item)=>
      item.track.album.images[1].url
    )

    if(typeof(urls) !== 'undefined' && urls != null){
      let vectors = this.splitVector(urls)
      console.log(vectors)
      
      
      return (urls.map((url)=>(
      <img src={url}></img>)))
    }
  }


    handleInputPicture=()=>{
        this.setState({useWebcam: 2})
    }
    handleInputCamera=()=>{
      this.setState({useWebcam: 1})
  }
    handleBack=()=>{
      this.setState({useWebcam: 0})
    }

    render(){
        const {useWebcam}=this.state;
        let input;
        if(useWebcam===0){
          input = (
            <>
            <div className="uploadChoiceContainer">
              <button className='Button' onClick={this.handleInputPicture}>Upload Picture</button>
              <button className='Button' onClick={this.handleInputCamera}>Take a Picture</button>
              
            </div>
            </>
          )
        }
        if(useWebcam===1){
           input=(
           <>
           <WebcamCapture/>
           <button className='Button' onClick={this.handleBack}>Back</button>
           </>
           )
           
        }
        if(useWebcam===2){
           input=(<>
           <UploadImage></UploadImage>
           <button className='Button' onClick={this.handleBack}>Back</button>
           </>
           )
        }

        
            return(               
                    <>
                        <div className="foreground">
                        <h1>Upload Your Image!</h1>
                      {input}
                        </div>
                      <div className="cover-container">
                        {this.renderCovers()}
                      </div>                      
                      </>
                
            )
    }
}

export default LoggedIn