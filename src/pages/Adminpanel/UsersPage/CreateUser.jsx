import React, { useEffect, useState } from 'react';
import Header from '../../../components/Header';
import createUserStyle from './PatientsPage.module.scss';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
// import { createUser } from '../../../redux/slices/userSlice';
import { createUser } from '../../../api/httpApiClient';
import { LinkContainer } from 'react-router-bootstrap';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';
import { infoAboutUser, selectIsLogged } from '../../../redux/slices/authSlice';

export default function CreateUser(props) {
    const navigate = useNavigate();
    const [error, setError] = useState('');
    const [isCreated, setIsCreated] = useState(false);

    const location = useLocation();

    const queryParams = new URLSearchParams(location.search);
    const hospitalId = queryParams.get('hospital') ?? null;

    const isLogged = useSelector(selectIsLogged);
    const user = useSelector(infoAboutUser);
    const isAllowedToView = (isLogged && hospitalId !== null) && ((user.roles === 'manager' && Number(user.hospitalId) === Number(hospitalId)) || (user.roles === 'admin'));

    console.log(hospitalId);
    console.log(isAllowedToView);

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
        // dispatch(createUser(values));
        createUser({
            ...values,
            hospital_id: hospitalId,
            isManager: Boolean(hospitalId),
        }).then((resp) => {
            alert("User Created Successfully");
            setIsCreated(true);
        }).catch((err) => {
            console.log(err);
            alert("Something went wrong while creating user");
            setIsCreated(false);
        })

    }

    const { i18n } = useTranslation();

    useEffect(() => {
        const savedLanguage = localStorage.getItem('language') || 'uk';
        i18n.changeLanguage(savedLanguage);

        if (hospitalId && !isAllowedToView) {
            navigate('/404');
        }

        if (isCreated) {
            navigate('/adminpanel/users');
        }
    }, [isCreated, isLogged])

    const { t } = useTranslation();

    return (
        <>
            <Header />
            <div className={`${createUserStyle.formCreate}`}>
                <form className={`${createUserStyle['login-form']}`} onSubmit={handleSubmit(onSubmit)}>
                    <div className={`${createUserStyle['auth-form-content']}`}>
                        <h3 className={`${createUserStyle['auth-form-title']}`}>{t('addUser')}</h3>
                        <div className="d-flex flex-column">
                            <label>{t('firstname')}</label>
                            <input
                                type="text"
                                className={`${errors.email ? createUserStyle['error-input'] : ''}`}
                                placeholder={t('firstname')}
                                {...register('name', { required: `${t('required')}` })}
                            />
                        </div>
                        {errors.name && <div className={`${createUserStyle['error-style']}`}>{errors.name.message}</div>}
                        <div className="d-flex flex-column">
                            <label>{t('lastname')}</label>
                            <input
                                type="text"
                                className={`${errors.email ? createUserStyle['error-input'] : ''}`}
                                placeholder={t('lastname')}
                                {...register('surname', { required: `${t('required')}` })}

                            />
                        </div>
                        {errors.surname &&
                            <div className={`${createUserStyle['error-style']}`}>{errors.surname.message}</div>}

                        <div className="d-flex flex-column">
                            <label>{t('email')}</label>
                            <input
                                type="text"
                                className={`${errors.email ? createUserStyle['error-input'] : ''}`}
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
                        {errors.email && <div className={`${createUserStyle['error-style']}`}>{errors.email.message}</div>}
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
                        {errors.phone && <div className={`${createUserStyle['error-style']}`}>{errors.phone.message}</div>}

                        <div style={{ marginTop: '10px' }} className="d-flex flex-column">
                            <label>{t('password')}</label>
                            <input
                                type={"password"}
                                className={`${errors.password ? createUserStyle['error-input'] : ''}`}
                                placeholder={t('password')}
                                {...register('password', {
                                    required: `${t('required')}`,
                                    pattern: {
                                        value: /^(?=.*[A-Za-z])(?=.*\d)(?=.*[!@#$%^&*()_+[\]{};':"\\|,.<>\/?]).{8,}$/,
                                        message: `${t('msgPassword')}`
                                    }
                                })}
                            />
                            {errors.password && <div className={`${createUserStyle['error-style']}`}>{errors.password.message}</div>}
                        </div>
                        <button type="submit" className={`btn ${createUserStyle['btn']}`}>{t('create')}</button>
                        <Link to={'/adminpanel/users'} style={{ color: 'dodgerblue' }}>{t('back')}</Link>

                        {error && <div className={`${createUserStyle.error}`}>{error}</div>}
                    </div>
                </form>
            </div>

        </>
    );
}