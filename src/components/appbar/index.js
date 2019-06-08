import React, { Component } from 'react';
import { withStyles } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
// import Button from '@material-ui/core/Button';
// import IconButton from '@material-ui/core/IconButton';
// import MenuIcon from '@material-ui/icons/Menu';

import pink from '@material-ui/core/colors/pink';
import purple from '@material-ui/core/colors/purple';
import grey from '@material-ui/core/colors/grey';

const styles = theme => ({
    root: {
        flexGrow: 1,
      },
    title:{
        margin: 'auto',
        background: grey[800],
        borderRadius: '.25rem',
    },
    pink: {
        fontWeight: 700,
        color: pink[500],//pink 500
        padding: '.25rem .5rem',
    },
    purple: {
        background: purple[500],
        color: grey[50],
        padding: '.25rem .25rem',
        borderRadius: '0 .25rem .25rem 0',
    },
    appbar:{
        background: grey[300],
        boxShadow: 'none'
    }
});

class App extends Component {
  render() {
    const { classes } = this.props
    return (
        <div className={classes.root}>
            <AppBar className={classes.appbar} position="static" >
                <Toolbar>
                    {/* <IconButton edge="start" className={classes.menuButton} color="secondary" aria-label="Menu">
                        <MenuIcon />
                    </IconButton> */}
                    <Typography variant="h6" className={classes.title}>
                        <span className={classes.pink}>E</span>
                        <span className={classes.purple}>Photos</span>
                    </Typography>
                </Toolbar>
            </AppBar>
        </div>
    )
  }
}
export default withStyles(styles)(App);
