import { Component } from "react";
import FadeInLefth1 from "../../Styled/FadeInLefth1.styled";
import FadeInLefth2 from "../../Styled/FadeInLefth2.styled";
import FadeInLefth3 from "../../Styled/FadeInLefth3.styled";

class Quotations extends Component {
    constructor(props) {
        super(props)
        this.state = {
            step: -1,
            index: Math.floor(Math.random() * props.sentences[props.mood].length),
            indexRes: Math.floor(Math.random() * props.sentences[props.mood + "_res"].length)
        }
    }

    componentDidMount() {
        this.displayNextTimer(500)
    }
    displayNextTimer = (delay) => {
        setTimeout((delay) => {
            this.setState({ step: this.state.step + 1 })
        }, delay) // delay
    }

    render() {
        let { mood, sentences } = this.props
        let { index, indexRes, step } = this.state
        return (


            <div className="quotations">
                {step >= 0 && <FadeInLefth1 className="citation" text={sentences[mood][index][0]} callbacks={step === 0 ? [() => this.displayNextTimer(3000)] : undefined} />}
                {step >= 1 && <FadeInLefth2 className="author" text={sentences[mood][index][1]} callbacks={step === 1 ? [() => this.displayNextTimer(4000)] : undefined} />}
                {step >= 2 && <span style={{ position: "relative", top: "10px" }}><FadeInLefth3 className="res" text={sentences[mood + "_res"][indexRes]} callbacks={step === 2 ? [() => this.props.incrementStepper(5000), () => this.displayNextTimer(4900)] : undefined} /></span>}
            </div>

        )
    }


}

export default Quotations