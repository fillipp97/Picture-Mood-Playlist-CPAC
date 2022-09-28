import { Component } from "react";
import Objects from "./EntertainmentComponents/Objects";
import Quotations from "./EntertainmentComponents/Quotations";
import Artists from "./EntertainmentComponents/Artists";
import Tracks from "./EntertainmentComponents/Tracks";
import "./Entertainment.css"
import ForegroundChange from "../Styled/ForegroundChange.styled";
import ButtonComp from "../Styled/Button.styled";
import FadeInLefth1 from "../Styled/FadeInLefth1.styled";
class Entertainment extends Component {
    constructor(props) {
        super(props)
        this.state = {
            step: -1,
            sentences: {
                'mood': {
                    'angry': [["Don’t waste your time in anger, regrets, worries, and grudges. Life is too short to be unhappy.", "Roy T. Bennett"], ["Angry people are not always wise.", "Jane Austen, Pride and Prejudice"], ["The best fighter is never angry.", "Lao Tzu"], ["When angry, count four. When very angry, swear.", "Mark Twain"], ["Whatever is begun in anger ends in shame.", "Benjamin Franklin"]],
                    'angry_res': ["But let me help you in facing your anger problems", "But we are here to feed your anger like no one before"],
                    'contempt': [["Nothing living should ever be treated with contempt.", "Elizabeth Goudge"], ["The way to be really despicable is to be contemptuous of other people's pain.", "James Baldwin"]],
                    'contempt_res': ["But sometimes a little of it is allowed"],
                    'disgusted': [["I couldn't get if you're disgusted by society or by this wonderful application"], ["Do you think anything can be more disgusting than love?"]],
                    'disgusted_res': ["Anyway... Pure disgusting music is coming", "Let me search the most disgusting music I can find..."],
                    'fearful': [["Fear doesn't shut you down; it wakes you up", "Veronica Roth"], ["Don't be afraid of your fears. They're not there to scare you. They're there to let you know that something is worth it.", "C. JoyBell C."], ["Expose yourself to your deepest fear; after that, fear has no power.", "Jim Morrison"]],
                    'fearful_res': ["Here's a creepy playlist for you"],
                    'happy': [["It is ridiculous to think that somebody else can make you happy or unhappy.", "Buddha"], ["Let us dance in the sun, wearing wild flowers in our hair...", "Susan Polis Schutz"], ["If you have good thoughts they will shine out of your face like sunbeams and you will always look lovely.", "Roald Dahl"]],
                    'happy_res': ["Today we will remain happy and carefree", "Let's be happy together!"],
                    'neutral': [["I see you neutral like Switzerland.", "Sistine Stallone"]],
                    'neutral_res': ["As you decide... Let me create a playlist to help you think"],
                    'sad': [["Our sweetest songs are those that tell of saddest thought.", "Percy Bysshe Shelley"], ["Music expresses that which cannot be put into words and that which cannot remain silent", "Victor Hugo"]],
                    'sad_res': ["I'll try to express your feelings", "A super sad playlist is coming to keep you company"],
                    'surprised': [["The secret to humor is surprise.", "Aristotele"], ["Sometimes people surprise us. Sometimes AI does.", "Joyce Carol Oates"]],
                    'surprised_res': ["Nothing is more surprising than our playlist!"],
                },
            },
            questions: {
                "objects": ['Sometimes I really feel like a ______', 'Three things really matter in life, they are Love, Beer and ______', "It would be great to be killed by a ______", "Give me a ______ and I'll lift the world", "I swear I saw a flying ______"],
                "artists": [{ q: "Who would you invite to a romantic candlelight dinner?", "r": [] }, { q: "Who sings better between - and -?", r: [] }, { q: "Do you prefer a - or - concert?", r: [] }, { q: "Between - and -, who do you prefer not to listen to?", r: [] }, { q: "Who would you rather share a room with?", r: [] }, { q: "Who do you prefer being stuck in the elevator with, - or -?", r: [] }, { q: "Would you rather live with - or -?", r: [] }, { q: "Who would you give the last parachute to?", r: [] }, { q: "would you like to play with -?", r: ["Immediatly!", "Not a chance"] }, { q: "Do you like -'s songs?", r: ["Yes", "No"] }, { q: "Does -'s music makes sense to you?", r: ["Yes", "Why? Should it?"] }, { q: "Would you go live with -?", r: ["Immediatly", "Rather I remain alone"] }, { q: "Going to a concert and hold - while stage diving", r: ["I would do it!", "No, why should I?"] }, { q: "Do you like -'s hair?", r: ["They are fabulous", "Mine are better"] }, { q: "Do you want to do a duet with -?", r: ["Yes, it's my dream", "Nah, I'm a soloist"] }, { q: "Would you wear -'s clothes?", r: ["I coould try them", "Mine are better"] }, { q: "Would you jump off a bridge for -?", r: ["For him/her this and more", "Hell NO!"] }, { q: "Do you feel more - or -?", r: [] }, { q: "How about dating -?", r: ["Hell Yeah", "Absolutely not"] }, { q: "Who will you save from a fire?", r: [] }, { q: "Who would you like to be your parent 1?", r: [] }],
                "tracks": ["You seem to like many songs... Tell me your favourite two", "Final step... Let's see if you can rate your favourite songs!", "Finally select two tracks"]
            },
            selectedArtists: [],
            selectedTracks: [],
            selectedObjects: []
        }
    }
    componentDidUpdate() {

        if (this.state.step === 5) {
            this.props.incrementFirstFilterStep()
        }
    }
    componentDidMount() {

        if (this.props.mood) {
            this.setState({ step: 0 }) // Quotations only when face is present
        } else {
            this.setState({ step: 1 }) // Objects selection only when face is not present
        }
        // ForegroundChange("foreground", 500, "darken")
    }

    incrementStepper = (delay) => {
        setTimeout(() => { this.setState({ step: this.state.step + 1 }, () => { console.log("Entertainment step", this.state.step) }) }, delay)
    }
    incrementStepperQuotations = (delay) => {
        setTimeout(() => { this.setState({ step: this.state.step + 2 }, () => { console.log("Entertainment step", this.state.step) }) }, delay)
    }
    setSelectedArtists = (selectedArtists) => {
        console.log("SELECTED ARTISTS", selectedArtists)
        this.props.updateSelectedArtists(selectedArtists)
        // this.setState({ selectedArtists: selectedArtists })
    }
    setSelectedTracks = (selectedTracks) => {
        this.props.updateSelectedTrack(selectedTracks)
        // this.setState({ selectedTracks: selectedTracks })
    }

    setSelectedObjects = (selectedObjects) => {
        this.props.updateSelectedObjects(selectedObjects)
        // this.setState({ selectedObjects: selectedObjects })
    }
    render() {
        let { mood, moodLLF, objects, artists, tracks } = this.props
        let { step } = this.state

        return (
            <div className="entertainment">

                {step === 0 && <Quotations mood={mood} sentences={this.state.sentences.mood} incrementStepper={this.incrementStepper} objectsToEntertainment={this.setSelectedObjects} />}
                {step === 1 && <FadeInLefth1 text={"Now... Let us know you better"} callbacks={mood ? [() => this.incrementStepperQuotations(3000)] : [() => this.incrementStepper(3000)]}></FadeInLefth1>}
                {step === 2 && objects !== undefined && <Objects objects={objects} sentences={this.state.questions.objects} incrementStepper={this.incrementStepper} objectsToEntertainment={this.setSelectedObjects} />}
                {step === 3 && <Artists artists={artists} sentences={this.state.questions.artists} incrementStepper={this.incrementStepper} artistsToEntertainment={this.setSelectedArtists} />}
                {step === 4 && <Tracks tracks={tracks} sentences={this.state.questions.tracks} incrementStepper={this.incrementStepper} tracksToEntertainment={this.setSelectedTracks} />}

            </div>
        )
    }



}

export default Entertainment