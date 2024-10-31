import React, { useEffect } from 'react';
import RegisterStyles from "../Auth.module.scss";
import { Link, useNavigate } from "react-router-dom";
import "intl-tel-input/styles";
import { useDispatch, useSelector } from "react-redux";
import { registerUser, selectIsRegged } from "../../../redux/slices/authSlice";
import { useForm } from "react-hook-form";
import { useTranslation } from 'react-i18next'

export default function Register() {
    const navigate = useNavigate();
    const isRegged = useSelector(selectIsRegged);
    const { error } = useSelector((state) => state.auth);
    const dispatch = useDispatch();

    const {
        register,
        handleSubmit,
        formState: {
            errors,
        },
    } = useForm({
        defaultValues: {
            name: "",
            surname: "",
            email: "",
            phone: "",
            password: "",
        },
        mode: "onChange",
    });

    const onSubmit = (values) => {
        dispatch(registerUser(values));
    }

    useEffect(() => {
        if (isRegged) {
            navigate("/sign-in")
        }
    }, [isRegged, navigate]);

    const { t } = useTranslation();

    return (
        <div className={`${RegisterStyles.root}`}>
            <form className={`${RegisterStyles['login-form']}`} onSubmit={handleSubmit(onSubmit)}>
                <div className={`${RegisterStyles['auth-form-content']}`}>
                    <div className={RegisterStyles.authImage}>
                        <Link to={'/'}>
                            <img src="/assets/logo/logo.svg" alt="Logo" />
                        </Link>
                    </div>
                    <h3 className={`${RegisterStyles['auth-form-title']}`}>{t('register')}</h3>
                    <div className="d-flex flex-column">
                        <label>{t('firstname')}</label>
                        <input
                            type="text"
                            className={`${errors.email ? RegisterStyles['error-input'] : ''}`}
                            placeholder={t('firstname')}
                            {...register('name', { required: `${t('required')}` })}
                        />
                    </div>
                    {errors.name && <div className={`${RegisterStyles['error-style']}`}>{errors.name.message}</div>}
                    <div className="d-flex flex-column">
                        <label>{t('lastname')}</label>
                        <input
                            type="text"
                            className={`${errors.email ? RegisterStyles['error-input'] : ''}`}
                            placeholder={t('lastname')}
                            {...register('surname', { required: `${t('required')}` })}

                        />
                    </div>
                    {errors.surname &&
                        <div className={`${RegisterStyles['error-style']}`}>{errors.surname.message}</div>}

                    <div className="d-flex flex-column">
                        <label>{t('email')}</label>
                        <input
                            type="text"
                            className={`${errors.email ? RegisterStyles['error-input'] : ''}`}
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
                    {errors.email && <div className={`${RegisterStyles['error-style']}`}>{errors.email.message}</div>}
                    <div className="d-flex flex-column">
                        <label>{t('phone')}</label>
                        <input
                            type="text"
                            placeholder={'+380 (50) 000 0000'}
                            {...register('phone', {
                                required: `${t('required')}`,
                                pattern: {
                                    value: "/^\\+380\\d{9}$/",
                                    message: `${t('incorrectFormat')}`
                                }
                            })}
                        />
                    </div>
                    {errors.phone && <div className={`${RegisterStyles['error-style']}`}>{errors.phone.message}</div>}

                    <div style={{ marginTop: '10px' }} className="d-flex flex-column">
                        <label>{t('password')}</label>
                        <input
                            type={"password"}
                            className={`${errors.password ? RegisterStyles['error-input'] : ''}`}
                            placeholder={t('password')}
                            {...register('password', {
                                required: `${t('required')}`,
                                pattern: {
                                    value: /^(?=.*[A-Za-z])(?=.*\d)(?=.*[!@#$%^&*()_+[\]{};':"\\|,.<>\/?]).{8,}$/,
                                    message: `${t('msgPassword')}`
                                }
                            })}
                        />

                    </div>
                    <button type="submit" className={`btn ${RegisterStyles['btn']}`}>{t('registerLink2')}</button>
                    <p className={RegisterStyles.linkReg}><Link to={"/sign-in"}>{t('authLink')}</Link>
                    </p>

                    {error && <div className={`${RegisterStyles.error}`}>{error}</div>}
                </div>
            </form>
        </div>
    );
}
