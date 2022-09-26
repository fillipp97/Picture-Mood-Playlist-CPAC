
import { isLoggedIn, logIn, getTracks, getRecommendedSongs } from './Services/ApiService';
import { Component } from 'react';
import axios from "axios"
import NotLoggedIn from './Components/NotLoggedIn';
import LoggedIn from './Components/LoggedIn';
import { GlobalStyle } from './Styled/GlobalStyles.styled';

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
    // console.log(this.state.loggedIn)

    getTracks()
      .then((response) => {
        if (response.result === 'bad') {
          this.handleOnClickLogin()
        }
        if (response.result = 'ok') {
          this.setState({ songs: response.songs })
          // console.log(response.songs.map((songobj) =>
          //   songobj.track.name
          // ))
          return response.songs
        }
      }).catch(error => {
        this.setState({ applicationError: error.response })
      })
  }


  //generate <NotLoggedIn>js or <LoggedIn>js and create action to next page
  render() {
    return (this.state.applicationError ? (<h1>Application error <GlobalStyle />: {this.state.applicationError.statusText}</h1>) : (
      <>
        <GlobalStyle />
        <div className="App">

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
      </>
    ));
  }
}

export default App;
