import { Component } from "react";
import FadeInLefth1 from "../../Styled/FadeInLefth1.styled"


import "./ObjectsQuestion.css"


class ObjectsQuestion extends Component {
    constructor(props) {
        super(props)
        this.state = {

        }
    }




    render() {
        let { sentence, objects } = this.props
        return (
            <div className="objectsQuestion">
                <FadeInLefth1 text={sentence}></FadeInLefth1>
                <div className="objectsButtons">
                    {objects.map((object, key) => { return <button key={key} className="objectButton" onClick={() => this.props.returnResult(object)}>{object}</button> })}
                </div>


            </div>

        );
    }

}
export default ObjectsQuestion