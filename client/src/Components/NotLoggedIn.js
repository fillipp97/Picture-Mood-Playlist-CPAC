import { Component } from "react";
import './NotLoggedIn.css'
import FadeInLeftp from "../Styled/FadeInLeftp.styled";
import FadeInLefth1 from "../Styled/FadeInLefth1.styled";
class NotLoggedIn extends Component {

    render() {
        return (
            <div className="NotLoggedInContainer">

                <FadeInLefth1 text="Picture-Mood-Playlist" />
                <FadeInLeftp text="Welcome to our app, this is an app created by YanYan, Haokun Song and Pippo. This is just a test!!" />
                <button className="Button animated" onClick={this.props.onClick}>LOGIN</button>
            </div>
        )

    }
}


export default NotLoggedIn