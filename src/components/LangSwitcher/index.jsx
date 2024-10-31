import React from 'react'
import { Dropdown, DropdownButton } from 'react-bootstrap';
import { useTranslation } from 'react-i18next'

export const LangSwitcher = () => {
    const { i18n } = useTranslation();
    const { t } = useTranslation();

    const changeLanguage = (lng) => {
        i18n.changeLanguage(lng);
    }
    return (
        <DropdownButton style={{ alignSelf: 'center', marginLeft: '20px' }} id="dropdown-basic-button" title={<><i class="fa-solid fa-language"></i></>}>
            <Dropdown.Item style={{ display: 'flex', alignItems: 'center' }} onClick={() => changeLanguage('uk')}>
                <img alt='ua' src="/assets/icons/ukraine.png" style={{ marginRight: '10px' }} width={24} height={24} />
                <span >{t('ua')}</span>
            </Dropdown.Item>
            <Dropdown.Item style={{ display: 'flex', alignItems: 'center' }} onClick={() => changeLanguage('en')}>
                <img alt='en' src="/assets/icons/england.png" style={{ marginRight: '10px' }} width={24} height={24} />
                <span>{t('eng')}</span>
            </Dropdown.Item>
        </DropdownButton>
    )
}
