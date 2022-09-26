import { createGlobalStyle } from "styled-components";
import { PrimaryColor, SecondaryColor, TernaryColor, QuaternaryColor, BackgroundColor, GradientStart, GradientStop, ButtonShadow, HoverColor } from "./Colors.styled";
export const GlobalStyle = createGlobalStyle`
* {
  font-family: 'Gill Sans', 'Gill Sans MT', Calibri, 'Trebuchet MS', sans-serif;
  -webkit-touch-callout: none;
  /* iOS Safari */
  -webkit-user-select: none;
  /* Safari */
  -khtml-user-select: none;
  /* Konqueror HTML */
  -moz-user-select: none;
  /* Old versions of Firefox */
  -ms-user-select: none;
  /* Internet Explorer/Edge */
  user-select: none;
  /* Non-prefixed version, currently
                                supported by Chrome, Edge, Opera and Firefox */


}

 .App {
  height: 100vh;
  width: 100vw;
  /* background-color: ${BackgroundColor}; */
  overflow: hidden;
  z-index: -1;
}

.cover-container{
  position: fixed;
  top:0px;
  z-index: -1;
}

.foreground {
  height: calc(100vh - 61px);
  width: 100%;
  overflow-y: scroll;
  text-align: center;
  

}

.Content{
  width: 100%;
  max-width: 1500px;
  display: inline-block;
  margin-top: 30px;
  /* text-align: justify; */

}

.loader{
  position: inherit;
  top: 50%;
  left:50%;
}
/*
.App {
  text-align: center;
  background-color: ${BackgroundColor};
  width: 100vw;
  height: 100vh;
}

.App-logo {
  height: 40vmin;
  pointer-events: none;
}

@media (prefers-reduced-motion: no-preference) {
  .App-logo {
    animation: App-logo-spin infinite 20s linear;
  }
}

.App-header {
  background-color: ${BackgroundColor};
  /*min-height: 120vh;'*'/
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  font-size: calc(10px + 2vmin);
  color: white;

}

.App-link {
  color: ${BackgroundColor};
}



.mainContainer {
  align-self: center;
  height: 100vh;
  width: 100vw;
  align-items: center;

}

.albumArtContainer {
  width: 90%;
  display: flex;
  flex-direction: row;

}

.Button {
  font-family: "Roboto", sans-serif;
  font-weight: 1000;
  font-size: medium;
  cursor: pointer;
  transition: transform 0.3s ease;
  border-radius: 20px;
  opacity: 90%;
  background: linear-gradient(10deg, ${GradientStart}, ${GradientStop});
  box-shadow: 0 4px 10px 0 ${ButtonShadow};
  height: 2.4rem;
  width: 9rem;
  min-width: 110px;
  margin: 1.5rem;
}

.Button:hover {
  transform: translateY(-3px);
  color: white;
  border: 0;

  background-color: ${HoverColor};
  box-shadow: 10px 10px 99px 6px ${ButtonShadow};
}

h1 {
  color: ${PrimaryColor};
  text-shadow: 2px 0 ${SecondaryColor}, -2px 0 ${SecondaryColor}, 0 2px ${SecondaryColor}, 0 -2px ${SecondaryColor},
             1px 1px ${SecondaryColor}, -1px -1px ${SecondaryColor}, 1px -1px ${SecondaryColor}, -1px 1px ${SecondaryColor};
  text-align: center;

}

p{
    color: ${TernaryColor};
    text-shadow: 1px 1px 1px black;
    text-align: center;
}
.animated {
  -webkit-animation: fadein 0.7s;
  /* Safari, Chrome and Opera > 12.1 *'/
  -moz-animation: fadein 0.7s;
  /* Firefox < 16 *'/
  -ms-animation: fadein 0.7s;
  /* Internet Explorer *'/
  -o-animation: fadein 0.7s;
  /* Opera < 12.1 '*'/
  animation: fadein 0.7s;
}

@keyframes fadein {
  from {
    opacity: 0;
  }

  to {
    opacity: 1;
  }
}

/* Firefox < 16 '*'/
@-moz-keyframes fadein {
  from {
    opacity: 0;
  }

  to {
    opacity: 1;
  }
}

/* Safari, Chrome and Opera > 12.1 '*'/
@-webkit-keyframes fadein {
  from {
    opacity: 0;
  }

  to {
    opacity: 1;
  }
}

/* Internet Explorer '*'/
@-ms-keyframes fadein {
  from {
    opacity: 0;
  }

  to {
    opacity: 1;
  }
}

/* Opera < 12.1 '*'/
@-o-keyframes fadein {
  from {
    opacity: 0;
  }

  to {
    opacity: 1;
  }
}

.camera {
  margin: 1vh;
}

.logged-container {
  /* margin-top: 3%; '*'/
  height: 100vh;
  width: 100vw;
} */

`