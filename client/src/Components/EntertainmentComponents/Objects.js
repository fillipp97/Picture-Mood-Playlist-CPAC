import { Component } from "react";
import FadeInLefth1Group from "../../Styled/FadeInLefth1Group.styled";
import ObjectsQuestion from "./ObjectsQuestion";
class Objects extends Component {
    constructor(props) {
        super(props)
        this.state = {
            selectedObjects: [],
            objectsDivided: [],
            enoughObjects: -1,
            step: 0,
            sentencesStep: 0,
            introduction: ["I See something in this picture", "Maybe you can help me..."]
        }
    }

    componentDidMount() {
        this.divideObjects(this.props.objects)
        this.intervalSetSentencesStep()

    }

    componentDidUpdate() {
        if (this.state.sentencesStep === this.state.introduction.length) {
            clearInterval(this.state.interval)

        }
    }
    divideObjects = (objects) => {

        if (objects.length < 2) {
            // No questions
            this.props.objectsToEntertainment(this.state.selectedObjects)
            this.props.incrementStepper(0)
        } else {
            // Two questions with two objects
            let slices = []
            var i = 0
            while (i < objects.length - 2) {

                slices.push(objects.slice(i, i + 2))
                i = i + 2
            }
            let ind0 = Math.floor(Math.random() * slices.length)
            let ind1 = Math.floor(Math.random() * slices.length)
            this.setState({ objectsDivided: [slices[ind0], slices[ind1]] },)

            return slices
        }
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
    pushObject = (object) => {
        let { selectedObjects } = this.state
        selectedObjects.push(object)
        this.setState({ selectedObjects: selectedObjects }, () => {
            console.log("Chosen ObjectsselectedObjects Up to Now: ", selectedObjects)
            if (this.state.selectedObjects.length === 2) {
                this.props.objectsToEntertainment(this.state.selectedObjects)
            }
        })
    }

    intervalSetSentencesStep = () => {
        this.setState({
            interval: setInterval(() => {
                this.setSentencesStep()
            }, 3000)
        })
    }

    setSentencesStep = () => {
        this.setState({ sentencesStep: this.state.sentencesStep + 1 })
    }
    incrementStep = () => {
        this.setState({ step: this.state.step + 1 })
    }
    render() {
        let { objectsDivided, step } = this.state
        let { sentences } = this.props
        let shuffledSentences = this.shuffle(sentences)

        let shuffledObjects = this.shuffle(objectsDivided)

        return (
            <div className="objectsContainer">

                {step === 0 && <FadeInLefth1Group text={this.state.introduction} step={this.state.sentencesStep} setStep={this.setSentencesStep} delay={2000} goOn={this.incrementStep} />}
                {step === 1 && <ObjectsQuestion sentence={shuffledSentences.pop()} objects={shuffledObjects.pop()} returnResult={this.pushObject} />}
                {step === 2 && <ObjectsQuestion sentence={shuffledSentences.pop()} objects={shuffledObjects.pop()} returnResult={this.pushObject} />}

            </div>

        )
    }

}

export default Objects