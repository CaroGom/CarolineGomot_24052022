import React from 'react';
import Log from '../components/Log'

const Connexion = () => {
    return (
        <div className='profil-page'>
            <div className='log-container'>
                <Log signin={true} signup={false} />
                <div className='img-container'>
                    <img src='./img/log.svg' alt='img log'/>
                </div>
            </div>
        </div>
    );
};

export default Connexion;