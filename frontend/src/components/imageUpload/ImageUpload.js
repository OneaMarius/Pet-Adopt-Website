
import React, { useRef, useState, useEffect } from 'react';
import ButtonA from '../ui/ButtonA';
import mod from './ImageUpload.module.css';

function ImageUpload( props) {

    const [file, setFile] = useState();
    const [previewUrl, setPreviewUrl] = useState();
    
  
    const filePickerRef = useRef();
  
    useEffect(() => {
      if (!file) {
        return;
      }
      const fileReader = new FileReader();  // api build in the browser
      fileReader.onload = () => {
        setPreviewUrl(fileReader.result);
      };
      fileReader.readAsDataURL(file);
    }, [file]);
  
    const pickedHandler = event => {
      let pickedFile;
      if (event.target.files && event.target.files.length === 1) {
        pickedFile = event.target.files[0];
        setFile(pickedFile);
        props.imgPick(pickedFile);
    }};
  
    const pickImageHandler = () => {
        filePickerRef.current.click();
      };    // click on file input that is hidden
  return (
    <div className={mod.formControl}>
      <input
        id={props.id}
        ref={filePickerRef}
        style={{ display: 'none' }}
        type="file"
        accept=".jpg,.png,.jpeg"
        onChange={pickedHandler}
      />
      <div className={`${mod.imageUpload} ${props.className?props.className:''}`}>
        <div className={mod.imageUpload__preview}>
          {previewUrl && <img src={previewUrl} alt="Preview" />}
          {!previewUrl && <p>Please pick Pet image.</p>}
        </div>
        <ButtonA className={mod.Btn} onClick={pickImageHandler}>
          PICK IMAGE
        </ButtonA>
      </div>
      
    </div>
  )
}

export default ImageUpload