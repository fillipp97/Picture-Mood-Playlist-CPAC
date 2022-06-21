import { Component } from "react";
import UploadImage from './UploadImage';
import { WebcamCapture} from './Webcam'
import './LoggedIn.css'
import Entertainment from "./Entertainment";
import RenderCovers from "./RenderCovers";
import {
  CSSTransition,
  Transition,
  TransitionGroup,
} from 'react-transition-group';
import axios from "axios";

class LoggedIn extends Component{
  constructor(props){
    super(props);
    this.state={
      useWebcam: 0,
      ImageUploaded: false,
    }
  }

  componentDidMount(){
    this.props.handleGetSongs()
  }

  pictureUploaded=()=>{
    this.setState({ImageUploaded: !this.state.ImageUploaded})
  }

 splitVector=(urls)=>{
   const chunkSize = 20;
   const vertSize=10;
   const Matrix = Array();
   for(let i=0; i<vertSize*chunkSize; i+=chunkSize){
     const chunk = Array()
     for(let j=0; j<chunkSize;j++){
       let index=(i+j+Math.floor(Math.random()*urls.length)) % urls.length
       chunk.push(urls[index])
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
  
      let covers = (vectors.map((url_vector,id)=>(
        <div key={id} className={"cover-container-internal" + (id % 2) } style={{animationDelay: Math.random()*3 + 's'}}>        
          {url_vector.map((url,id)=>(
              <img key={id} src={url} ></img>))}
              
        </div>
      )))
      this.setState(covers)
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

    getPreferences=()=>{
      axios({
        method: 'GET',
        url: '/getResult'
      }).then((response)=>{
        const res=response.data
        
      })
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
              <button onClick={this.getPreferences} className="Button" style={{zIndex: 999}}>Get suggestions</button>
            </div>
            </>
          )
        }
        if(useWebcam===1){
           input=(
           <>
           <WebcamCapture onUpload={this.pictureUploaded}/>
           <button className='Button camera' onClick={this.handleBack}>Back</button>
           </>
           )
           
        }
        if(useWebcam===2){
           input=(<>
           <UploadImage onUpload={this.pictureUploaded}></UploadImage>
           <button className='Button camera' onClick={this.handleBack}>Back</button>
           </>
           )
        }
  
        
            return(               
                     this.state.ImageUploaded === false ? <>
                       <div className="logged-container">
                       
                      <div className="foreground">
                        <h1 >Upload Your Image!</h1>
                      {input}
                        </div> 
                        <div className="vignette"></div>
                        <div className="cover-container">
                        
                        <RenderCovers songs={this.props.songs}></RenderCovers>
                      </div>    
                      </div>             
                      </> : 
                      <>
                      <div className="logged-container">
                      
                     <div className="foreground">
                       <Entertainment></Entertainment>
                       </div> 
                       <div className="vignette"></div>
                       <div className="cover-container">
                       
                       <RenderCovers songs={this.props.songs}></RenderCovers>
                     </div>    
                     </div>              
                      </>
                      
                
            )
    }
}

export default LoggedIn