import { Component } from "react";
import FadeInLefth1 from "../Styled/FadeInLefth1.styled";
import ForegroundChange from "../Styled/ForegroundChange.styled";
class EntQuotations extends Component {
    constructor(props) {
        super(props)
        this.state = {
            chosen: [],
            step: -1,
            index: Math.floor(Math.random() * props.sentences[props.mood].length),
            indexRes: Math.floor(Math.random() * props.sentences[props.mood + "_res"].length)
        }
    }
    componentDidMount() {
        ForegroundChange(1000)
        this.displayNextTimer()
    }
    displayNextTimer = () => {
        setTimeout(() => {
            this.setState({ step: this.state.step + 1 })
        }, 2000) // delay
    }

    render() {
        let { mood, sentences } = this.props
        let { index, indexRes } = this.state
        return (


            <div className="quotations">

                {this.state.step >= 0 && <FadeInLefth1 className="citation" text={sentences[mood][index][0]} timer={this.displayNextTimer} />}
                {this.state.step >= 1 && <FadeInLefth1 className="author" text={sentences[mood][index][1]} timer={this.displayNextTimer} />}
                {this.state.step >= 2 && <FadeInLefth1 className="author" text={sentences[mood + "_res"][indexRes]} />}

            </div>

        )
    }


}

export default EntQuotations