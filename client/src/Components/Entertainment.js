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
                      
                        
                        {<h1 >{question.q}</h1>}
                        
                        {(question.r).map((res)=>{
                        return(
                        <>
                        <button className="Button" onClick={()=>this.setState({counter: (this.state.counter+1) % this.state.sentences.length})}>{res}</button>
                        </>)})}

                        
              
                      </>
    )
}



}

export default Entertainment