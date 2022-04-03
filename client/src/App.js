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
      console.log(res.songs.map((songobj)=>
        songobj.track.name
      ))
      let songs =res.songs.map((songobj)=>
      songobj.track.name
    )
      this.setState({songs: songs})
      
    }}).catch((error)=>{
      if(error.response){
        console.log(error.response)
        console.log(error.response.status)
        console.log(error.response.headers)
      }
    })
  }
 
  render(){
    let loginok='Logged In'
  return (
    <div className='root'>
    <div className="App">
      <header className="App-header">
        <div className='mainContainer'>

        <UploadImage></UploadImage>
        <button onClick={this.handleOnClickLogin}>{this.state.loggedIn ? loginok:'LOGIN'}</button>
        <button onClick={this.handleGetSongs}>GET YOUR SONGS</button>
        <button onClick={this.checklogin}>LOGOUT</button>


        </div>
        
       
      </header>
    </div>
    </div>
  );
}
}

export default App;
