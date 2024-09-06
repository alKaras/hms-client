import React, {useState} from 'react';
import RegisterStyles from "../Auth.module.scss";
import {Link} from "react-router-dom";
import IntlTelInput from "intl-tel-input/reactWithUtils";
import "intl-tel-input/styles";

export default function Register() {
    const [number, setNumber] = useState(null);
    return (
        <div className={`${RegisterStyles.root}`}>
            <form className={`${RegisterStyles['login-form']}`}>
                <div className={`${RegisterStyles['auth-form-content']}`}>
                    <div className={RegisterStyles.authImage}>
                        <Link to={'/'}>
                            <img src="/assets/logo/logo.svg" alt="Logo"/>
                        </Link>
                    </div>
                    <h3 className={`${RegisterStyles['auth-form-title']}`}>Реєстрація</h3>
                    <div className="d-flex flex-column">
                        <label>Ім'я</label>
                        <input
                            type="text"
                            // className={`${errors.email ? RegisterStyles['error-input'] : ''}`}
                            placeholder='Введіть ім`я'
                        />
                    </div>
                    <div className="d-flex flex-column">
                        <label>Прізвище</label>
                        <input
                            type="text"
                            // className={`${errors.email ? RegisterStyles['error-input'] : ''}`}
                            placeholder='Введіть прізвище'
                        />
                    </div>
                    <div className="d-flex flex-column">
                        <label>Пошта</label>
                        <input
                            type="text"
                            // className={`${errors.email ? RegisterStyles['error-input'] : ''}`}
                            placeholder='Введіть пошту'
                        />
                    </div>
                    <div className="d-flex flex-column">
                        <label>Телефон</label>
                        <IntlTelInput
                            onChangeNumber={setNumber}
                            // onChangeValidity={setIsValid}
                            initOptions={{
                                initialCountry: "us",
                            }}
                        />
                    </div>
                    <div style={{marginTop: '10px'}} className="d-flex flex-column">
                        <label>Пароль</label>
                        <input
                            type={"password"}
                            // className={`${errors.password ? RegisterStyles['error-input'] : ''}`}
                            placeholder='Введіть пароль'
                        />

                    </div>
                    <button type="submit" className={`btn ${RegisterStyles['btn']}`}>Зареєструватись</button>
                    <p className={RegisterStyles.linkReg}><Link to={"/sign-in"}>Маєте аккаунт?
                        Увійти</Link>
                    </p>
                </div>
            </form>
        </div>
    );
}
