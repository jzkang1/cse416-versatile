import logo from './logo.svg';
import './App.css';
import { React } from 'react'
import { BrowserRouter, Route, Switch } from 'react-router-dom'
import {
    HomeScreen
} from './components'

function App() {
  return (
    <BrowserRouter>
      <Switch>
        <Route path="/" exact component={HomeScreen} />
      </Switch>
    </BrowserRouter>
  );
}

export default App;
