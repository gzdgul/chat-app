import './CSS/App.css';
import Login from "./pages/login";
import { Routes, Route } from 'react-router-dom';
import Register from "./pages/register";
import Home from "./pages/home";
import Chat from "./pages/chat";

function App() {

    return (
        <>
            <Routes>
                <Route path= "/" element = {<Home/>}/>
                <Route path='/login' element = {<Login/>}/>
                <Route path='/register' element = {<Register/>}/>
                <Route path='/chat' element = {<Chat/>}/>
            </Routes>
        </>
  );
}

export default App;
