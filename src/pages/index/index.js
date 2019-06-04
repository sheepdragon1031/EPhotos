import React, { Component } from 'react';
import { withStyles } from '@material-ui/core/styles';
import FileBase64 from 'react-file-base64';
import Gallery from 'react-photo-gallery';
import Lightbox from 'react-images';
import Dexie from 'dexie';
import Dropzone from 'react-dropzone'
import {SortableContainer, SortableElement} from 'react-sortable-hoc';
import DropPhoto from "./photo";
import SelectPhoto from "./selectedImage";

import arrayMove from "array-move";
import SelectedImage from "./selectedImage";


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
    // this.selectPhoto = this.selectPhoto.bind(this);
    this.toggleSelect = this.toggleSelect.bind(this);
    this.state = {
      files: [],
      currentImage: 0,
      photo: [],
      selectAll: false,
      checkMode: 0,
    }
    // db.DataSave.clear()
    db.DataSave.toArray().then(
      (index)=>{
          this.setState({photo: index})
      }
    )
   
  }
  
  onSortEnd = ({ oldIndex, newIndex, e}) => {
    if(oldIndex === newIndex){
      let photos = this.state.photo
      if(this.state.checkMode === oldIndex){
        photos[oldIndex].selected = false
        if(photos[oldIndex].opentime > Date.now() - 500){
          this.openLightbox(newIndex)
        }
        this.setState({checkMode: 0})
      }
      else{
        photos[oldIndex].selected = !photos[oldIndex].selected
        photos[oldIndex].opentime = Date.now()
        this.setState({checkMode: oldIndex})
      }
      // this.openLightbox(newIndex)
    }
    if(oldIndex !== newIndex){
      let oldIndexs =  this.state.photo[oldIndex]
      let newIndexs =  this.state.photo[newIndex]

      this.setState(({ photo }) => ({
        photo: arrayMove(photo, oldIndex, newIndex)
      }),()=>{

        db.DataSave.update(oldIndexs.id,{
          src: newIndexs.src ,
          width: newIndexs.width,
          height: newIndexs.height,
          alt: newIndexs.alt,
          keys: newIndexs.key,
        })
  
        db.DataSave.update(newIndexs.id,{
          src: oldIndexs.src ,
          width: oldIndexs.width,
          height: oldIndexs.height,
          alt: oldIndexs.alt,
          keys: oldIndexs.key,
        })

      });
      
    }
    

  };
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
            // setTimeout(() => {
              this.setState({photo: index})
            // });
          }
        )
        
      }
    })
    
  }
  
  openLightbox(index) {
    this.setState({
      currentImage: index,
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
  onDropHandler(files) { 
    files.map((index,value) =>{
      const reader = new FileReader();
      const img = new Image();
      reader.onload = (event) => {
        index.base64 = event.target.result;
        img.src = index.base64;
        img.onload = () => {
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
              // setTimeout(() => {
                this.setState({photo: index})
              // });
            })
        }
      };
      reader.readAsDataURL(index);
    })     
  }
  // selectPhoto(event, obj) {
  //   let photos = this.state.photo;
  //   photos[obj.index].selected = !photos[obj.index].selected;
  //   this.setState({ photo: photos });
  // }
  toggleSelect() {
    let photos = this.state.photo.map((photo, index) => {
      return { ...photo, selected: !this.state.selectAll };
    });
    this.setState({ photo: photos, selectAll: !this.state.selectAll });
  }

  render() {
    const { classes } = this.props
    const SortablePhoto = SortableElement(item => <DropPhoto {...item} />);
    const SortableGallery = SortableContainer(({ items }) => (
      <Gallery photos={items} renderImage={SortablePhoto} />
    ));
    return (
      <div className={classes.root}>
        <p>
          <button className="toggle-select" onClick={this.toggleSelect}>
            toggle select all
          </button>
        </p>
        <Lightbox images={this.state.photo}
                  onClose={this.closeLightbox}
                  onClickPrev={this.gotoPrevious}
                  onClickNext={this.gotoNext}
                  currentImage={this.state.currentImage}
                  isOpen={this.state.lightboxIsOpen}
                />
        <Dropzone onDrop={ acceptedFiles => this.onDropHandler(acceptedFiles)}>
          {({getRootProps, getInputProps}) => (
            <section>
              <div {...getRootProps()}>
                
                
                
                <FileBase64
                  multiple={ true }
                  onDone={ this.getFiles.bind(this) } />
              
                <input {...getInputProps()} />
              </div>
            </section>
          )}
        </Dropzone>
        <SortableGallery items={this.state.photo} onSortEnd={this.onSortEnd}  axis={"xy"} />
        
      </div>
    )
  }
}
export default withStyles(styles)(index);
