import React, { Component } from 'react';
import { withStyles } from '@material-ui/core/styles';
import './App.css';
import Index from './pages/index';
import Appbar from './components/appbar';
const styles = theme => ({
  '@global': {
    '*::-webkit-scrollbar': {
      width: '0.4em'
    },
    '*::-webkit-scrollbar-track': {
      '-webkit-box-shadow': 'inset 0 0 6px rgba(0,0,0,0.00)'
    },
    '*::-webkit-scrollbar-thumb': {
      backgroundColor: 'rgba(0,0,0,.1)',
      outline: '1px solid slategrey'
    }
  }
})

class App extends Component {
  
  constructor(props) {
    super(props)
    const DataRGB = localStorage.getItem('DataRGB') == null ?  localStorage.setItem('DataRGB', false):
    localStorage.getItem('DataRGB') === 'false' ? false : true;
    const DataDarkMode = localStorage.getItem('DataDarkMode') == null ?  localStorage.setItem('DataDarkMode', false):
    localStorage.getItem('DataDarkMode') === 'false' ? false : true;
   
    this.state = {
      RGB: DataRGB,
      darkMode: DataDarkMode,
    }

  }
  changeMode(){
    this.setState((prevState, props) => ({
      darkMode: !prevState.darkMode
    }));
    localStorage.setItem('DataDarkMode', !this.state.darkMode);
   
  }
  changeRGB(){
    this.setState((prevState, props) => ({
      RGB: !prevState.RGB
    }));
   
    localStorage.setItem('DataRGB', !this.state.RGB);
   
  }
  componentDidMount() {
    if (this.scrollbar) {
      this.scrollbar.element.addEventListener('ps-scroll-y', () =>
        console.log('scroll-y')
      );
    }
  }
  render() {
    const { RGB, darkMode } = this.state;
    return (
      <div className="App">

          <Appbar darkMode={darkMode}  RGB={RGB} 
            changeMode={()=>this.changeMode()} changeRGB={()=>this.changeRGB()}/>
          <Index darkMode={darkMode}/>
        
      </div>
    )
  }
}
export default withStyles(styles)(App);
