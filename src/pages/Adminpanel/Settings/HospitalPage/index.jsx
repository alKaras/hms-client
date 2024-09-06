import React from 'react';

export default function HospitalPage({
                                         specific
                                     }) {
    return (
        <>
            {specific ? <>
                <div>1 Hospital</div>
            </> : <>
                <div>Hospitals</div>
            </>
            }
        </>
    );
}
