import { Component } from "react";
import "./ArtistButton.css"
class ArtistButton extends Component {
    constructor(props) {
        super(props)
        this.state = {
            showName: false
        }
    }

    setShowName = (showName) => {
        this.setState({ showName: showName === "true" ? true : false })
    }
    componentDidMount() {
        console.log(this.props)
    }
    render() {

        return (
            <div className="artistButtonContainer">
                <img className="artistButtonImage" onMouseOver={() => this.setShowName("true")} onMouseOut={() => this.setShowName("false")} src={this.props.artist.images[2].url} onClick={this.props.selectArtist} />
                {this.state.showName && <div className="artistButtonText">{this.props.artist.name}</div>}
            </div >

        )
    }





}

export default ArtistButton