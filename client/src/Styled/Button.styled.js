import React from "react"
import styled, { keyframes } from "styled-components"

export default function ButtonComp(props) {
    return <Button onClick={props.onClick} >{props.text}</Button>
}
const animation = keyframes`
    0% { opacity: 0; }
    100% {opacity: 1;}
`


const Button = styled.button`
    opacity: 0;
    position: relative;
    animation-name: ${animation};
    animation-duration: 1s;
    animation-fill-mode: forwards;
    width: 50px;
    height: 30px;
    background-color: #484a4d;
    border-radius: 6px;
    padding: 5px;
    margin: 2px;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: filter 300ms;

    &:hover{
        filter: brightness(1.3);
    }
`