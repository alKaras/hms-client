import React, { useEffect } from 'react';
import { Spinner } from "react-bootstrap";
import HospitalStyles from './Hospital.module.scss';
import { Link } from "react-router-dom";
import { useTranslation } from 'react-i18next';

export default function Hospital({
    _id,
    title,
    imageUrl,
    rating,
    description,
    children,
    isFullContent,
    isLoading
}) {
    const { t } = useTranslation();
    const { i18n } = useTranslation();

    useEffect(() => {
        const savedLanguage = localStorage.getItem('language') || 'uk';
        i18n.changeLanguage(savedLanguage);
    }, []);
    return (
        <>
            {isLoading ?
                <>
                    <Spinner animation="border" variant="warning" />
                </>
                :
                <>
                    <div
                        className={`${isFullContent ? HospitalStyles['fullpost'] : HospitalStyles['root']} shadow-lg mb-5 bg-white`}>

                        {isFullContent ?
                            <>
                                <div className={`breadcr`}>
                                    <Link to={'/'}>
                                        {t('home')}
                                    </Link>
                                    <span> / </span><span > {title}</span>
                                </div>
                            </>
                            :
                            <>
                            </>

                        }
                        {/* {imageUrl ?
                            <>
                                <div
                                    className={`${!isFullContent ? HospitalStyles['post-img'] : HospitalStyles['fullpost-img']}`}>
                                    <img
                                        src={imageUrl}
                                        alt="phot"
                                        className='img-fluid'
                                    />
                                </div>
                            </>
                            :
                            <>
                            </>

                        } */}

                        <div className={`${HospitalStyles['text-content']}`}>
                            <div className={`${HospitalStyles['title-wrapper']}`}>
                                {!isFullContent ?
                                    <>

                                        <Link style={{ cursor: 'pointer' }} to={`/hospital/${_id}`}>
                                            <div className={`${HospitalStyles['post-headtext']}`}>
                                                {title}
                                            </div>
                                            <div className={`${HospitalStyles.postDescr}`}>{description}</div>
                                        </Link>
                                    </>
                                    :
                                    <>
                                        <div className={`${HospitalStyles['share']}`}>
                                            <div className={`${HospitalStyles['full-headtext']}`}>
                                                {title}
                                            </div>
                                        </div>

                                    </>
                                }
                            </div>

                            {children && <div className={`${HospitalStyles['full-descr']}`}>{children}</div>}
                        </div>
                    </div>
                </>
            }
        </>
    );
}
