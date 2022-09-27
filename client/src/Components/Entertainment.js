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
                    'angry': [["Don’t waste your time in anger, regrets, worries, and grudges. Life is too short to be unhappy.", "Roy T. Bennett"], ["Angry people are not always wise.", "Jane Austen, Pride and Prejudice"], ["The best fighter is never angry.", "Lao Tzu"], ["When angry, count four. When very angry, swear.", "Mark Twain"]],
                    'angry_res': ["But let me help you in facing your anger problems", "But we are here to feed your anger like no one before"],
                    'contempt': [["Nothing living should ever be treated with contempt.", "Elizabeth Goudge"]],
                    'contempt_res': ["But sometimes a little of it is allowed"],
                    'disgusted': [["I couldn't get if you're disgusted by society or by this wonderful application"], []],
                    'disgusted_res': ["Anyway... Pure disgusting music is coming"],
                    'fearful': [["Fear doesn't shut you down; it wakes you up", "Veronica Roth"], ["Don't be afraid of your fears. They're not there to scare you. They're there to let you know that something is worth it.", "C. JoyBell C."], ["Expose yourself to your deepest fear; after that, fear has no power.", "Jim Morrison"]],
                    'fearful_res': ["Here's a creepy playlist for you"],
                    'happy': [["It is ridiculous to think that somebody else can make you happy or unhappy.", "Buddha"]],
                    'happy_res': ["I'll be this somebody to you today"],
                    'neutral': [["I see you neutral like Switzerland.", "Sistine Stallone"]],
                    'neutral_res': ["As you decide... Let me create a playlist to help you think"],
                    'sad': [["Our sweetest songs are those that tell of saddest thought.", "Percy Bysshe Shelley"], ["Music expresses that which cannot be put into words and that which cannot remain silent", "Victor Hugo"]],
                    'sad_res': ["I'll try to express your feelings"],
                    'surprised': [["The secret to humor is surprise.", "Aristotele"], ["Sometimes people surprise us. Sometimes AI does.", "Joyce Carol Oates"]],
                    'surprised_res': ["Nothing is more surprising than our playlist!"],
                },
            },
            questions: {
                "objects": ['Sometimes I really feel like a ______', 'Three things really matter in life, they are Love, Beer and ______', "Sometimes I really feel like a ______", "It would be great to be killed by a ______", "Give me a ______ and I'll lift the world"],
                "artists": [{ "q": "Do you feel more - or -?", "r": [] }, { "q": "How about dating -?", "r": ["Hell Yeah", "Absolutely not"] }, { "q": "Who will you save from a fire?", "r": [] }, { "q": "Who would you like to be your parent 1?", "r": [] }],
                "tracks": ["You seem to like many songs... Tell me your favourite ones", "Final step... Let's see if you can rate your favourite songs!"]
            },
            selectedArtists: [],
            selectedTracks: [],
            selectedObjects: []
        }
    }

    componentDidMount() {

        if (this.props.mood) {
            this.setState({ step: 0 }) // Quotations only when face is present
        } else {
            this.setState({ step: 1 }) // Objects selection only when face is not present
        }
        ForegroundChange("foreground", 500, "darken")
    }

    incrementStepper = (delay) => {
        setTimeout(() => { this.setState({ step: this.state.step + 1 }, () => { console.log("Entertainment step", this.state.step) }) }, delay)
    }
    incrementStepperQuotations = (delay) => {
        setTimeout(() => { this.setState({ step: this.state.step + 2 }, () => { console.log("Entertainment step", this.state.step) }) }, delay)
    }
    setSelectedArtists = (selectedArtists) => {
        this.setState({ selectedArtists: selectedArtists })
    }

    render() {
        let { mood, moodLLF, objects, artists, tracks } = this.props
        let { step } = this.state
        return (
            <div className="entertainment">
                {/* {step ===-1 && <FadeInLefth1 text={"Now... Let us know you better"} callbacks={()=>this.incrementStepper(2000)}></FadeInLefth1>} */}
                {step === 0 && <Quotations mood={mood} sentences={this.state.sentences.mood} incrementStepper={this.incrementStepperQuotations} />}
                {step === 1 && <Objects objects={objects} sentences={this.state.questions.objects} incrementStepper={this.incrementStepper} />}
                {step === 2 && <Artists artists={artists} sentences={this.state.questions.artists} incrementStepper={this.incrementStepper} artistsToEntertainment={this.setSelectedArtists} />}
                {step === 3 && <Tracks tracks={tracks} sentences={this.state.questions.tracks} incrementStepper={this.incrementStepper} />}

            </div>
        )
    }



}

export default Entertainment