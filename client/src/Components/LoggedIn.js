import { Component } from "react";
import UploadImage from './UploadImage';

class LoggedIn extends Component{



    render(){
        
        console.log(this.props.login)

        if(this.props.login){
            return(
                
                    <>
                      <UploadImage></UploadImage>
                      
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