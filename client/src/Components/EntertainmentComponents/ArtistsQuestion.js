import { Component } from "react";
import FadeInLefth1 from "../../Styled/FadeInLefth1.styled"
import FadeInLefth2 from "../../Styled/FadeInLefth2.styled";
import FadeInLefth3 from "../../Styled/FadeInLefth3.styled";
import FadeInLeftp from "../../Styled/FadeInLeftp.styled";
import ArtistButton from "./ArtistButton"
import "./ArtistsQuestion.css"
class ArtistsQuestion extends Component {
    constructor(props) {
        super(props)
        this.state = {
            answerIsArtist: undefined,
            renderok: true
        }
    }

    componentDidMount() {

        if (this.props.sentence.r.length !== 0) {
            this.setState({ answerIsArtist: false, artists: this.props.artists(this.props.sentence.q) })

        } else {
            this.setState({ answerIsArtist: true, artists: this.props.artists(this.props.sentence.q) })
        }
    }

    replaceArtists = (sentence, artists) => {
        console.log("Artisti INGRESSO replaceArtists", artists)
        let numArtists = sentence.split("-").length - 1
        let newSentence
        if (numArtists !== 0) {
            newSentence = sentence
            for (let i = 0; i < numArtists; i++) {
                newSentence = newSentence.replace(/-/, artists[i].name)
            }
            return newSentence
        } else if (numArtists === 0) {
            let newSentence = sentence
            return newSentence
        }

    }

    componentDidUpdate(prevProps) {
        if (this.props.artists !== prevProps.artists) {
            this.setState({ renderok: true })
        }

    }

    sendArtistToParent = (artist) => {
        this.setState({ renderok: false })
        this.props.artistCallback(artist)
        this.props.displayNext()

        if (this.props.incrementStepper !== undefined) {
            this.props.incrementStepper()

        }
    }

    clickedText = (text, artist) => {
        if (text === this.props.sentence.r[0]) {
            // Positive answer
            this.sendArtistToParent(artist)
        } else if (text === this.props.sentence.r[1]) {


            if (this.props.incrementStepper !== undefined) {
                this.props.incrementStepper()

            } else {
                this.props.displayNext()
            }
        }
    }

    render() {
        let { sentence } = this.props
        let { answerIsArtist, artists, renderok } = this.state
        return (
            <div className="question">
                {renderok && <>{answerIsArtist && artists !== undefined && sentence !== undefined && <div className="artistAnswer">
                    <FadeInLefth1 text={this.replaceArtists(sentence.q, artists)} />
                    <div className="artistsButtons">
                        {artists.map((artist, key) => { return <ArtistButton key={key} artist={artist} returnArtist={() => this.sendArtistToParent(artist)} /> })}
                    </div>
                </div>}
                    {!answerIsArtist && artists !== undefined && sentence !== undefined && <div className="textAnswer">
                        <FadeInLefth1 text={this.replaceArtists(sentence.q, artists)} />
                        {sentence.r.map((text, key) => { return <button className="textButton" onClick={() => this.clickedText(text, artists[0])} key={key}>{text}</button> })}

                    </div>}</>}

            </div>

        );
    }

}
export default ArtistsQuestion