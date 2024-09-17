import React, { useState } from 'react';
import ActionHospitalStyles from './HospitalPage.module.scss';
import Header from '../../../../components/Header';
import { useNavigate, useParams } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import axios from '../../../../utils/axios';
import { createHospital } from '../../../../redux/slices/hospitalSlice';

export default function ActionHospital({ isEdit }) {
    const [title, setTitle] = useState(null);
    const [address, setAddress] = useState(null);
    const [alias, setAlias] = useState(null);
    const [hospitalEmail, setHospitalEmail] = useState(null);
    const [hospitalPhone, setHospitalPhone] = useState(null);
    const [hospitalDescription, setHospDescr] = useState(null);

    const { _id } = useParams();
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        let params;
        if (isEdit) {
            params = {
                title,
                address,
                hospitalDescription,
                hospitalEmail,
                hospitalPhone
            };
            await axios.put(`hospital/edit/${_id}`, params)
                .then((resp) => {
                    // alert("Hospital info changed successfully");
                    // navigate('/adminpanel/hospitals');
                })
                .catch((err) => {
                    alert("Something went wrong");
                    console.log(err);
                })
        } else {
            params = {
                title,
                alias,
                address,
                hospitalDescription,
                hospitalEmail,
                hospitalPhone
            };
            dispatch(createHospital(params))
                .then((resp) => {
                    alert("Hospital integrated successfully");
                    navigate('/adminpanel/hospitals');
                })
        }
    }

    return (
        <>
            <Header />
            <div className={`${ActionHospitalStyles.actionRoot} d-flex align-items-center justify-content-center`}>
                <form className={`${ActionHospitalStyles['login-form']}`} onSubmit={handleSubmit}>
                    <div className={`${ActionHospitalStyles['auth-form-content']}`}>
                        <h3 style={{ fontWeight: 'bold', fontSize: '18px', marginBottom: '25px', textAlign: 'center' }}>
                            {isEdit ? "Відредагувати лікарню" : "Інтегрувати лікарню"}
                        </h3>
                        <div className="d-flex flex-column">
                            <label>Назва</label>
                            <input
                                type="text"
                                value={title}
                                onChange={(e) => setTitle(e.target.value)}
                                placeholder='Введіть назву лікарні'
                            />
                        </div>

                        {isEdit ? (
                            <></>
                        ) : (
                            <div className="d-flex flex-column">
                                <label>Слаг</label>
                                <input
                                    type="text"
                                    value={alias}
                                    onChange={(e) => setAlias(e.target.value)}
                                    placeholder='Введіть слаг (test-hospital)'
                                />
                            </div>
                        )}
                        <div className="d-flex flex-column">
                            <label>Адреса</label>
                            <input
                                type="text"
                                value={address}
                                onChange={(e) => setAddress(e.target.value)}
                                placeholder='Введіть адресу'
                            />
                        </div>
                        <div className="d-flex flex-column">
                            <label>Пошта лікарні</label>
                            <input
                                type="email"
                                placeholder='Введіть пошту'
                                value={hospitalEmail}
                                onChange={(e) => setHospitalEmail(e.target.value)}
                            />
                        </div>
                        <div className="d-flex flex-column">
                            <label>Телефон лікарні</label>
                            <input
                                type="text"
                                value={hospitalPhone}
                                placeholder={'+380 (50) 000 0000'}
                                onChange={(e) => setHospitalPhone(e.target.value)}
                            />
                        </div>
                        <div className="d-flex flex-column">
                            <label>Опис</label>
                            <input
                                style={{ padding: '10px', border: '1px solid dodgerblue', resize: 'none' }}
                                type="text"
                                value={hospitalDescription}
                                onChange={(e) => setHospDescr(e.target.value)}
                            />
                        </div>
                        <button type="submit" className={`btn ${ActionHospitalStyles['btn']}`}>{isEdit ? "Зберегти" : "Створити"}</button>
                    </div>
                </form>
            </div>
        </>
    );
}