import React, {useState} from 'react';
import {Link} from "react-router-dom";
import AuthStyles from '../Auth.module.scss';

export default function Login() {
    const [isShowed, setIsShowed] = useState(false);
    const [passType, setPassType] = useState("password");

    const togglePass = (e) => {
        e.preventDefault();
        if (passType === "password") {
            setPassType("text");
            setIsShowed(true);
        } else {
            setPassType("password");
            setIsShowed(false);
        }
    }

    return (
        <>
            <div className={`${AuthStyles.root}`}>
                <form className={`${AuthStyles['login-form']}`}>
                    <div className={`${AuthStyles['auth-form-content']}`}>
                        <div className={AuthStyles.authImage}>
                            <Link to={'/'}>
                                <img src="/assets/logo/logo.svg" alt="Logo"/>
                            </Link>

                        </div>
                        <h3 className={`${AuthStyles['auth-form-title']}`}>Вхід</h3>
                        <div className="d-flex flex-column">
                            <label>Пошта</label>
                            <input
                                type="text"
                                // className={`${errors.email ? AuthStyles['error-input'] : ''}`}
                                placeholder='Введіть свою пошту'
                            />
                        </div>
                        <div style={{position: 'relative'}} className="d-flex flex-column">
                            <label>Пароль</label>
                            <input
                                type={passType}
                                // className={`${errors.password ? AuthStyles['error-input'] : ''}`}
                                placeholder='Введіть свій пароль'
                            />

                            <button onClick={togglePass} className={`${AuthStyles['btn-show']}`}>
                                {!isShowed ? <><i style={{marginLeft: '20px'}} className={`fa-regular fa-eye`}></i></>
                                    : <><i style={{marginLeft: '20px'}} className="fa-regular fa-eye-slash"></i></>}
                            </button>

                        </div>
                        <button type="submit" className={`btn ${AuthStyles['btn']}`}>Увійти</button>
                        <p className={AuthStyles.linkReg}><Link to={"/sign-up"}>Досі ще не з нами? Зареєструватись</Link></p>
                    </div>
                </form>
            </div>
        </>
    );
}
