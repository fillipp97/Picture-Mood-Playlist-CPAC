import { Component } from "react";
import "./Artists.css"
import ArtistsQuestion from "./ArtistsQuestion";
class Artists extends Component {
    constructor(props) {
        super(props)
        this.state = {
            step: -1,
            questionsNumber: 1,
            selectedArtists: [],
            artists: []
        }
    }

    componentDidMount() {
        this.setState({ artists: this.shuffle(this.props.artists) })
        this.displayNextTimer(500)
    }
    displayNextTimer = (delay) => {
        setTimeout(() => {
            this.setState({ step: this.state.step + 1 })
        }, delay) // delay
    }

    shuffle = (a) => {
        var j, x, i;
        for (i = a.length - 1; i > 0; i--) {
            j = Math.floor(Math.random() * (i + 1));
            x = a[i];
            a[i] = a[j];
            a[j] = x;
        }
        return a;
    }

    pushArtist = (artist) => {
        let { selectedArtists } = this.state
        selectedArtists.push(artist)
        this.setState({ selectedArtists: selectedArtists }, () => {
            console.log("Chosen Artists Up to Now: ", selectedArtists)
            if (this.state.selectedArtists.length === 2) {
                this.props.artistsToEntertainment(this.state.selectedArtists)
            }
        })
    }
    getArtists = (sentence) => {

        let numArtists = Math.max(sentence.split("-").length - 1, 2)

        let artists = []

        for (let i = 0; i < numArtists; i++) {
            artists.push(this.state.artists.pop())
        }

        return artists
    }
    render() {
        let { step } = this.state
        let { sentences, incrementStepper } = this.props
        let shuffledSentences = this.shuffle(sentences)

        return (
            <div className="artists">
                {step === 0 && <ArtistsQuestion sentence={shuffledSentences.pop()} artists={this.getArtists} artistCallback={this.pushArtist} displayNext={() => this.displayNextTimer(1000)}></ArtistsQuestion>}
                {step === 1 && <ArtistsQuestion sentence={shuffledSentences.pop()} artists={this.getArtists} artistCallback={this.pushArtist} displayNext={() => this.displayNextTimer(1000)} incrementStepper={() => incrementStepper(1000)}></ArtistsQuestion>}
            </div>
        )
    }

}

export default Artists