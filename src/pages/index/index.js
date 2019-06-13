import React, { Component , useState } from 'react';
import { withStyles } from '@material-ui/core/styles';
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
import grey from '@material-ui/core/colors/grey';
import Tooltip from '@material-ui/core/Tooltip';

const db = new Dexie('DexieDB');
db.version(1).stores({
  DataSave: "++id, src, width, height, alt, keys, content",
});

const drawerWidth = '20rem';

const styles = theme => ({
    root:{
        paddingTop: theme.spacing(2) ,
        paddingBottom: theme.spacing(2) ,
        minHeight: `calc( 100vh - 6.5rem)`,
    },
    lightModeRoot:{
      background: grey[100],
    },
    darkModeRoot:{
      background: grey[900],
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
      width: `calc(100% - ${drawerWidth } + 5rem )`,
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
    },
    dropArea:{
        margin: '0 1rem',
        '&:focus' : {
          outline: 'none',
        }
    },
    lightModeDropArea:{
      border: `${grey[800]} 0.1rem dashed`,
    },
    darkModeDropArea:{
      border: `${grey[100]} 0.1rem dashed`,
    },
    darkModeIcon:{
      color: grey[100],
      position: 'relative',
  },
});
let DataPhotos  = [];
db.DataSave.toArray().then(
  (index)=>{
     
      DataPhotos = index;
  }
)

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
      info: false,
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
    const newArr = [...DataPhotos];
    newArr[index].content =  that.currentTarget.value;
    DataPhotos = newArr;
    this.setState((prevState, props) => ({
      photo: newArr
    }));

    db.DataSave.update(photo.id,{
      content: that.target.value,
    })
  }
  updateName = (that, photo, index) =>{
    const newArr = [...DataPhotos];
    newArr[index].alt =  that.target.value;
    DataPhotos = newArr;
    this.setState((prevState, props) => ({
      photo: newArr
    }));
    db.DataSave.update(photo.id,{
      alt: that.target.value,
    })
  }
  onSortEnd = ({ oldIndex, newIndex, e}) => {
    if(oldIndex === newIndex){
      let photos = DataPhotos
      if(this.state.checkMode === oldIndex){
        photos[oldIndex].selected = false
        if(photos[oldIndex].opentime > Date.now() - 500){
          this.openLightbox(newIndex)
        }
        this.setState((prevState, props) => ({
          checkMode: -1
        }));
      }
      else{
        photos[oldIndex].selected = !photos[oldIndex].selected
        photos[oldIndex].opentime = Date.now()
        this.setState((prevState, props) => ({
          checkMode: oldIndex
        }));
      }
    }
    if(oldIndex !== newIndex){
      let oldIndexs =  DataPhotos[oldIndex]
      let newIndexs =  DataPhotos[newIndex]
      DataPhotos = arrayMove(DataPhotos, oldIndex, newIndex)
      
      this.setState(({ photo }) => ({
        photo: arrayMove(photo, oldIndex, newIndex),
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
              DataPhotos = index
                this.setState((prevState, props) => ({
                  photo: index
                }));
              
            })
        }
        
      };
      reader.readAsDataURL(index);
      return 0
    })     
  }
  // selectPhoto(event, obj) {
  //   let photos = DataPhotos;
  //   photos[obj.index].selected = !photos[obj.index].selected;
  //   this.setState({ photo: photos });
  // }
  toggleSelect() {
    let photos = DataPhotos.map((photo, index) => {
      return { ...photo, selected: !this.state.selectAll };
    });
    this.setState((prevState, props) => ({
      photo: photos, selectAll: !prevState.selectAll
    }));
  }
  deleteSelect(){
    const array = [...DataPhotos];
    let i = 0
    DataPhotos.map((photo, index) => {
      if(photo.selected){        
        db.DataSave.delete(photo.id)
        DataPhotos.splice((index - i++) , 1)
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
    }
    const handleDrawerClose = () =>{
      this.setState((prevState, props) => ({
        info: false
      }));
    }
  
    return (
      <div className={`${this.props.darkMode? classes.darkModeRoot: classes.lightModeRoot} ${classes.root}`}>
        <Lightbox images={DataPhotos}
                  onClose={this.closeLightbox}
                  onClickPrev={this.gotoPrevious}
                  onClickNext={this.gotoNext}
                  currentImage={this.state.currentImage}
                  isOpen={this.state.lightboxIsOpen}
                />
        <Dropzone onDrop={ acceptedFiles => this.onDropHandler(acceptedFiles)} >
          {({getRootProps, getInputProps}) => (
           
            <section >  
              <div  >
              <input {...getInputProps()} />
              <div {...getRootProps({
                      onClick: event => event.stopPropagation()
                    })} className={`${this.props.darkMode? classes.darkModeDropArea: classes.lightModeDropArea} ${classes.dropArea}`}>
                  <IconButton aria-label="cloud_upload" className={`${this.props.darkMode? classes.darkModeIcon: ''}`} {...getRootProps()}>
                    <Tooltip title="Upload" placement="top">
                      <Icon  fontSize="large" className="material-icons">cloud_upload</Icon>
                    </Tooltip>
                  </IconButton>
                  <IconButton aria-label="done_all" className={`${this.props.darkMode? classes.darkModeIcon: ''}`} onClick={this.toggleSelect}>
                    <Tooltip title="Select all" placement="top">
                      <Icon  fontSize="large" className="material-icons">done_all</Icon>
                    </Tooltip>
                  </IconButton>
                  <IconButton aria-label="Delete" className={`${this.props.darkMode? classes.darkModeIcon: ''}`} onClick={this.deleteSelect}>
                    <Tooltip title="Delete" placement="top">
                      <DeleteIcon fontSize="large" />
                    </Tooltip>
                  </IconButton>
                  <IconButton aria-label="Open drawer" className={`${this.props.darkMode? classes.darkModeIcon: ''}`}
                   onClick={handleDrawerOpen} >
                     <Tooltip title="Info" placement="top">
                      <Icon  fontSize="large" className="material-icons">info</Icon>
                     </Tooltip>
                  </IconButton>
              </div>

              <main className={this.state.info?`${classes.content} ${classes.contentShift}`:classes.content}>
                <div className={classes.toolbar}>
                  <SortableGallery items={DataPhotos} onSortEnd={this.onSortEnd}  axis={"xy"} />
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
                    {DataPhotos.map((index,value) =>{
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
              </div>
            </section>
           
          )}
        </Dropzone>
        
      </div>
    )
  }
}
export default withStyles(styles)(index);
