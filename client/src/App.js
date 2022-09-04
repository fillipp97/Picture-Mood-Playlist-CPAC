// import React from 'react'
// import ReactDOM from 'react-dom'
import './App.css';
import { isLoggedIn, logIn, getTracks } from './Services/ApiService';
import { Component } from 'react';

import axios from "axios"
import NotLoggedIn from './Components/NotLoggedIn';
import LoggedIn from './Components/LoggedIn';


class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      applicationError: null,
      loggedIn: 1,
      songs: []
    }
  }


  componentDidMount = () => {
    this.checkIfLoggedIn()
  }

  checkIfLoggedIn = () => {
    isLoggedIn().then(logged => {
      this.setState({ loggedIn: logged ? 2 : 1 })
    }).catch(error => {
      this.setState({ applicationError: error.response })
    })
  }

  logout = () => {
    axios({
      method: "GET",
      url: "/logout"
    })
      .then((response) => {
        const res = response.data

        this.setState({ loggedIn: 1 }, console.log(this.state.loggedIn))

      }).catch((error) => {
        if (error.response) {
          console.log(error.response)
          console.log(error.response.status)
          console.log(error.response.headers)
        }
      })
  }


  handleOnClickLogin = async () => {
    logIn()
      .then((response) => {
        this.setState({ authLink: response }, () => { console.log('Redirecting to Spotify'); window.location = this.state.authLink; })
      }).catch((error) => {
        if (error.response) {
          this.setState({ applicationError: error.response })
          console.log(error.response)
          console.log(error.response.status)
          console.log(error.response.headers)
        }
      })
  }

  handleGetSongs = () => {
    console.log(this.state.loggedIn)

    getTracks()
      .then((response) => {
        if (response.result === 'bad') {
          this.handleOnClickLogin()
        }
        if (response.result = 'ok') {
          this.setState({ songs: response.songs })
          console.log(response.songs.map((songobj) =>
            songobj.track.name
          ))
          return response.songs
        }
      }).catch(error => {
        this.setState({ applicationError: error.response })
      })
  }


  render() {
    return this.state.applicationError ? (<h1>Application error: {this.state.applicationError.statusText}</h1>) : (
      <div className='root'>
        <div className="App">
          <header className="App-header">
            <div className='mainContainer'>

              {this.state.loggedIn === 1 && <NotLoggedIn
                login={this.state.loggedIn}
                onClick={this.handleOnClickLogin}
              >

              </NotLoggedIn>}

              {this.state.loggedIn === 2 && <LoggedIn
                login={this.state.loggedIn}
                handleGetSongs={this.handleGetSongs}
                songs={this.state.songs}
                logout={this.logout}>
              </LoggedIn>}

            </div>
          </header>
        </div>
      </div>
    );
  }
}

export default App;
