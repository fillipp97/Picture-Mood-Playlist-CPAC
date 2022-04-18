
import { Component } from "react";
import UploadButton from "./UploadButton";
import './UploadImage.css'

class UploadImage extends Component{

    state = {
 
        // Initially, no file is selected
        selectedFile: null,
        active: ''
      };
      
      // On file select (from the pop up)
      onFileChange = event => {
      
        // Update the state
        this.setState({ selectedFile: event.target.files[0], active: 'A' });
      
      };
      
     
      
      getFile=()=>{
        if(this.state.selectedFile!=null){
          let image = URL.createObjectURL(this.state.selectedFile)
          return <img src={image} />
        }
      }
      
      render() {
      
        return (
          <div className="uploadFileContainer">
              <div className={"ImageContainer" + this.state.active}>
              {this.getFile()}
              </div>
              <div className="InputContainer">
              
                  <input type="file" name="file" id="file" className='custom-file-input' onChange={this.onFileChange} />
                  <label htmlFor='file' className="Button">Chose File</label>

                  <UploadButton file={this.state.selectedFile} onUpload={this.props.onUpload}></UploadButton>
              </div>
          </div>
        );
      }
    }



export default UploadImage