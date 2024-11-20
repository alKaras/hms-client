import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from "react-router-dom";
import AuthStyles from '../Auth.module.scss';
import { useDispatch, useSelector } from "react-redux";
import { infoAboutUser, loginUser, selectIsLogged, selectIsRegged, selectRoles } from "../../../redux/slices/authSlice";
import { useForm } from "react-hook-form";
import { useTranslation } from 'react-i18next';

export default function Login() {
    const [isShowed, setIsShowed] = useState(false);
    const [passType, setPassType] = useState("password");

    const isLogged = useSelector(selectIsLogged);
    const roles = useSelector(selectRoles);
    const user = useSelector(infoAboutUser);
    console.log(roles);
    const { error } = useSelector((state) => state.auth);
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

    const { i18n } = useTranslation();

    useEffect(() => {
        const savedLanguage = localStorage.getItem('language') || 'uk';
        i18n.changeLanguage(savedLanguage);
        if (isLogged && roles === 'doctor') {
            navigate('/adminpanel/services');
            window.location.reload();
        } else if (isLogged && roles === 'admin') {
            navigate('/adminpanel/hospitals');
            window.location.reload();
        } else if (isLogged && roles === 'manager') {
            navigate(`/adminpanel/users`);
            window.location.reload();
        } else if (isLogged && roles === 'user') {
            navigate('/');
            window.location.reload();
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

    const { t } = useTranslation();
    return (
        <>
            <div className={`${AuthStyles.root}`}>
                <form className={`${AuthStyles['login-form']}`} onSubmit={handleSubmit(onSubmit)}>
                    <div className={`${AuthStyles['auth-form-content']}`}>
                        <div className={AuthStyles.authImage}>
                            <Link to={'/'}>
                                <img src="/assets/logo/logo.svg" alt="Logo" />
                            </Link>
                        </div>
                        <h3 className={`${AuthStyles['auth-form-title']}`}>{t('auth')}</h3>
                        <div className="d-flex flex-column">
                            <label>{t('email')}</label>
                            <input
                                type="text"
                                className={`${errors.email ? AuthStyles['error-input'] : ''}`}
                                placeholder={t('email')}
                                {...register('email', {
                                    required: `${t('required')}`,
                                    pattern: {
                                        value: /[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,}$/,
                                        message: `${t('incorrectFormat')}`
                                    }
                                })}
                            />
                        </div>
                        {errors.email && <div className={`${AuthStyles['error-style']}`}>{errors.email.message}</div>}

                        <div style={{ position: 'relative' }} className="d-flex flex-column">
                            <label>{t('password')}</label>
                            <input
                                type={passType}
                                className={`${errors.password ? AuthStyles['error-input'] : ''}`}
                                placeholder={t('password')}
                                {...register('password', {
                                    required: `${t('required')}`,
                                    pattern: {
                                        value: /^(?=.*[A-Za-z])(?=.*\d)(?=.*[!@#$%^&*()_+[\]{};':"\\|,.<>\/?]).{8,}$/,
                                        message: `${t('msgPassword')}`
                                    }
                                })}
                            />


                            <button onClick={togglePass} className={`${AuthStyles['btn-show']}`}>
                                {!isShowed ? <><i style={{ marginLeft: '20px' }} className={`fa-regular fa-eye`}></i></>
                                    : <><i style={{ marginLeft: '20px' }} className="fa-regular fa-eye-slash"></i></>}
                            </button>

                        </div>
                        {errors.password && <div className={`${AuthStyles['error-style']}`}>{errors.password.message}</div>}
                        <button type="submit" className={`btn ${AuthStyles['btn']}`}>{t('login')}</button>
                        <p className={AuthStyles.linkReg}><Link to={"/sign-up"}>{t('registerLink')}</Link></p>
                    </div>
                </form>
            </div>
        </>
    );
}
