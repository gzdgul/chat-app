import React from 'react';
import { Link } from 'react-router-dom'

function Home(props) {
    return (
        <div>
            <Link to={'/register'}> Kayıt Ol </Link>
            <Link to={'/login'}> Giriş Yap </Link>
        </div>
    );
}

export default Home;