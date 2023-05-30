import './CSS/App.css';
import Login from "./pages/login";
import { BrowserRouter , Routes, Route, Switch} from 'react-router-dom';
import Register from "./pages/register";
import Home from "./pages/home";
import Chat from "./pages/chat";
import {useEffect} from "react";


function App() {
useEffect(() => {
    // viewport genişliği ve yüksekliği al
    let viewportWidth = Math.max(document.documentElement.clientWidth || 0, window.innerWidth || 0);
    let viewportHeight = Math.max(document.documentElement.clientHeight || 0, window.innerHeight || 0);
    // viewport genişliği ve yüksekliği üzerinde değişiklik yap
    document.documentElement.style.setProperty('--viewport-width', viewportWidth + 'px');
    document.documentElement.style.setProperty('--viewport-height', viewportHeight + 'px');
},[])
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
