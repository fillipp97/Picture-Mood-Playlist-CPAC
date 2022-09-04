import React, { useState } from 'react';

export default function UploadImage({callback}) {
    const [selectedFile, setSelectedFile] = useState(null);
    const [active, setActive] = useState('');

    const onFileChange = (event) => {
        setSelectedFile(event.target.files[0])
        setActive('A')
    };

    const getFile = () => {
        if (selectedFile != null) {
            let image = URL.createObjectURL(selectedFile)
            return <img src={image} />
        }
    }

    return (
        <div className="uploadFileContainer">
            <div className={"ImageContainer" + active}>
                {getFile()}
            </div>
            <div className="InputContainer">

                <input type="file" name="file" id="file" accept="image/png , image/gif , image/jpeg" className='custom-file-input' onChange={onFileChange} />
                <label htmlFor='file' className="Button">Choose File</label>

                <button onClick={() => callback(selectedFile)}>Continue</button>
            </div>
        </div>
    );

}
