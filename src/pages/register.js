import React, {useEffect, useState} from 'react';
import {register, updateDisplayName, setUserData} from "../firebase";
import { Link } from "react-router-dom";
import { CSSTransition } from 'react-transition-group';
import ModalAvatar from "../components/modal-avatar";
import useSelectAvatar from "../stores/useSelectAvatar";
import useToggleAvatarMenu from "../stores/useToggleAvatarMenu";

function Register(props) {
    const [email,setEmail] = useState('')
    const [password,setPassword] = useState('')
    const [displayName,setDisplayName] = useState('')
    const [errMesage,setErrMesage] = useState('')
    const [authorisedUser, setAuthorisedUser] = useState(false)
    // const [avatarMenu, setAvatarMenu] = useState(false)
    const avatarLink = useSelectAvatar(state => state.avatarLink);
    const avatarMenu = useToggleAvatarMenu(state => state.avatarMenu);
    const setAvatarMenu = useToggleAvatarMenu(state => state.setAvatarMenu);
    const avatarArr = [
        'https://i.ibb.co/LCTkL59/avatar-logo-k.jpg',
        'https://i.ibb.co/k2GTQMj/avatar-logo.jpg',
        'https://i.ibb.co/gTM32Bn/avatar-star.jpg',
        'https://i.ibb.co/YhSHryg/avatar2.jpg',
        'https://i.ibb.co/rGfSstZ/avatar-1.png',
        'https://i.ibb.co/WxMs27X/avatar3.jpg',
        'https://i.ibb.co/t3DYPqT/avatar4.jpg',
        'https://i.ibb.co/GMqFfGn/avatar5.jpg',
        'https://i.ibb.co/MV0c2sD/avatar6.jpg',
        'https://i.ibb.co/wwQTW6v/avatar7.jpg',
        'https://i.ibb.co/2SrNpps/avatar8.jpg',
        'https://i.ibb.co/fk4XcVs/avatar9.jpg',
        'https://i.ibb.co/C1jgWC0/avatar10.jpg',
        'https://i.ibb.co/tq6nsW4/avatar11.jpg',
        'https://i.ibb.co/VxNv13V/avatar12.jpg'
    ]

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
            const userData = await setUserData(displayName,email,avatarLink)
            console.log('USERDATA',userData)
        }catch (err) {
        }
    }
    const handleClickChangeAvatar = () => {
        setAvatarMenu(true)
    }
    return (
        <div className={'screen'}>
            {
                avatarMenu &&
                <div className={'modal-avatar-collection'}>
                    {
                        avatarArr.map((x) => {
                            return <ModalAvatar avatarLink = {x}/>
                        })
                    }
                </div>

            }
            {
                !avatarMenu &&
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
                                    <div className={'avatar-container'}>
                                        <span className={'change-avatar'} onClick={handleClickChangeAvatar}>change avatar</span>
                                        <div className={'avatars'}><img src={avatarLink} alt=""/></div>
                                    </div>
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
            }

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