import { Component } from "react";
import './NotLoggedIn.css'
import FadeInLeftp from "../Styled/FadeInLeftp.styled";
import FadeInLefth1 from "../Styled/FadeInLefth1.styled";

class NotLoggedIn extends Component {

    render() {
        return (
            <div className="NotLoggedInContainer">

                <img className="img-spotify" src="SpotifyWhite.png" />

                <div className="div-body">
                    <FadeInLefth1 text="Picture-Mood-Playlist." />
                    <FadeInLeftp text="You picure... We playlist" />
                    <button className="button-login" onClick={this.props.onClick}>LOGIN</button>
                </div>

                <div className="div-wave">
                    <span className="wave"></span>
                    <span className="wave"></span>
                    <span className="wave"></span>
                    <span className="wave"></span>
                    <span className="wave"></span>
                    <span className="wave"></span>
                    <span className="wave"></span>
                </div>

            </div>
        )

    }
}


export default NotLoggedIn