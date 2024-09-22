import React from "react";
import './Footer.css'
import home from '../assets/homeicon.svg'
import exit from '../assets/exitacc.svg'
import history from '../assets/history2.svg'
import attention from '../assets/attention.svg'
import {useNavigate} from "react-router-dom";
function Footer() {
    const navigate = useNavigate();

    function handleSubmit() {
        localStorage.removeItem('user');
        navigate('/')
    }
    return (
        <div className={'nav-bar'} style={{ display: 'flex', justifyContent: 'space-around' }}>

            <button><img className={'icons-menu focus'} src={home} alt={'home'}/></button>
            {/*<button><img className={'icons-menu'} src={attention} alt={'home'}/></button>*/}
            {/*<button><img className={'icons-menu'} src={history} alt={'home'}/></button>*/}
            <button onClick={()=>handleSubmit()}><img className={'icons-menu'} src={exit} alt={'home'}/></button>
        </div>
    )

}
export default Footer;