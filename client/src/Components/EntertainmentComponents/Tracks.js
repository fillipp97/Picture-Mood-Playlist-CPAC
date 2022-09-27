import { Component } from "react";
import TrackBalls from "./TrackBalls";
import "./Tracks.css"
import FadeInLefth1 from "../../Styled/FadeInLefth1.styled";
import FadeInLefth2 from "../../Styled/FadeInLefth2.styled";
import TracksSelect from "./TracksSelect";
class Tracks extends Component {
    constructor(props) {
        super(props)
        this.state = {
            selectedTracks: [],
            showSecond: false,
            step: 0,
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

    showNext = (delay) => {
        setTimeout(() => {
            this.setState({ step: this.state.step + 1 })
        }, delay) // delay
    }

    ballClicked = (song) => {
        let { tracks } = this.state
        tracks.push(song)
        this.setState({ selectedtracks: tracks }, () => { console.log("Tracks State", this.state.tracks) })
    }

    sendStateToParent = (update) => {
        this.props.tracksToEntertainment(update)
        this.props.incrementStepper()
    }
    render() {
        let { step } = this.state
        console.log("Tracks Step", step)
        return (
            <div className="tracksChoice">
                {step >= 0 && <><FadeInLefth1 text={"Finally select two tracks"} callbacks={[() => this.showNext(4000)]}></FadeInLefth1></>}
                {/* {this.state.showSecond && <FadeInLefth2 text={"Don't worry, you can play with the balls by using the wheel button of the mouse"}></FadeInLefth2>}
                {this.props.tracks.length > 0 && this.state.selectedTracks.length < 2 && <TrackBalls sendTrackToParent={this.ballClicked} songs={this.props.tracks} />} */}
                {step >= 1 && <TracksSelect songs={this.props.tracks} sendStateToParent={this.sendStateToParent}></TracksSelect>}
            </div>
        )
    }

}

export default Tracks