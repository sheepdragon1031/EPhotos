import React, { Component } from 'react';
import { withStyles } from '@material-ui/core/styles';
import { makeStyles, useTheme } from '@material-ui/core/styles';
import Gallery from 'react-photo-gallery';
import Lightbox from 'react-images';
import Dexie from 'dexie';
import Dropzone from 'react-dropzone'
import {SortableContainer, SortableElement} from 'react-sortable-hoc';
import Divider from '@material-ui/core/Divider';
import DropPhoto from "./photo";

import arrayMove from "array-move";
import Drawer from '@material-ui/core/Drawer';
import TextField from '@material-ui/core/TextField';

import IconButton from '@material-ui/core/IconButton';
import DeleteIcon from '@material-ui/icons/Delete';
// import ChevronLeftIcon from '@material-ui/icons/ChevronLeft';
import ChevronRightIcon from '@material-ui/icons/ChevronRight';

import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';

import Icon from '@material-ui/core/Icon';
import Button from '@material-ui/core/Button';

const db = new Dexie('DexieDB');
db.version(1).stores({
  DataSave: "++id, src, width, height, alt, keys, content",
});

const drawerWidth = 240;

const styles = theme => ({
    root:{
        paddingTop: theme.spacing(2) ,
        paddingBottom: theme.spacing(2) ,
    },
    textField: {
      width: '100%',
      fontSize: '0.75rem',
    },
    content: {
      flexGrow: 1,
      padding: theme.spacing(3),
      transition: theme.transitions.create('margin', {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.leavingScreen,
      }),
      marginRight: 0,
    },
    contentShift: {
      // marginRight: drawerWidth,
      width: `calc(100% - ${drawerWidth}px - 2rem)`,
    },
    toolbar: theme.mixins.toolbar,
    drawerPaper: {
      width: drawerWidth,
      marginTop: '4rem',
    },
    drawerHeader: {
      display: 'flex',
      alignItems: 'center',
      padding: '0 8px',
      ...theme.mixins.toolbar,
      justifyContent: 'flex-start',
    },
    drawer:{
      //height: 'calc(100vh - 9rem)',
      overflowY: 'auto'
    },
    rightIcon: {
      marginLeft: theme.spacing(1),
    },
    buttonRight:{
      paddingTop: '.5rem',
      textAlign: 'right',
    },
    textContent:{
      width: 'calc( 100% + 1rem)',
      marginLeft: '-.5rem',
      fontSize: '0.75rem',
    }
});

class index extends Component {
  
  constructor(props) {
    super(props)
    this.closeLightbox = this.closeLightbox.bind(this);
    this.openLightbox = this.openLightbox.bind(this);
    this.gotoNext = this.gotoNext.bind(this);
    this.gotoPrevious = this.gotoPrevious.bind(this);
    this.toggleSelect = this.toggleSelect.bind(this);
    this.deleteSelect = this.deleteSelect.bind(this);
    this.updateContent = this.updateContent.bind(this);
    this.updateName = this.updateName.bind(this);
    this.state = {
      files: [],
      currentImage: 0,
      photo: [],
      selectAll: false,
      checkMode: -1,
      info: false
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
  updateContent = (that, photo, index) =>{
    const newArr = [...this.state.photo];
    newArr[index].content =  that.target.value;
    this.setState((prevState, props) => ({
      photo: newArr
    }));
    db.DataSave.update(photo.id,{
      content: that.target.value,
    })
  }
  updateName = (that, photo, index) =>{
    const newArr = [...this.state.photo];
    newArr[index].alt =  that.target.value;
    this.setState((prevState, props) => ({
      photo: newArr
    }));
    db.DataSave.update(photo.id,{
      alt: that.target.value,
    })
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
          content: newIndexs.content,
        })
  
        db.DataSave.update(newIndexs.id,{
          src: oldIndexs.src ,
          width: oldIndexs.width,
          height: oldIndexs.height,
          alt: oldIndexs.alt,
          keys: oldIndexs.key,
          content: oldIndexs.content,
        })

      });
      
    }
    

  };
  
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
    files.map((index,value) => {
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
            caption: index.name,
            content: '',
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
      return 0
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
      return 0
    });
  }
  render() {
    const { classes } = this.props
    // const [setOpen] = React.useState(false);
    const SortablePhoto = SortableElement(item => <DropPhoto {...item} />);
    const SortableGallery = SortableContainer(({ items }) => (
      <Gallery photos={items} renderImage={SortablePhoto} />
    ));
    const handleDrawerOpen = () =>{
      this.setState((prevState, props) => ({
        info: !prevState.info
      }));
      // setOpen(false);
    }
    const handleDrawerClose = () =>{
      this.setState((prevState, props) => ({
        info: false
      }));
      // setOpen(false);
    }
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
        <Dropzone onDrop={ acceptedFiles => this.onDropHandler(acceptedFiles)}>
          {({getRootProps, getInputProps}) => (
         
            <section {...getRootProps()}>
              <input {...getInputProps()} />
              <div>
                  <IconButton aria-label="cloud_upload" className={classes.margin} {...getRootProps()}>
                    <Icon  fontSize="large" className="material-icons">cloud_upload</Icon>
                  </IconButton>
                  <IconButton aria-label="done_all" className={classes.margin} onClick={this.toggleSelect}>
                    <Icon  fontSize="large" className="material-icons">done_all</Icon>
                  </IconButton>
                  <IconButton aria-label="Delete" className={classes.margin} onClick={this.deleteSelect}>
                    <DeleteIcon fontSize="large" />
                  </IconButton>
                  <IconButton aria-label="Open drawer" className={classes.margin}
                   onClick={handleDrawerOpen} >
                    <Icon  fontSize="large" className="material-icons">info</Icon>
                  </IconButton>
              </div>

              <main className={this.state.info?`${classes.content} ${classes.contentShift}`:classes.content}>
                <div className={classes.toolbar}>
                  <SortableGallery items={this.state.photo} onSortEnd={this.onSortEnd}  axis={"xy"} />
                </div>
              </main>              
              <Drawer
                  className={classes.drawer} variant="persistent" anchor="right" open={this.state.info}
                  classes={{paper: classes.drawerPaper,}}>
                  <div className={classes.drawerHeader}>
                    <IconButton onClick={handleDrawerClose}>
                      <ChevronRightIcon/>
                    </IconButton>  
                  </div>
                  <Divider />
                  <List>
                    {this.state.photo.map((index,value) =>{
                      if(index.selected){
                        return (
                        <ListItem key={`list${value}`}>
                          <ListItemText>
                            <TextField label="Name" className={classes.textField} value={index.alt} margin="dense"
                            onChange={e => this.updateName(e, index, value)} />
                            <TextField label="content" className={classes.textContent} multiline={true} 
                            value={index.content} margin="dense" variant="outlined"
                            onChange={e => this.updateContent(e, index, value)}/>
                            <div className={classes.buttonRight}>
                              <Button variant="contained" color="primary" className={classes.button}
                               href={`${index.src}`} download={`${index.alt}`}>
                                Download
                                <Icon className={classes.rightIcon}>cloud_download</Icon>
                              </Button>
                            </div>
                          </ListItemText>
                        </ListItem>)
                      }
                      return false
                    })}
                  </List>
              </Drawer>
            </section>
          )}
        </Dropzone>
        
        
      </div>
    )
  }
}
export default withStyles(styles)(index);
