import React, { Component } from 'react';
import { withStyles } from '@material-ui/core/styles';
import FileBase64 from 'react-file-base64';
import Gallery from 'react-photo-gallery';
import Lightbox from 'react-images';
import Dexie from 'dexie';
const db = new Dexie('DexieDB');
db.version(1).stores({
  DataSave: "++id, src, width, height, alt, keys",
});
const styles = theme => ({
    root:{
        paddingTop: theme.spacing(2) ,
        paddingBottom: theme.spacing(2) ,
    }
    
});

const photos = [
  
];

class index extends Component {
  
  constructor(props) {
    super(props)
    this.closeLightbox = this.closeLightbox.bind(this);
    this.openLightbox = this.openLightbox.bind(this);
    this.gotoNext = this.gotoNext.bind(this);
    this.gotoPrevious = this.gotoPrevious.bind(this);
    this.state = {
      files: [],
      currentImage: 0,
      photo: [],
    }
    // db.DataSave.clear()
    db.DataSave.toArray().then(
      (index)=>{
        setTimeout(() => {
          this.setState({photo: index})
        });
      }
    )
    
   
  }
  getFiles(files){
    
    files.map((index,value)=>{
      let img = new Image();
      img.src = index.base64;
      
      
      img.onload = () =>{
        let content = {
          src: index.base64 ,
          width: img.width,
          height: img.height,
          alt: index.name,
          keys: Date.now(),
        }
        db.DataSave.add(content);
        db.DataSave.toArray().then(
          (index)=>{
            setTimeout(() => {
              this.setState({photo: index})
            });
          }
        )
        
      }
    })
    
  }
  
  openLightbox(event, obj) {
    this.setState({
      currentImage: obj.index,
      lightboxIsOpen: true,
    });
  }
  closeLightbox() {
    this.setState({
      currentImage: 0,
      lightboxIsOpen: false,
    });
  }
  gotoPrevious() {
    this.setState({
      currentImage: this.state.currentImage - 1,
    });
  }
  gotoNext() {
    this.setState({
      currentImage: this.state.currentImage + 1,
    });
  }
  render() {
    const { classes } = this.props
    return (
      <div className={classes.root}>
        <Gallery photos={this.state.photo} onClick={this.openLightbox} />
        
        <Lightbox images={this.state.photo}
          onClose={this.closeLightbox}
          onClickPrev={this.gotoPrevious}
          onClickNext={this.gotoNext}
          currentImage={this.state.currentImage}
          isOpen={this.state.lightboxIsOpen}
        />
        <FileBase64
          multiple={ true }
          onDone={ this.getFiles.bind(this) } />
      </div>
    )
  }
}
export default withStyles(styles)(index);
