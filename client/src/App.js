import logo from './logo.svg';
import './App.css';
import { Component } from 'react';

import axios from "axios"
import NotLoggedIn from './Components/NotLoggedIn';
import LoggedIn from './Components/LoggedIn';

class App extends Component {
  constructor(props){
    super(props);
    this.state={
      loggedIn: 0
    }
  }

  
  componentDidMount=()=>{
    this.checkIfLoggedIn()
  }

  checkIfLoggedIn=()=>{
    axios({
      method: 'GET',
      url: '/checkLogState'
    }).then((response)=>{
      const res=response.data
      if(res.result === 'bad'){ //user not logged in
        console.log('USER NOT LOGGED IN')
        this.setState({loggedIn: 1})

      }else{
        console.log('USER LOGGED IN')
        this.setState({loggedIn: 2})
      }

    })
  }

  logout=()=>{
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
      this.setState({authLink: res}, ()=>{console.log('REINDIRIZZO'); window.location=this.state.authLink; this.setState({loggedIn: true})})
      
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
  return (
    <div className='root'>
      <div className="App">
        <header className="App-header">
          <div className='mainContainer'>
            
            <NotLoggedIn className='appear'
            login={this.state.loggedIn}
            onClick={this.handleOnClickLogin}
            >

            </NotLoggedIn>

            <LoggedIn className='appear'
            login={this.state.loggedIn} 
            handleGetSongs={this.handleGetSongs} 
            handleCovers={this.handleCovers} 
            logout={this.logout}
            renderCovers={this.renderCovers}>
            

            </LoggedIn>
              
          </div>
          
        
        </header>
    </div>
    </div>
  );
}
}

export default App;
