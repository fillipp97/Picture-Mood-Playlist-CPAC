import React from "react";
import './Stepper.css'
export default function Stepper({ steps, callback }) {

    return (
        <Navbar>
            {steps.map((step) => (
                <NavItem key={step.name} name={step.name} icon={step.icon} disabled={!step.enabled} onClick={() => callback(step)}> </NavItem>
            ))}

        </Navbar>
    )
}


class Navbar extends React.Component {
    render() {
        return (
            <nav className="navbar">
                <ul className="navbar-nav">{this.props.children}</ul>
            </nav>
        );
    }
}



class NavItem extends React.Component {
    constructor(props) {
        super(props)

    }
    render() {
        return (
            <li className="nav-item">
                <button className="icon-button" onClick={this.props.onClick} disabled={this.props.disabled} title={this.props.name} >
                    {this.props.icon}
                </button>
            </li>
        )

    }
}