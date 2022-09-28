import { Component } from "react";
import './UploadImage.css'

class UploadImage extends Component{
  sendPicture;

  constructor(props){
    super(props);
    this.sendPicture = () => {
      props.callback({
          image: this.state.selectedFile
      });
  };
  }

    state = {
 
        // Initially, no file is selected
        selectedFile: null,
        active: ''
      };
      // On file select (from the pop up)
      onFileChange = event => {
      
        // Update the state
        event.target.files[0] && this.setState({ selectedFile: event.target.files[0], active: 'A' });
      
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

                    <div id="div" className="div-choose-file">
                        <input type="file" name="file" id="file" accept="image/png , image/gif , image/jpeg" className='custom-file-input' onChange={this.onFileChange}/>
                        <label id="div-label" htmlFor="file">Choose file</label>
                    </div>

                  <button disabled={!this.state.selectedFile} onClick={this.sendPicture} className="button-insert-upload">Upload</button>
              </div>
          </div>
        );
      }
    }



export default UploadImage