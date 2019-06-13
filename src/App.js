import React, { Component } from 'react';
import { withStyles } from '@material-ui/core/styles';
import './App.css';
import Index from './pages/index';
import Appbar from './components/appbar';

const styles = theme => ({
 
})
class App extends Component {
  
  constructor(props) {
    super(props)
    const DataRGB = localStorage.getItem('DataRGB') == null ?  localStorage.setItem('DataRGB', false):
    localStorage.getItem('DataRGB') == 'false' ? false : true;
    const DataDarkMode = localStorage.getItem('DataDarkMode') == null ?  localStorage.setItem('DataDarkMode', false):
    localStorage.getItem('DataDarkMode') == 'false' ? false : true;
   
    this.state = {
      RGB: DataRGB,
      darkMode: DataDarkMode,
    }

  }
  changeMode(){
    const DataDarkMode = localStorage.getItem('DataDarkMode') == null ?  localStorage.setItem('DataDarkMode', false):
    localStorage.getItem('DataDarkMode') == 'false' ? false : true;
    this.setState((prevState, props) => ({
      darkMode: !prevState.darkMode
    }));
    localStorage.setItem('DataDarkMode', !this.state.darkMode);
   
  }
  changeRGB(){
    const DataRGB = localStorage.getItem('DataRGB') == null ?  localStorage.setItem('DataRGB', false):
    localStorage.getItem('DataRGB') == 'false' ? false : true;
    this.setState((prevState, props) => ({
      RGB: !prevState.RGB
    }));
   
    localStorage.setItem('DataRGB', !this.state.RGB);
   
  }
  render() {
    const { RGB, darkMode } = this.state;
    console.log(RGB)
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
