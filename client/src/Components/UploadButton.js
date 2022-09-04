import { Component } from "react";
import { uploadFile } from '../Services/ApiService';

class UploadButton extends Component {
  constructor(props) {
    super(props)

    this.state = {
      selectedFile: ''

    }
  }



  // On file upload (click the upload button)
  onFileUpload = () => {
    uploadFile(this.props.file).then(data => {
      this.props.onUpload(data)
    }).catch(error => {
      this.setState({ applicationError: error.response })
    })
  };


  render() {
    return (<button className="Button" onClick={this.onFileUpload}>
      Upload!
    </button>)
  }
}

export default UploadButton