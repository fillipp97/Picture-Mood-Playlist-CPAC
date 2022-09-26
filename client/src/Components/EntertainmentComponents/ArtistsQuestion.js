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
        }
    }

    componentDidMount() {
        console.log("ArtistsQuestion Props", this.props)
        if (this.props.sentence.r.length !== 0) {
            this.setState({ answerIsArtist: false, artists: this.props.artists(this.props.sentence.q) }, (state) => console.log(state))
            console.log("Answer Buttons Are Required, not yet implemented")
        } else {
            this.setState({ answerIsArtist: true, artists: this.props.artists(this.props.sentence.q) }, (state) => console.log(state))
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

    render() {
        let { sentence } = this.props
        let { answerIsArtist, artists } = this.state
        return (
            <div className="question">
                {answerIsArtist && artists !== undefined && <div className="artistAnswer">
                    <FadeInLefth1 text={this.replaceArtists(sentence.q, artists)} />
                    <div className="artistsButtons">
                        {artists.map((artist, key) => { return <ArtistButton key={key} artist={artist} /> })}
                    </div>
                </div>}
                {!answerIsArtist && artists !== undefined && <div className="textAnswer">
                    <FadeInLefth1 text={this.replaceArtists(sentence.q, artists)} />
                    {sentence.r.map((text) => { return <button className="textButton" >{text}</button> })}

                </div>}

            </div>

        );
    }

}
export default ArtistsQuestion