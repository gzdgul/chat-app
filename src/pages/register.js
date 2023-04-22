import React, {useEffect, useState} from 'react';
import {register, updateDisplayName, setUserData} from "../firebase";
import { Link } from "react-router-dom";
import { CSSTransition } from 'react-transition-group';

function Register(props) {
    const [email,setEmail] = useState('')
    const [password,setPassword] = useState('')
    const [displayName,setDisplayName] = useState('')
    const [errMesage,setErrMesage] = useState('')
    const [authorisedUser, setAuthorisedUser] = useState(false)

    const handleUserFormSubmit = async (e) => {
        e.preventDefault()
        try {
            const user = await register(email,password)
            localStorage.setItem("username", displayName);
            setAuthorisedUser(true)
            console.log(user)
        }
        catch (err) {
            (err.message.includes('invalid-email')) ? setErrMesage('Geçersiz e-mail') :
            (err.message.includes('email-already-in-use')) ? setErrMesage('E-posta adresi zaten kayıtlı. Lütfen farklı bir e-posta adresi kullanın.') :
            (err.message.includes('weak-password')) ? setErrMesage('Şifreniz çok zayıf. Lütfen daha güçlü bir şifre oluşturun.') :
                setErrMesage('UNKNOWN ERROR')
            console.log(err.message)
        }
        try {
            const userDisplayName = await updateDisplayName(displayName)
            console.log(userDisplayName)
        }catch (err) {
        }
        try {
            const userData = await setUserData(displayName,email)
            console.log('USERDATA',userData)
        }catch (err) {
        }
    }
    return (
        <div className={'screen'}>
            <div className={'formContainer'}>
                <div className={'logoWrapper'}>
                    <div className="img"></div>
                </div>
                <CSSTransition
                    in={!authorisedUser}
                    timeout={1000}
                    classNames="fade"
                    unmountOnExit>
                    <>
                        <div className={'FormWrapper'}>
                            <span>Register</span>
                            <form className={(errMesage) ? 'form bounce' : 'form'} onSubmit={handleUserFormSubmit}>
                                <input className={'input'}
                                       type="text"
                                       placeholder={'display name'}
                                       value={displayName}
                                       onChange={e => setDisplayName(e.target.value) }/>
                                <input className={'input'}
                                       type="email"
                                       placeholder={'e-mail'}
                                       value={email}
                                       onChange={e => {
                                           setEmail(e.target.value);
                                           setErrMesage('');
                                       } }/>
                                <input className={'input'}
                                       type="password"
                                       placeholder={'password'}
                                       value={password}
                                       onChange={e => {
                                           setPassword(e.target.value);
                                           setErrMesage('');
                                       } }/>
                                <button className={'button'} disabled={!email || !password} type={"submit"}>Sign In</button>
                            </form>
                            <span> Do you have an account? <Link className={'link'} to={'/login'}> Login </Link></span>
                        </div>
                        <div className={'test2'}> </div>
                        {errMesage && <div className={'err-div bounce'}><span className={'err-message'}> {'!!! ' + errMesage} </span></div>}
                    </>
                </CSSTransition>
            </div>

                <footer>
                    <ul>
                        <li>Terms of Service</li>
                        <li>General Terms and Conditions</li>
                        <li>Privacy Policy</li>
                        <li>Cookie Policy</li>
                        <li>Company</li>
                    </ul>
                </footer>

        </div>
    );
}

export default Register;