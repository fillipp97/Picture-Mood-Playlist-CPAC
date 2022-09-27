import { Component } from "react";
import FadeInLefth1 from "../../Styled/FadeInLefth1.styled";

class Objects extends Component {
    constructor(props) {
        super(props)
    }

    render() {
        console.log(this.props.objects)
        return (
            <div className="objectsContainer">
                <FadeInLefth1 text="Objects not Implemented" />
                {this.props.objects.map((object) => { return <div style={{ height: "20px", width: "30px", backgroundColor: "blue" }}>object</div> })}
            </div>

        )
    }

}

export default Objects