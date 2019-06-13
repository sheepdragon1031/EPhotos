import React, { Component } from 'react';
import { withStyles } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
// import Button from '@material-ui/core/Button';
import IconButton from '@material-ui/core/IconButton';
import Icon from '@material-ui/core/Icon';

import pink from '@material-ui/core/colors/pink';
import purple from '@material-ui/core/colors/purple';
import grey from '@material-ui/core/colors/grey';
// import RGBS from 'RGBS.js'
const styles = theme => ({
    root: {
        flexGrow: 1,
      },
    title:{
        margin: 'auto',
        marginLeft: 0,
        borderRadius: '.25rem',
    },
    pink: {
        fontWeight: 700,
        color: pink[500],//pink 500
        padding: '.25rem .5rem',
    },
    purple: {
        background: purple[500],
       
        padding: '.25rem .25rem',
        borderRadius: '0 .25rem .25rem 0',
    },
    lightModePurple:{
        color: grey[50],
    },
    darkModePurple:{
        color: grey[900],
    },
    appbar:{
        boxShadow: 'none',
    },
    lightModeTitle:{
        background: grey[900],
    },
    darkModeTitle:{
        background: grey[100],
    },
    lightModeAppbar:{
        background: grey[200],
        boxShadow: `0rem 0rem .2rem .1rem ${grey[500]}`,
    },
    darkModeAppbar:{
        background: grey[800],
        boxShadow: `0rem 0rem .2rem .1rem ${grey[50]}`,
    },
    darkModeIcon:{
        color: grey[100],
    },
    '@-webkit-keyframes RGB': {
        '0%':{
            backgroundPosition: '0% 50%'
        },
        '50%':{
            backgroundPosition: '100% 50%'
        },
        '100%':{
            backgroundPosition: '0% 50%'
        },
    },
    '@-moz-keyframes RGB': {
        '0%':{
            backgroundPosition: '0% 50%'
        },
        '50%':{
            backgroundPosition: '100% 50%'
        },
        '100%':{
            backgroundPosition: '0% 50%'
        },
    },
    '@keyframes RGB': {
        '0%':{
            backgroundPosition: '0% 50%'
        },
        '50%':{
            backgroundPosition: '100% 50%'
        },
        '100%':{
            backgroundPosition: '0% 50%'
        },
    },
    LightBar:{
        height: '.5rem',
        background: grey[100],
    },
    DarkBar:{
        height: '.5rem',
        background: grey[900],
    },
    RGB:{
        height: '.5rem',
        background: 'linear-gradient(90deg, #f44336, #e91e63, #9c27b0, #3f51b5, #2196f3, #009688, #4caf50, #cddc39, #ffeb3b, #ff9800, #ff5722)',
        backgroundSize: '400% 200%',
        '-webkit-animation': '$RGB 15s ease infinite',
        '-moz-animation': '$RGB 15s ease infinite',
        animation: `$RGB 15s ease infinite`,
    },
});

class App extends Component {
    constructor(props) {
        super(props)
        this.state = {
            RGB: this.props.RGB,
            darkMode: this.props.darkMode,
        }
    }
    changeMode(){
        this.setState((prevState, props) => ({
          darkMode: !prevState.darkMode
        }));
        this.props.changeMode()
    }
    changeRGB(){
        this.setState((prevState, props) => ({
          RGB: !prevState.RGB
        }));
        this.props.changeRGB()
    }
  render() {
    const { classes } = this.props
   
    return (
        <div className={classes.root}>
            <AppBar className={`${this.state.darkMode?classes.darkModeAppbar:classes.lightModeAppbar} ${classes.AppBar}`} position="static" >
                <Toolbar>
                    {/* <IconButton edge="start" className={classes.menuButton} color="secondary" aria-label="Menu">
                        <MenuIcon />
                    </IconButton> */}
                    <Typography variant="h6" className={`${this.state.darkMode?classes.darkModeTitle:classes.lightModeTitle} ${classes.title}`}>
                        <span className={` ${classes.pink}`}>E</span>
                        <span className={` ${classes.purple}`}>Photos</span>
                    </Typography>
                    <IconButton aria-label="gamepad" className={`${this.state.darkMode?classes.darkModeIcon:''}`} onClick={() => this.changeRGB()}>
                        <Icon  fontSize="default" className="material-icons">gamepad</Icon>
                    </IconButton>
                    <IconButton aria-label="brightness_4" className={`${this.state.darkMode?classes.darkModeIcon:''}`} onClick={() => this.changeMode()} >
                        <Icon  fontSize="default" className="material-icons">brightness_4</Icon>
                    </IconButton>
                </Toolbar>
            </AppBar>
            <div className={`${this.state.RGB?classes.RGB:this.state.darkMode?classes.DarkBar:classes.LightBar}`}>

            </div>
        </div>
    )
  }
}
export default withStyles(styles)(App);
