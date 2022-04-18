import { Component } from "react";

class Entertainment extends Component{
    constructor(props){
        super(props)
        this.state={
            sentences: [ 
                {'q':'What\'s your favourite color?',
                  'r': ['Blue', 'Green', 'Yellow', 'Red']},
                
                  { 'q': 'Why do you like it?',
                      'r': ['boh']},
                      
                { 'q': 'Do you think this app can be cooler than this?',
                      'r': ['Yes', 'No']},
                        
                {'q': 'Ok then...',
                    'r': ['Cool, let\'s see the results']}
    ],
    counter: 0,
        }
    }





render(){
 let question = this.state.sentences[this.state.counter ]
 console.log(question)
console.log(this.state.counter)
    return(
        <>
                       <div className="logged-container">
                       
                      <div className="foreground">
                        
                        {<h1 className="animated">{question.q}</h1>}
                        
                        {(question.r).map((res)=>{
                        return(
                        <>
                        <button className="Button animated" onClick={()=>this.setState({counter: (this.state.counter+1) % this.state.sentences.length})}>{res}</button>
                        </>)})}

                        </div> 
                        <div className="vignette"></div>
                        <div className="cover-container">
                        
                        {this.props.renderCovers()}
                      </div>    
                      </div>              
                      </>
    )
}



}

export default Entertainment