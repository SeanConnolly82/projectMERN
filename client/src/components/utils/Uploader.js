import React from 'react';
import axios from 'axios';

import { FilePond, registerPlugin } from 'react-filepond';

import 'filepond/dist/filepond.min.css';

import FilePondPluginImageExifOrientation from 'filepond-plugin-image-exif-orientation';
import FilePondPluginImagePreview from 'filepond-plugin-image-preview';
import FilePondPluginFileEncode from 'filepond-plugin-file-encode';
import FilePondPluginImageResize from 'filepond-plugin-image-resize';

import 'filepond-plugin-image-preview/dist/filepond-plugin-image-preview.css';

// Register the plugins
registerPlugin(
  FilePondPluginImageExifOrientation,
  FilePondPluginImagePreview,
  FilePondPluginFileEncode,
  FilePondPluginImageResize
);

class Uploader extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      file: null,
      name: null
    };
  }

  fileUploadHandler = async () => {
    try {
      //const payload = this.state.file[0];
      if (!this.state.file) return;
      const res = await axios.post('http://localhost:3000/profile/image-upload', {
        file: this.state.file[0]
      });
      console.log(res.id);
    } catch (err) {
      console.error(err);
    }
  };

  render() {   
    return (
      <div>
        <FilePond 
          allowFileEncode
          onupdatefiles={(fileItems) => {
            this.setState({
              file: fileItems.map(fileItem => fileItem.getFileEncodeBase64String()),
              name: fileItems.map(fileItem => fileItem.file.name)
            })
          }}>
        </FilePond>
        <button onClick={this.fileUploadHandler}>Click me!!!</button>
        <p>The input version</p>
      </div>
    );
  }
}

export default Uploader;
