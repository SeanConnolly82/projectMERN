import React from 'react';

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
      fileType: null
    };
  }

  imageHandler() {
    if (!this.state.file) return;
    this.props.setImage(this.state.file[0], this.state.fileType[0]);
  }

  render() {
    return (
      <FilePond
        allowFileEncode
        stylePanelAspectRatio={'0.8:1'}
        onupdatefiles={(fileItems) => {
          this.setState({
            file: fileItems.map((fileItem) =>
              fileItem.getFileEncodeBase64String()
            ),
            fileType: fileItems.map((fileItem) => fileItem.file.type),
          });
          this.imageHandler();
        }}
      ></FilePond>
    );
  }
}

export default Uploader;
