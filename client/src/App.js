import logo from './logo.svg';
import './App.css';
import { Component } from 'react';
import UploadImage from './Components/UploadImage';
import axios from "axios"
class App extends Component {
  constructor(props){
    super(props);
    this.state={
      loggedIn: false
    }
  }


  checklogin=()=>{
    axios({
      method: "GET",
      url:"/logout"
    })
    .then((response)=>{
      const res = response.data
      
      this.setState({ loggedIn: res}, console.log(this.state.loggedIn))
      
    }).catch((error)=>{
      if(error.response){
        console.log(error.response)
        console.log(error.response.status)
        console.log(error.response.headers)
      }
    })
  }


  handleOnClickLogin= async ()=>{
    axios({
      method: "GET",
      url:"/login"
    })
    .then((response)=>{
      const res = response.data
      this.setState({authLink: res, loggedIn: true}, ()=>{console.log('REINDIRIZZO'); window.location=this.state.authLink})
      
    }).catch((error)=>{
      if(error.response){
        console.log(error.response)
        console.log(error.response.status)
        console.log(error.response.headers)
      }
    })
  }
  
  handleGetSongs=()=>{
    axios({
      method: "GET",
      url:"/getTracks"
    })
    .then((response)=>{
      const res = response.data
      if(res.result === 'bad'){
        this.handleOnClickLogin()
      }
      if(res.result = 'ok'){
        this.setState({songs: res.songs})
      console.log(res.songs.map((songobj)=>
        songobj.track.name
      ))
      let songs =res.songs.map((songobj)=>
      songobj.track.name
    )
      
      
    }}).catch((error)=>{
      if(error.response){
        console.log(error.response)
        console.log(error.response.status)
        console.log(error.response.headers)
        this.setState({loggedIn: false})
      }
    })
  }
  
  handleCovers=()=>{
    const {songs}=this.state;

    let urls = songs.map((item)=>
      item.track.album.images[1].url
    )
    this.setState({urls: urls})
  }

  renderCovers=()=>{
    let {urls} = this.state
    if(typeof(urls) !== 'undefined' && urls != null){
      return (urls.map((url)=>(
      <img src={url}></img>)))
    }
  }

  render(){
    let loginok='Logged In'
  return (
    <div className='root'>
      <div className="App">
        <header className="App-header">
          <div className='mainContainer'>
          
            <UploadImage></UploadImage>
            
            <div className='controlButtons'>      
            
            <button className='Button' onClick={this.handleOnClickLogin}>{this.state.loggedIn ? loginok:'LOGIN'}</button>
            <button className='Button' onClick={this.handleGetSongs}>GET YOUR SONGS</button>
            <button className='Button' onClick={this.handleCovers}>Get songs Covers</button>
            <button className='Button' onClick={this.checklogin}>LOGOUT</button>
            </div>
            <div className='albumArtContainer'>
               {this.renderCovers()}

            </div>
            
              
              
          </div>
          
        
        </header>
    </div>
    </div>
  );
}
}

export default App;
