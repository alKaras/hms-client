import React, {useEffect, useState} from 'react';
import {Link, useNavigate} from "react-router-dom";
import AuthStyles from '../Auth.module.scss';
import {useDispatch, useSelector} from "react-redux";
import {loginUser, selectIsLogged, selectIsRegged} from "../../../redux/slices/authSlice";
import {useForm} from "react-hook-form";

export default function Login() {
    const [isShowed, setIsShowed] = useState(false);
    const [passType, setPassType] = useState("password");

    const isLogged = useSelector(selectIsLogged);
    const {error} = useSelector((state) => state.auth);
    const navigate = useNavigate();
    const dispatch = useDispatch();

    const {
        register,
        handleSubmit,
        formState: {
            errors,
        }
    } = useForm({
        defaultValues: {
            email: "",
            password: "",
        },
        mode: "onChange",
    });

    const onSubmit = (values) => {
        dispatch(loginUser(values));
    }

    useEffect(() => {
        if (isLogged) {
            navigate('/');
        }
    }, [isLogged, navigate]);

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
                <form className={`${AuthStyles['login-form']}`} onSubmit={handleSubmit(onSubmit)}>
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
                                className={`${errors.email ? AuthStyles['error-input'] : ''}`}
                                placeholder='Введіть свою пошту'
                                {...register('email', {
                                    required: `Пошта є обов'язковим полем`,
                                    pattern: {
                                        value: /[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,}$/,
                                        message: "Некоректний формат пошти"
                                    }
                                })}
                            />
                        </div>
                        {errors.email && <div className={`${AuthStyles['error-style']}`}>{errors.email.message}</div>}

                        <div style={{position: 'relative'}} className="d-flex flex-column">
                            <label>Пароль</label>
                            <input
                                type={passType}
                                className={`${errors.password ? AuthStyles['error-input'] : ''}`}
                                placeholder='Введіть свій пароль'
                                {...register('password', {
                                    required: `Пароль є обов'язковим полем`,
                                    pattern: {
                                        value: /^(?=.*[A-Za-z])(?=.*\d)(?=.*[!@#$%^&*()_+[\]{};':"\\|,.<>\/?]).{8,}$/,
                                        message: "Пароль повинен містити не менше 8 символів, 1 букву, 1 цифру та 1 спеціальний символ"
                                    }
                                })}
                            />
                            {errors.password && <div className={`${AuthStyles['error-style']}`}>{errors.password.message}</div>}

                            <button onClick={togglePass} className={`${AuthStyles['btn-show']}`}>
                                {!isShowed ? <><i style={{marginLeft: '20px'}} className={`fa-regular fa-eye`}></i></>
                                    : <><i style={{marginLeft: '20px'}} className="fa-regular fa-eye-slash"></i></>}
                            </button>

                        </div>
                        <button type="submit" className={`btn ${AuthStyles['btn']}`}>Увійти</button>
                        <p className={AuthStyles.linkReg}><Link to={"/sign-up"}>Досі ще не з нами?
                            Зареєструватись</Link></p>
                    </div>
                </form>
            </div>
        </>
    );
}
