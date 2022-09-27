import { Component } from "react";
import "./TrackButton.css"
class TrackButton extends Component {
    constructor(props) {
        super(props)
        this.state = {
            showName: false
        }
    }

    setShowName = (showName) => {
        this.setState({ showName: showName === "true" ? true : false })
    }




    onImageClick = () => {

        this.props.updateState(this.props.song, this.props.index)
    }

    render() {

        return (

            <div className="trackButtonContainer">
                <img className={this.props.disabled ? "trackButtonImage" : "trackButtonImageDisabled"} id={this.props.id} onMouseOver={() => this.setShowName("true")} onMouseOut={() => this.setShowName("false")} src={this.props.song.album.images[1].url} onClick={this.onImageClick} />
                {this.state.showName && <div className="trackButtonText">{this.props.song.name}</div>}
            </div >

        )
    }





}

export default TrackButton