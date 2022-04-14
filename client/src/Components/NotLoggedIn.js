import { Component } from "react";
import './NotLoggedIn.css'

class NotLoggedIn extends Component{

render(){   
        return(
       
            <div className="NotLoggedInContainer">            
            
            <h1>Picture-Mood-Playlist</h1>
            <p>Welcome to our app, this is an app created by JanJan, Haokun Song and Pippo. This is just a test!!</p>

            <button className="Button" onClick={this.props.onClick}>LOGIN</button>
            </div>           
            )

}
}


export default NotLoggedIn