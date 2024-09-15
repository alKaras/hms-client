import React, { useEffect, useState } from 'react';
import Header from '../../../components/Header';
import createUserStyle from './PatientsPage.module.scss';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { useForm } from 'react-hook-form';
import { createUser } from '../../../redux/slices/userSlice';
import { LinkContainer } from 'react-router-bootstrap';

export default function CreateUser(props) {
    const navigate = useNavigate();
    const { error } = useSelector((state) => state.auth);
    const dispatch = useDispatch();
    const [isCreated, setIsCreated] = useState(false);

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
        dispatch(createUser(values));
        setIsCreated(true);
    }
    useEffect(() => {
        if (isCreated) {
            navigate('/adminpanel/users');
        }
    })
    return (
        <>
            <Header />
            <div className={`${createUserStyle.formCreate}`}>
                <form className={`${createUserStyle['login-form']}`} onSubmit={handleSubmit(onSubmit)}>
                    <div className={`${createUserStyle['auth-form-content']}`}>
                        <h3 className={`${createUserStyle['auth-form-title']}`}>Створити користувача</h3>
                        <div className="d-flex flex-column">
                            <label>Ім'я</label>
                            <input
                                type="text"
                                className={`${errors.email ? createUserStyle['error-input'] : ''}`}
                                placeholder='Введіть ім`я'
                                {...register('name', { required: `Обов'язкове поле` })}
                            />
                        </div>
                        {errors.name && <div className={`${createUserStyle['error-style']}`}>{errors.name.message}</div>}
                        <div className="d-flex flex-column">
                            <label>Прізвище</label>
                            <input
                                type="text"
                                className={`${errors.email ? createUserStyle['error-input'] : ''}`}
                                placeholder='Введіть прізвище'
                                {...register('surname', { required: `Обов'язкове поле` })}

                            />
                        </div>
                        {errors.surname &&
                            <div className={`${createUserStyle['error-style']}`}>{errors.surname.message}</div>}

                        <div className="d-flex flex-column">
                            <label>Пошта</label>
                            <input
                                type="text"
                                className={`${errors.email ? createUserStyle['error-input'] : ''}`}
                                placeholder='Введіть пошту'
                                {...register('email', {
                                    required: `Обов'язкове поле`,
                                    pattern: {
                                        value: /[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,}$/,
                                        message: "Некоректний формат пошти"
                                    }
                                })}

                            />
                        </div>
                        {errors.email && <div className={`${createUserStyle['error-style']}`}>{errors.email.message}</div>}
                        <div className="d-flex flex-column">
                            <label>Телефон</label>
                            <input
                                type="text"
                                placeholder={'+380 (50) 000 0000'}
                                {...register('phone', {
                                    required: 'Обов\'язкове поле',
                                    pattern: {
                                        value: "/^\\+380\\d{9}$/",
                                        message: "Некоректний формат телефону"
                                    }
                                })}
                            />
                        </div>
                        {errors.phone && <div className={`${createUserStyle['error-style']}`}>{errors.phone.message}</div>}

                        <div style={{ marginTop: '10px' }} className="d-flex flex-column">
                            <label>Пароль</label>
                            <input
                                type={"password"}
                                className={`${errors.password ? createUserStyle['error-input'] : ''}`}
                                placeholder='Введіть пароль'
                                {...register('password', {
                                    required: `Пароль є обов'язковим полем`,
                                    pattern: {
                                        value: /^(?=.*[A-Za-z])(?=.*\d)(?=.*[!@#$%^&*()_+[\]{};':"\\|,.<>\/?]).{8,}$/,
                                        message: "Пароль повинен містити не менше 8 символів, 1 букву, 1 цифру та 1 спеціальний символ"
                                    }
                                })}
                            />
                            {errors.password && <div className={`${createUserStyle['error-style']}`}>{errors.password.message}</div>}
                        </div>
                        <button type="submit" className={`btn ${createUserStyle['btn']}`}>Створити</button>
                        <Link to={'/adminpanel/users'} style={{ color: 'dodgerblue' }}>Повернутись назад</Link>

                        {error && <div className={`${createUserStyle.error}`}>{error}</div>}
                    </div>
                </form>
            </div>

        </>
    );
}