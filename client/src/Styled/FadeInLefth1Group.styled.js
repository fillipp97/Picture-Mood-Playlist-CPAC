import React from "react"
import styled, { keyframes } from "styled-components"
import { useState, useEffect } from "react";
export default function FadeInLefth1Group(props) {

    if (props.goOn !== undefined && props.text.length <= props.step) {
        props.goOn()
    }

    return (props.text.map((text, idx) => { return (props.step >= idx && <Animation key={idx}>{text}</Animation >) }
    ))

}
const animation = keyframes`
    0% { opacity: 0; left: -7px}
    100% {opacity: 1; left: 0px}
`


const Animation = styled.h1`
    opacity: 0;
    position: relative;
    animation-name: ${animation};
    animation-duration: 1s;
    animation-fill-mode: forwards;
`


