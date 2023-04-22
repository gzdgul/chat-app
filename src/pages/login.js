import React, {useState} from 'react';
import {login} from "../firebase";
import { CSSTransition } from 'react-transition-group';
import { Link } from 'react-router-dom';

function Login(props) {
    const [email,setEmail] = useState('')
    const [password,setPassword] = useState('')
    const [authorisedUser, setAuthorisedUser] = useState(false)

    const handleUserFormSubmit = async (e) => {
        e.preventDefault()
        const user = await login(email,password)
        if (user !== undefined) {
            setAuthorisedUser(true)
        }
        console.log(user)

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
                            <span>Login</span>
                            <form className={'form'} onSubmit={handleUserFormSubmit}>
                                <input className={'input'}
                                       type="email"
                                       placeholder={'e-mail'}
                                       value={email}
                                       onChange={e => setEmail(e.target.value) }/>
                                <input className={'input'}
                                       type="password"
                                       placeholder={'password'}
                                       value={password}
                                       onChange={e => setPassword(e.target.value) }/>
                                <button className={'button'} disabled={!email || !password} type={"submit"}>Log In</button>
                            </form>
                            <span>You don't have an account?  <Link className={'link'} to={'/register'}> Register </Link></span>

                        </div>
                        <div className={'test'}> </div>
                    </>
                </CSSTransition>
           </div>
           {/*<CSSTransition*/}
           {/*    in={!authorisedUser}*/}
           {/*    timeout={1000}*/}
           {/*    classNames="fade"*/}
           {/*    unmountOnExit>*/}
           <footer>
               <ul>
                   <li>Terms of Service</li>
                   <li>General Terms and Conditions</li>
                   <li>Privacy Policy</li>
                   <li>Cookie Policy</li>
                   <li>Company</li>
               </ul>
           </footer>
           {/*</CSSTransition>*/}
       </div>
    );
}

export default Login;