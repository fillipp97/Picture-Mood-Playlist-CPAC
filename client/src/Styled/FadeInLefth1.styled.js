import React from "react"
import styled, { keyframes } from "styled-components"

export default function FadeInLefth1(props) {
    if (props.callbacks !== undefined) {
        if (props.callbacks.length > 0) {
            for (let i = 0; i < props.callbacks.length; i++) {
                props.callbacks[i]()
            }
        }
    }
    return <Animation>{props.text}</Animation>
}
const animation = keyframes`
    0% { opacity: 0; left: -7px}
    100% {opacity: 1; left: 0px}
`


const Animation = styled.h1`
    opacity: 0;
	/*color: rgb(246,215,171);*/
    position: relative;
    animation-name: ${animation};
    animation-duration: 1s;
    animation-fill-mode: forwards;
`


