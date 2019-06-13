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
    
    this.state = {
      RGB: false ,//
      darkMode: false,//
    }
   
    // cookies.set('drakMode', this.state.darkMode, { path: '/' });
  }
  changeMode(){
    this.setState((prevState, props) => ({
      darkMode: !prevState.darkMode
    }),()=>{
      // cookies.set('drakMode', this.state.darkMode, { path: '/' });
    });
    
  }
  changeRGB(){
    this.setState((prevState, props) => ({
      RGB: !prevState.RGB
    }),()=>{
      console.log(this.state.RGB)
    });
    
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
