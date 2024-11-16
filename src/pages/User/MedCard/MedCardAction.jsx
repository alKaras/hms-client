import React, { useEffect, useState } from 'react'
import Header from '../../../components/Header'
import MedCardStyles from './MedCard.module.scss';
import { Button, Form } from 'react-bootstrap';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';
import { infoAboutUser, selectIsLogged } from '../../../redux/slices/authSlice';
import { DatePicker, LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { createMedCard } from '../../../api/httpApiClient';
import { format } from 'date-fns';

export const MedCardAction = ({ isEdit }) => {
    const { t } = useTranslation();
    const [loaded, setLoaded] = useState(false);
    const [birthdate, setBirthDate] = useState('');
    const [formData, setFormData] = useState({
        user_id: 0,
        firstname: '',
        lastname: '',
        gender: '',
        contact_number: '',
        address: '',
        blood_type: '',
        allergies: '',
        chronic_conditions: '',
        current_medications: '',
        emergency_contact_name: '',
        emergency_contact_phone: '',
        insurance_details: '',
        additional_notes: '',
    });

    const user = useSelector(infoAboutUser);
    const isLogged = useSelector(selectIsLogged);

    useEffect(() => {
        if (!isEdit && isLogged) {
            setFormData({
                user_id: user.id,
                firstname: user.data.name,
                lastname: user.data.surname,
                contact_number: user.data.phone,
            });
        }
    }, [isLogged]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value })
    }

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (isEdit) {

        } else {
            createMedCard({
                ...formData,
                date_birthday: format(birthdate, 'yyyy-MM-dd'),
            })
                .then((resp) => {
                    alert(resp.data.message);
                })
                .catch((err) => {
                    console.log(err);
                })
        }
    }




    return (
        <>
            <Header />
            <div className={MedCardStyles.root}>
                <h1 style={{ textAlign: 'center', fontSize: '18px', fontWeight: 'bold', marginBottom: '25px' }}>Заповнити мед картку</h1>
                <Form onSubmit={handleSubmit}>
                    <div className='d-flex justify-content-between align-items-center'>
                        <Form.Group>
                            <Form.Label>{t('firstname')}</Form.Label>
                            <Form.Control
                                type='text'
                                name='firstname'
                                value={formData.firstname}
                                onChange={(e) => handleChange(e)}
                                placeholder={t('firstname')}
                                required={true}
                            />
                        </Form.Group>

                        <Form.Group>
                            <Form.Label>{t('lastname')}</Form.Label>
                            <Form.Control
                                type='text'
                                name='lastname'
                                value={formData.lastname}
                                onChange={(e) => handleChange(e)}
                                placeholder={t('lastname')}
                                required={true}
                            />
                        </Form.Group>

                        <Form.Group>
                            <Form.Label>{t('contact_number')}</Form.Label>
                            <Form.Control
                                type='text'
                                name='contact_number'
                                value={formData.contact_number}
                                onChange={(e) => handleChange(e)}
                                placeholder={t('contact_number')}
                                required={true}
                            />
                        </Form.Group>

                        <div style={{ alignSelf: 'flex-end' }}>
                            <LocalizationProvider dateAdapter={AdapterDateFns}>
                                <DatePicker
                                    label={t('date_birthday')}
                                    value={birthdate}
                                    format='dd.MM.yyyy'
                                    onChange={(newDate) => {
                                        if (newDate) {
                                            setBirthDate(newDate);
                                        }

                                    }}
                                />
                            </LocalizationProvider>
                        </div>

                        <Form.Group>
                            <Form.Label>{t('gender')}</Form.Label>
                            <Form.Control
                                as="select"
                                name='gender'
                                onChange={(e) => handleChange(e)}
                                value={formData.gender}
                                style={{ maxWidth: 'fit-content', border: '1px solid dodgerblue' }}
                                required={true}

                            >
                                <option value={""} disabled>Choose gender</option>
                                <option value={"male"}>Male</option>
                                <option value={"female"}>Female</option>
                                <option value={"non-binary"}>Non-binary</option>
                            </Form.Control>
                        </Form.Group>
                    </div>

                    <div style={{ marginTop: '25px' }} className='d-flex justify-content-evenly align-items-center'>
                        <Form.Group>
                            <Form.Label>{t('address')}</Form.Label>
                            <Form.Control
                                type='text'
                                name='address'
                                value={formData.address}
                                onChange={(e) => handleChange(e)}
                                placeholder={t('address')}
                                required={true}
                            />
                        </Form.Group>
                        <Form.Group>
                            <Form.Label>{t('emergency_contact_name')}</Form.Label>
                            <Form.Control
                                type='text'
                                name='emergency_contact_name'
                                value={formData.emergency_contact_name}
                                onChange={(e) => handleChange(e)}
                                placeholder={t('emergency_contact_name')}
                                required={true}
                            />
                        </Form.Group>
                        <Form.Group style={{ marginLeft: '25px' }}>
                            <Form.Label>{t('emergency_contact_phone')}</Form.Label>
                            <Form.Control
                                type='text'
                                name='emergency_contact_phone'
                                value={formData.emergency_contact_phone}
                                onChange={(e) => handleChange(e)}
                                placeholder={t('emergency_contact_phone')}
                                required={true}
                            />
                        </Form.Group>
                        <Form.Group>
                            <Form.Label>{t('blood_type')}</Form.Label>
                            <Form.Control
                                type='text'
                                name='blood_type'
                                value={formData.blood_type}
                                onChange={(e) => handleChange(e)}
                                placeholder={t('blood_type')}
                            />
                        </Form.Group>
                    </div>
                    <div style={{ marginTop: '50px', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                        <Form.Group style={{ marginBottom: '25px' }}>
                            <Form.Label style={{ fontWeight: 'bold' }}>{t('allergies')}</Form.Label>
                            <Form.Control
                                as="textarea"
                                style={{ border: '1px solid dodgerblue', resize: 'none' }}
                                rows={3}
                                value={formData.allergies}
                                placeholder={t('allergies')}
                                name="allergies"
                                onChange={(e) => handleChange(e)}
                            />
                        </Form.Group>

                        <Form.Group style={{ marginBottom: '25px' }} className="d-flex flex-column">
                            <Form.Label style={{ fontWeight: 'bold' }}>{t('chronic_conditions')}</Form.Label>
                            <Form.Control
                                as="textarea"
                                style={{ border: '1px solid dodgerblue', resize: 'none' }}
                                rows={3}
                                value={formData.chronic_conditions}
                                placeholder={t('chronic_conditions')}
                                name="chronic_conditions"
                                onChange={(e) => handleChange(e)}
                            />
                        </Form.Group>

                        <Form.Group style={{ marginBottom: '25px' }} className="d-flex flex-column">
                            <Form.Label style={{ fontWeight: 'bold' }}>{t('current_medications')}</Form.Label>
                            <Form.Control
                                as="textarea"
                                style={{ border: '1px solid dodgerblue', resize: 'none' }}
                                rows={3}
                                value={formData.current_medications}
                                placeholder={t('current_medications')}
                                name="current_medications"
                                onChange={(e) => handleChange(e)}
                            />
                        </Form.Group>

                        <Form.Group style={{ marginBottom: '25px' }} className="d-flex flex-column">
                            <Form.Label style={{ fontWeight: 'bold' }}>{t('insurance_details')}</Form.Label>
                            <Form.Control
                                as="textarea"
                                style={{ border: '1px solid dodgerblue', resize: 'none' }}
                                rows={3}
                                value={formData.insurance_details}
                                placeholder={t('insurance_details')}
                                name="insurance_details"
                                onChange={(e) => handleChange(e)}
                            />
                        </Form.Group>

                        <Form.Group style={{ marginBottom: '25px' }} className="d-flex flex-column">
                            <Form.Label style={{ fontWeight: 'bold' }}>{t('additional_notes')}</Form.Label>
                            <Form.Control
                                as="textarea"
                                style={{ border: '1px solid dodgerblue', resize: 'none' }}
                                rows={3}
                                value={formData.additional_notes}
                                placeholder={t('additional_notes')}
                                name="additional_notes"
                                onChange={(e) => handleChange(e)}
                            />
                        </Form.Group>

                        <Button type='submit' className='btn btn-success'>
                            {t('save')}
                        </Button>
                    </div>
                </Form>
            </div>
        </>
    )
}
