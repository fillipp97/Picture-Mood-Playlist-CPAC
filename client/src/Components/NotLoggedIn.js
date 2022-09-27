import { Component } from "react";
import './NotLoggedIn.css'

import { useState, useEffect } from "react";
import { Container, Row, Col } from "react-bootstrap";
import headerImg from "../Components/assets/img/music5.png";
import { App, ArrowRightCircle } from 'react-bootstrap-icons';
import 'animate.css';
import TrackVisibility from 'react-on-screen';



// class NotLoggedIn extends Component{

// render(){   
//         return(
//             <div className="NotLoggedInContainer">

//             <h1 className="animated">Picture-Mood-Playlist</h1>
//             <p className="animated">Welcome to our app, this is an app created by YanYan, Haokun Song and Pippo. This is just a test!!</p>

//             <button className="Button animated" onClick={this.props.onClick}>LOGIN</button>
//             </div>           
//             )

// }
// }


// export default NotLoggedIn


export const NotLoggedIn = (props) => {
    
    const [loopNum, setLoopNum] = useState(0);
    const [isDeleting, setIsDeleting] = useState(false);
    const [text, setText] = useState('');
  
    const [delta, setDelta] = useState(350 - Math.random() * 100);
    const period = 2000;
  
    const [index, setIndex] = useState(1);
    const toRotate = [ ", we provide the mood of the picture to you.", ". Enjoy it !" ];
    
  
    useEffect(() => {
      let ticker = setInterval(() => {
        tick();
      }, delta);
  
      return () => { clearInterval(ticker) };
    }, [text])
  
    const tick = () => {
      let i = loopNum % toRotate.length;
      let fullText = toRotate[i];
      let updatedText = isDeleting ? fullText.substring(0, text.length - 1) : fullText.substring(0, text.length + 1);
  
      setText(updatedText);
  
      if (isDeleting) {
        setDelta(prevDelta => prevDelta / 2);
      }
  
      if (!isDeleting && updatedText === fullText) {
        setIsDeleting(true);
        setIndex(prevIndex => prevIndex - 1);
        setDelta(period);
      } else if (isDeleting && updatedText === '') {
        setIsDeleting(false);
        setLoopNum(loopNum + 1);
        setIndex(1);
        setDelta(500);
      } else {
        setIndex(prevIndex => prevIndex + 1);
      }
    }
    

    return (
        <section className="homepage" id="home">
  
            <Container>
  
                <Row className="aligh-items-center">
  
                    {/* text */}
                    <Col xs={12} md={6} xl={7}>
                        <TrackVisibility>
                            {({ isVisible }) =>
                                <><div style={{textAlign:'left'}} className={isVisible ? "animate__animated animate__fadeIn" : ""}>
                    
                                    <span className="tagline">Welcome to Picture-Mood-Playlist</span>
  
                                    <h1 className='typewriter'>{`This is PMP`} <span className="txt-rotate" dataperiod="1000" data-rotate='[ ", we provide the mood of the picture to you.", ". Enjoy it !" ]'><span className="wrap">{text}</span></span></h1>
                    
                                    <p></p>
                                    <button onClick={props.onClick}>Log in <ArrowRightCircle size={25} /></button>
                             
                                </div>
                                    </>
                            }
                        </TrackVisibility>
                    </Col>
  
                    {/* image */}
                    <Col xs={12} md={6} xl={5}>
                        <TrackVisibility>
                            {({ isVisible }) =>
                                <div className={isVisible ? "animate__animated animate__zoomIn" : ""}>
                                    <img className="image-right" src={headerImg} alt="Header Img" />
                                </div>}
                        </TrackVisibility>
                    </Col>
  
                </Row>
  
            </Container>
  
        </section>
    )
}

  
export default NotLoggedIn
