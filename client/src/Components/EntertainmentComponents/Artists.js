import { Component } from "react";
import "./Artists.css"
import ArtistsQuestion from "./ArtistsQuestion";
class Artists extends Component {
    constructor(props) {
        super(props)
        this.state = {
            step: -1,
            questionsNumber: 1,
            artists: []
        }
    }

    componentDidMount() {
        this.setState({ artists: this.shuffle(this.props.artists) })
        this.displayNextTimer(500)
    }
    displayNextTimer = (delay) => {
        setTimeout((delay) => {
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
    getArtists = (sentence) => {
        console.log("Lunghezza degli Artisti INGRESSO", this.state.artists.length)
        let numArtists = Math.max(sentence.split("-").length - 1, 2)
        let artists = []
        for (let i = 0; i < numArtists; i++) {
            artists.push(this.state.artists.pop())
        }
        console.log("The selected artists are: ", artists)
        console.log("Lunghezza degli Artisti", this.state.artists.length)
        return artists
    }
    render() {
        let { step } = this.state
        let { artists, sentences, incrementStepper } = this.props
        let shuffledSentences = this.shuffle(sentences)
        let shuffledArtists = this.shuffle(artists)
        return (
            <div className="artists">
                {step === 0 && <ArtistsQuestion sentence={shuffledSentences.pop()} artists={this.getArtists}></ArtistsQuestion>}
            </div>
        )
    }

}

export default Artists