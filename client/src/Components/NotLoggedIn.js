import { Component } from "react";
import './NotLoggedIn.css'
import FadeInLeft from "../Styled/FadeIn.styled";
class NotLoggedIn extends Component {

    render() {
        return (
            <div className="NotLoggedInContainer">

                <h1 className="animated">Picture-Mood-Playlist</h1>
                <FadeInLeft text="Welcome to our app, this is an app created by YanYan, Haokun Song and Pippo. This is just a test!!" />
                <button className="Button animated" onClick={this.props.onClick}>LOGIN</button>
            </div>
        )

    }
}


export default NotLoggedIn