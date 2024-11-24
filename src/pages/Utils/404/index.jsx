import React, { useEffect } from 'react'
import ForbiddenStyles from './Forbidden.module.scss';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';
import { infoAboutUser, selectIsLogged, selectRoles } from '../../../redux/slices/authSlice';
import { Button, Image } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';

export const NonExistedPage = () => {
    const { t } = useTranslation();
    const { i18n } = useTranslation();

    const isLogged = useSelector(selectIsLogged);
    const user = useSelector(infoAboutUser);
    const role = isLogged && user.roles;

    const navigate = useNavigate();

    useEffect(() => {
        const savedLanguage = localStorage.getItem('language') || 'uk';
        i18n.changeLanguage(savedLanguage);
    }, [])

    const redirectToHome = (e, role) => {
        e.preventDefault();

        let destination = role === 'user' ? '/' :
            role === 'doctor' ? '/adminpanel/services' :
                role === 'manager' ? '/adminpanel/users' : '/adminpanel/hospitals'

        navigate(destination);
    }
    return (
        <div className={ForbiddenStyles.root}>
            <div className={ForbiddenStyles.content}>
                <div className={ForbiddenStyles.image}>
                    <Image
                        src="/assets/404.jpg"
                        alt="404"
                        fluid
                    />
                </div>

                <div className={ForbiddenStyles.textContent}>
                    <h1 className={ForbiddenStyles.heading}>
                        404
                    </h1>
                    <div className={ForbiddenStyles.body}>
                        {t('pageNotFound')}
                    </div>
                </div>

                <div>
                    <Button onClick={(e) => redirectToHome(e, role)} className='btn btn-primary'>
                        {t('returnHome')}
                    </Button>
                </div>



            </div>
        </div>
    )
}