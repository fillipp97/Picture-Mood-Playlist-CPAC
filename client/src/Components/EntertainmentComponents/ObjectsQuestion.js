import { Component } from "react";
import FadeInLefth1 from "../../Styled/FadeInLefth1.styled"
import FadeInLefth2 from "../../Styled/FadeInLefth2.styled";
import FadeInLefth3 from "../../Styled/FadeInLefth3.styled";
import FadeInLeftp from "../../Styled/FadeInLeftp.styled";

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
                    {objects.map((object) => { return <button className="objectButton">{object}</button> })}
                </div>


            </div>

        );
    }

}
export default ObjectsQuestion