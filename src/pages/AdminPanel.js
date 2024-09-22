import React, {useEffect, useState} from "react";
import io from "socket.io-client";
import './AdminPanel.css'
import CardOut from "../components/CardOut";
import logo from '../assets/logo.svg';
import Header from "../components/Header";
import axios from "axios";
const socket = io('http://91.77.160.177:4000/'); // URL вашего сервера

function AdminPanel() {
    const [messages, setMessages] = useState([]);
    const [filterText, setFilterText] = useState('');
    const [loading, setLoading] = useState(false);
    const [count, setCount] = useState(0);
    const [isRunning, setIsRunning] = useState(true);
    const [dateForFilter, setDateForFilter] = useState(formatDateString(Date.now()).split('T')[0]);
    const [chek, setChek] = useState(false);
    const handleFilterChange = (e) => {
        setFilterText(e.target.value);
    };

    const filteredMessages = messages.filter(msg =>

        chek?msg.toLowerCase().includes(filterText.toLowerCase())&&
        msg.toLowerCase().includes(dateForFilter):msg.toLowerCase().includes(filterText.toLowerCase())


    );
    function formatDateString(dateString) {
        // Создаем объект Date из строки
        const date = new Date(dateString);

        // Получаем компоненты даты
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0'); // Месяцы начинаются с 0
        const day = String(date.getDate()).padStart(2, '0');

        // Получаем часы и минуты, добавляя 3 часа для перевода в другой часовой пояс
        const hours = String(date.getUTCHours() + 3).padStart(2, '0');
        const minutes = String(date.getUTCMinutes()).padStart(2, '0');

        // Формируем итоговую строку
        return `${year}-${month}-${day}T${hours}:${minutes}`;
    }
    async function loadMessages() {
        setLoading(true)
        await axios.get('http://91.77.160.177:4001/get_outs')
            .then(res => {
                const x = res.data.history_outs;
                x.map(msg => {

                    setMessages(prevMessages => [...prevMessages, msg.student_name + ' в ' + formatDateString(msg.data_time_out)]);
                    console.log(msg.student_name + ' в ' + formatDateString(msg.data_time_out))
                });
            })
            .catch(err => console.log(err))
        setLoading(false)
    }
    useEffect(() => {

        loadMessages()
        // Получаем сообщение от сервера
        socket.on('server-message', (msg) => {
            setMessages((prevMessages) => [...prevMessages, msg]);
        });

        return () => {
            socket.off('server-message');
        };
    }, []);
    useEffect(() => {
        let interval;

        if (isRunning) {
            // Устанавливаем интервал для обновления компонента каждую секунду
            interval = setInterval(() => {
                setCount(prevCount => prevCount + 1);

            }, 1000);
        }

        // Очистка интервала при размонтировании или изменении isRunning
        return () => {
            if (interval) {
                clearInterval(interval);

            }
        };
    }, [isRunning]); // Используем isRunning как зависимость


    return(
        <div className="AdminPanel">

            <Header classGrad={''} nameApp={'School1298 Admin Panel'}/>
            <h1 style={{marginTop:'10px',marginLeft:'20px'}}>Запросы на выход</h1>


            <div className="filter-form"
                 style={{display: 'flex', flexDirection: 'column', alignItems: "center", width: '100%'}}>
                <input
                    type="text"
                    placeholder="Поиск пропуска"
                    value={filterText}
                    onChange={handleFilterChange}
                    className="filter-input"
                    style={{
                        height: '30px',
                        width: '300px',
                        fontSize: '15px',
                        marginBottom: '10px',
                        padding: '3px',
                        textAlign: 'center'
                    }}

                />
            </div>
            <div className={'filter'} style={{display: 'flex', flexDirection: 'row', alignItems: "center", width: '100%', marginBottom:'10px',justifyContent:'center'}}>
                <label form={'justtoday'} style={{color:"white", width:'600'}}>Cегодня</label>
                <input id={'justtoday'} type={'checkbox'}  value={false} onChange={() => setChek(!chek)}/>
            </div>
            <div className={'board'}>

                {!loading && filteredMessages.map((msg, index) => (
                    <CardOut filteredMessages={filteredMessages} filterText={filterText} index={index} key={index}
                             msg={msg} order={index}/>
                ))}
            </div>
        </div>
    )
}

export default AdminPanel;