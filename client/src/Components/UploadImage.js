import axios from "axios";
import { Component } from "react";

class UploadImage extends Component{

    state = {
 
        // Initially, no file is selected
        selectedFile: null
      };
      
      // On file select (from the pop up)
      onFileChange = event => {
      
        // Update the state
        this.setState({ selectedFile: event.target.files[0] });
      
      };
      
      // On file upload (click the upload button)
      onFileUpload = () => {
      
        // Create an object of formData
        const formData = new FormData();
      
        // Update the formData object
        formData.append(
          "Image",
          this.state.selectedFile,
          'Image.jpg'
        );
      
        // Details of the uploaded file
        console.log(this.state.selectedFile);
      
        // Request made to the backend api
        // Send formData object
        axios.post("/uploadFile", formData);
      };
      
      getFile=()=>{
        if(this.state.selectedFile!=null){
          let image = URL.createObjectURL(this.state.selectedFile)
          return <img style={{height: '25vh', width: '50vw'}} src={image} />
        }
      }
      
      render() {
      
        return (
          <div>
              {this.getFile()}
              <div>
                  <input type="file" onChange={this.onFileChange} />
                  <button onClick={this.onFileUpload}>
                    Upload!
                  </button>
              </div>
          </div>
        );
      }
    }



export default UploadImage