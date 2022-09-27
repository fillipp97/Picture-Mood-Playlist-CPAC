
import { Component } from 'react';
import UploadButton from './UploadButton';
// import './UploadImage.css';

import classes from './UploadImage.module.css';

class UploadImage extends Component {
	state = {
		// Initially, no file is selected
		selectedFile: null,
		active: '',
	};

	// On file select (from the pop up)
	onFileChange = (event) => {
		// Update the state
		this.setState({ selectedFile: event.target.files[0], active: 'A' });
	};

	getFile = () => {
		if (this.state.selectedFile != null) {
			let image = URL.createObjectURL(this.state.selectedFile);
			return <img src={image} />;
		}
	};

	render() {
		return (
			<div className={classes.uploadFileContainer}>
				<div className={`${classes.ImageContainer}` + this.state.active}>
					{this.getFile()}
				</div>
				<div className={classes.InputContainer}>
					<input
						type='file'
						name='file'
						id='file'
						accept='image/png , image/gif , image/jpeg'
						className={classes['custom-file-input']}
						onChange={this.onFileChange}
					/>
					<label htmlFor='file' className='Button'>
						Choose File
					</label>

					<UploadButton
						file={this.state.selectedFile}
						onUpload={this.props.onUpload}
					></UploadButton>
				</div>
			</div>
		);
	}
}

export default UploadImage;
