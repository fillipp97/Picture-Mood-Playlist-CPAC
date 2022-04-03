import { Component } from "react";
class Dropdown extends Component{

   constructor(props){
       super(props);

       this.state={
            options: [],
            active: false,
            selectedOpt: 4

       }
   }

   componentDidMount = ()=>{
    this.setState({options:this.props.songs})
   }

   componentDidUpdate(){
       const {active}=this.state;

       setTimeout(()=>{
        if(active){
            window.addEventListener('click', this.toggleDropdown)
         }else{
            window.removeEventListener('click', this.toggleDropdown)
    }
},0)
       
   }


   toggleDropdown = () => {
   this.setState({active: !this.state.active})
   }


   checktoggleDropdown = () => {
    if(!this.state.active){this.toggleDropdown()}
    }


   setSelectedElement = (option) =>{
       this.setState({selectedOpt: option}, ()=>this.props.afterStateSet(option));
   }

   render(){
        let {active, options}=this.state;
        console.log(this.state.songs)

            return( <>
                <div className="dropdownToggleContainer">
                    <button className="activateDropdown" 
                    onClick={this.checktoggleDropdown}>
                        {this.state.selectedOpt + "/4"}
                    </button>
                </div>

                {active && this.state.songs!='undefined' &&(
                    <div className="dropdownOptionsContainer">
                    
                    {options.map((option)=>(
                    <button  className="optionButton" 
                        type="button"
                        key={option} 
                        onClick={()=>this.setSelectedElement(option)} >
                        {option} 
                    </button>
                    ))}

                    </div>
                )}
            </>);
        }



   }




export default Dropdown