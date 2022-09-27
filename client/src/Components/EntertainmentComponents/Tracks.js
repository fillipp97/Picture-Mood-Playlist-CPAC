import { Component } from "react";
import TrackBalls from "./TrackBalls";
import "./Tracks.css"
import FadeInLefth1 from "../../Styled/FadeInLefth1.styled";
import FadeInLefth2 from "../../Styled/FadeInLefth2.styled";
class Tracks extends Component {
    constructor(props) {
        super(props)
        this.state = {
            tracks: [],
            showSecond: false
        }
    }

    componentDidMount() {
        this.displayTimer(4000)
    }
    displayTimer = (delay) => {
        setTimeout(() => {
            this.setState({ showSecond: true })
        }, delay) // delay
    }
    render() {
        console.log(this.props.tracks)
        return (
            <div className="tracksChoice">
                <FadeInLefth1 text={"Finally select two tracks"}></FadeInLefth1>
                {this.state.showSecond && <FadeInLefth2 text={"Don't worry, you can play with the balls by using the right button of the mouse"}></FadeInLefth2>}
                {this.props.tracks.length > 0 && this.state.tracks.length < 3 && <TrackBalls onClickCallback={this.ballClicked} songs={this.props.tracks} />}
            </div>
        )
    }

}

export default Tracks