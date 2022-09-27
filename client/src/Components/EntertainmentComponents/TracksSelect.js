import { Component } from "react";
import TrackBalls from "./TrackBalls";
import "./Tracks.css"
import FadeInLefth1 from "../../Styled/FadeInLefth1.styled";
import FadeInLefth2 from "../../Styled/FadeInLefth2.styled";
import TrackButton from "./TrackButton";
class TracksSelect extends Component {
    constructor(props) {
        super(props)
        this.state = {
            selectedTracks: [],
            selectedButtons: Array(this.props.songs.length).fill(0),
        }
    }

    updateState = (track, index) => {
        let { selectedTracks, selectedButtons } = this.state
        selectedButtons[index] = !selectedButtons[index]
        if (selectedButtons[index]) {
            selectedTracks.push(track)
            this.setState({ selectedTracks: selectedTracks, selectedButtons: selectedButtons })
        } else if (!selectedButtons[index]) {
            let index = selectedTracks.indexOf(track)
            selectedTracks.splice(index, 1)
            this.setState({ selectedTracks: selectedTracks, selectedButtons: selectedButtons })
        }

    }
    render() {

        return (
            <div className="trackSelection">
                {this.props.songs.map((song, idx) => <TrackButton song={song} key={song.id} id={song.id} index={idx} disabled={this.state.selectedButtons[idx]} updateState={this.updateState} />)}
                <button disabled={this.state.selectedTracks.length !== 2} onClick={() => this.props.sendStateToParent(this.state.selectedTracks)}>Submit Tracks</button>
            </div>)
    }
}


export default TracksSelect