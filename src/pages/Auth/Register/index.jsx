import React, {useEffect} from 'react';
import RegisterStyles from "../Auth.module.scss";
import {Link, useNavigate} from "react-router-dom";
import IntlTelInput from "intl-tel-input/reactWithUtils";
import "intl-tel-input/styles";
import {useDispatch, useSelector} from "react-redux";
import {registerUser, selectIsRegged} from "../../../redux/slices/authSlice";
import {useForm} from "react-hook-form";

export default function Register() {
    const navigate = useNavigate();
    const isRegged = useSelector(selectIsRegged);
    const {error} = useSelector((state) => state.auth);
    const dispatch = useDispatch();

    const {
        register,
        handleSubmit,
        setValue,
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


    return (
        <div className={`${RegisterStyles.root}`}>
            <form className={`${RegisterStyles['login-form']}`} onSubmit={handleSubmit(onSubmit)}>
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
                            className={`${errors.email ? RegisterStyles['error-input'] : ''}`}
                            placeholder='Введіть ім`я'
                            {...register('name', {required: `Обов'язкове поле`})}
                        />
                    </div>
                    {errors.name && <div className={`${RegisterStyles['error-style']}`}>{errors.name.message}</div>}
                    <div className="d-flex flex-column">
                        <label>Прізвище</label>
                        <input
                            type="text"
                            className={`${errors.email ? RegisterStyles['error-input'] : ''}`}
                            placeholder='Введіть прізвище'
                            {...register('surname', {required: `Обов'язкове поле`})}

                        />
                    </div>
                    {errors.surname &&
                        <div className={`${RegisterStyles['error-style']}`}>{errors.surname.message}</div>}

                    <div className="d-flex flex-column">
                        <label>Пошта</label>
                        <input
                            type="text"
                            className={`${errors.email ? RegisterStyles['error-input'] : ''}`}
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
                    {errors.email && <div className={`${RegisterStyles['error-style']}`}>{errors.email.message}</div>}
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
                    {errors.phone && <div className={`${RegisterStyles['error-style']}`}>{errors.phone.message}</div>}

                    <div style={{marginTop: '10px'}} className="d-flex flex-column">
                        <label>Пароль</label>
                        <input
                            type={"password"}
                            className={`${errors.password ? RegisterStyles['error-input'] : ''}`}
                            placeholder='Введіть пароль'
                            {...register('password', {
                                required: `Пароль є обов'язковим полем`,
                                pattern: {
                                    value: /^(?=.*[A-Za-z])(?=.*\d)(?=.*[!@#$%^&*()_+[\]{};':"\\|,.<>\/?]).{8,}$/,
                                    message: "Пароль повинен містити не менше 8 символів, 1 букву, 1 цифру та 1 спеціальний символ"
                                }
                            })}
                        />

                    </div>
                    <button type="submit" className={`btn ${RegisterStyles['btn']}`}>Зареєструватись</button>
                    <p className={RegisterStyles.linkReg}><Link to={"/sign-in"}>Маєте аккаунт?
                        Увійти</Link>
                    </p>

                    {error && <div className={`${RegisterStyles.error}`}>{error}</div>}
                </div>
            </form>
        </div>
    );
}
