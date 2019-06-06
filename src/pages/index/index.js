import React, { Component } from 'react';
import { withStyles } from '@material-ui/core/styles';
import FileBase64 from 'react-file-base64';
import Gallery from 'react-photo-gallery';
import Lightbox from 'react-images';
import Dexie from 'dexie';
import Dropzone,{useDropzone} from 'react-dropzone'
import {SortableContainer, SortableElement} from 'react-sortable-hoc';
import DropPhoto from "./photo";
import SelectPhoto from "./selectedImage";

import arrayMove from "array-move";
import SelectedImage from "./selectedImage";


import IconButton from '@material-ui/core/IconButton';
import DeleteIcon from '@material-ui/icons/Delete';


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
    this.deleteSelect = this.deleteSelect.bind(this);
    this.onUploadImg = this.onUploadImg.bind(this);
    this.myRef = React.createRef();
    this.state = {
      files: [],
      currentImage: 0,
      photo: [],
      selectAll: false,
      checkMode: -1,
    }
    // db.DataSave.clear()
    db.DataSave.toArray().then(
      (index)=>{
          this.setState((prevState, props) => ({
            photo: index
          }));
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
        this.setState((prevState, props) => ({
          checkMode: -1
        }));
        // this.setState({checkMode: -1})
      }
      else{
        photos[oldIndex].selected = !photos[oldIndex].selected
        photos[oldIndex].opentime = Date.now()
        this.setState((prevState, props) => ({
          checkMode: oldIndex
        }));
        // this.setState({checkMode: oldIndex})
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
      
      console.log(index)
      img.onload = () =>{
        
        let content = {
          src: index.base64 ,
          width: img.width,
          height: img.height,
          alt: index.name,
          keys: Date.now(),
          caption: index.name,
        }
        db.DataSave.add(content);
        db.DataSave.toArray().then(
          (index)=>{
            // setTimeout(() => {
              this.setState((prevState, props) => ({
                photo: index
              }));
              // this.setState({photo: index})
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
            caption: index.name
          }
          db.DataSave.add(content);
          db.DataSave.toArray().then(
            (index)=>{
              // setTimeout(() => {
                this.setState((prevState, props) => ({
                  photo: index
                }));
                // this.setState({photo: index})
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
    this.setState((prevState, props) => ({
      photo: photos, selectAll: !prevState.selectAll
    }));
    // this.setState({ photo: photos, selectAll: !this.state.selectAll });
  }
  deleteSelect(){
    const array = [...this.state.photo];
    let i = 0
    this.state.photo.map((photo, index) => {
      if(photo.selected){        
        db.DataSave.delete(photo.id)
        array.splice((index - i++) , 1)
        // this.setState({photo: array})
        this.setState((prevState, props) => ({
          photo: array
        }));
      }
    });
  }
  onUploadImg(){
    const node = this.myRef.current;
    console.log(node.onClick())
    
  }
  render() {
    const { classes } = this.props
    const SortablePhoto = SortableElement(item => <DropPhoto {...item} />);
    const SortableGallery = SortableContainer(({ items }) => (
      <Gallery photos={items} renderImage={SortablePhoto} />
    ));
    // const { getRootProps ,getInputProps} = useDropzone();
    return (
      <div className={classes.root}>
        <Lightbox images={this.state.photo}
                  onClose={this.closeLightbox}
                  onClickPrev={this.gotoPrevious}
                  onClickNext={this.gotoNext}
                  currentImage={this.state.currentImage}
                  isOpen={this.state.lightboxIsOpen}
                />
        {/* <FileBase64 
                  multiple={ true }
                  onDone={ this.getFiles.bind(this) } ref={this.myRef}/> */}
        <Dropzone onDrop={ acceptedFiles => this.onDropHandler(acceptedFiles)}>
          {({getRootProps, getInputProps}) => (
         
            <section>
              <p>
                  <IconButton aria-label="cloud_upload" className={classes.margin} {...getRootProps()}>
                    <i  fontSize="large" className="material-icons">cloud_upload</i>
                  </IconButton>
                  <IconButton aria-label="done_all" className={classes.margin} onClick={this.toggleSelect}>
                    <i  fontSize="large" className="material-icons">done_all</i>
                  </IconButton>
                  <IconButton aria-label="Delete" className={classes.margin} onClick={this.deleteSelect}>
                    <DeleteIcon fontSize="default" />
                  </IconButton>
              </p>
              <div {...getRootProps()}>    
                <input {...getInputProps()} />
              </div>
              <SortableGallery items={this.state.photo} onSortEnd={this.onSortEnd}  axis={"xy"} />
            </section>
          )}
        </Dropzone>
        
        
      </div>
    )
  }
}
export default withStyles(styles)(index);
