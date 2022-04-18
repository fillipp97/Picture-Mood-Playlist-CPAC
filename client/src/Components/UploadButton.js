import { Component } from "react";
import axios from "axios";

class UploadButton extends Component{
    constructor(props){
        super(props)

        this.state={
            selectedFile: ''

        }
    }

     // On file upload (click the upload button)
     onFileUpload = () => {
      
        // Create an object of formData
        const formData = new FormData();
      
        // Update the formData object
        formData.append(
          "Image",
          this.props.file,
          'Image.jpg'
        );
      
        // Details of the uploaded file
        console.log(this.props.file);
      
        // Request made to the backend api
        // Send formData object
        axios.post("/uploadFile", formData);

        this.props.onUpload()
      };


    render(){
        return(<button className="Button animated" onClick={this.onFileUpload}>
        Upload!
      </button>)
    }
}

export default UploadButton