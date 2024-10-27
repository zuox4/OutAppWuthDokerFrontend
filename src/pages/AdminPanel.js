import React, { useEffect, useState } from "react";
import io from "socket.io-client";
import './AdminPanel.css';
import CardOut from "../components/CardOut";
import Header from "../components/Header";
import axios from "axios";
import reloadImages from "../assets/reload3.svg";
import {api_url} from "../api";
import {useParams} from "react-router-dom";
import moment from "moment";
const socket = io(api_url, {forceNew: true, transports: ["polling"]});
const uppercase_russian_alphabet = [
    'А', 'Б', 'В', 'Г', 'Д', 'Е', 'Ё', 'Ж', 'З', 'И', 'Й', 'К', 'Л', 'М', 'Н', 'О',
    'П', 'Р', 'С', 'Т', 'У', 'Ф', 'Х', 'Ц', 'Ч', 'Ш', 'Щ', 'Э', 'Ю', 'Я'
]

function AdminPanel() {
    const [messages, setMessages] = useState([]);
    const [filterText, setFilterText] = useState('');
    const [loading, setLoading] = useState(false);
    const [filterByToday, setFilterByToday] = useState(false);
    const [per, setPer] = useState('Все перемены')
    const [filterFirstLetter, setFilterFirstLetter] = useState('');
    const {schoolId} = useParams()
    const handleFilterChange = (e) => {
        setFilterText(e.target.value);
    };
    const hour = ['T08','T09','T10','T11','T12','T13','T14','T15']

    function filterBySchool(message){
        if (schoolId){
            if (schoolId==='99'){
                return [5,6,7,8,9,11].includes(parseInt(message.toLowerCase().split(' ')[4], 10))
            }
            if (schoolId==='97'){
                return [1,2,3,4].includes(parseInt(message.toLowerCase().split(' ')[4], 10))
            }
        }
        return []
    }


    const filteredMessages = messages.filter(msg =>
        // const filterByFirstLetter = msg.toLowerCase()[0].includes(filterFirstLetter.toLowerCase())

        msg.toLowerCase()[0].includes(filterFirstLetter.toLowerCase())
        &&filterBySchool(msg)
        &&msg.toLowerCase().includes((per==='Все перемены')?'':per.toLowerCase())
        && msg.toLowerCase().includes(filterText.toLowerCase())
        &&msg.toLowerCase().includes(filterByToday?formatDateString(Date.now()).split('T')[0]:'')
        // && msg.toLowerCase().includes(filterText.toLowerCase())
    );

    function formatDateString(dateString) {
        const date = new Date(dateString);
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        const hours = String(date.getUTCHours()).padStart(2, '0');
        const minutes = String(date.getUTCMinutes()).padStart(2, '0');
        return `${year}-${month}-${day}T${hours}:${minutes}`;
    }

    const handleClick = (letter) => {
        if (filterFirstLetter === letter) {
            setFilterFirstLetter(''); // Убираем выделение, если буква была выбрана
        } else {
            setFilterFirstLetter(letter); // Выбираем новую букву
        }
        setLoading(false)
    };
    async function loadMessages() {
        setLoading(true);
        try {
            await axios.get('/get_outs').then((data) => {
                const x = data.data.history_outs
                const newMessages = x.map(msg => msg.student_name + ' в ' + formatDateString(msg.data_time_out) + ' ' + msg.className);
                setMessages(newMessages)}).catch(e => {
            })
        } catch (err) {
            console.error(err);
        }
        setLoading(false);
    }
    useEffect(() => {
        loadMessages();
        // Обработка сообщений от сервера
        socket.on('server-message', (msg) => {
            setMessages(prevMessages => [...prevMessages, msg.split(' в ')[0] + ' в ' + msg.split(' в ')[1]]);
            console.log(msg.split(' в ')[1].split(' ')[0])
        });
    }, []);


    return (
        <div className="AdminPanel">
            <Header classGrad={''} nameApp={'School1298 Admin Panel'}/>
            <h1 style={{marginTop: '10px', marginLeft: '20px'}}>Запросы на выход</h1>

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
            <div className={'filter'} style={{
                display: 'flex',
                flexDirection: 'row',
                alignItems: "center",
                width: '100%',
                marginBottom:'10px',
                justifyContent: 'center'
            }}>
                <label htmlFor={'justtoday'} style={{color: "white", width: '600'}}>Сегодня</label>
                <input id={'justtoday'} type={'checkbox'} value={false}
                       onChange={() => setFilterByToday(!filterByToday)}/>
                <div>
                    <select style={{
                        width: '200px',
                        height: '30px',

                        fontWeight: 'bold',
                        textAlign: 'center'
                    }}
                            onChange={(e) => setPer(e.target.value)} value={per}>
                        {hour.map(h => <option>{h}</option>)}
                        <option>Все перемены</option>
                    </select>
                </div>
            </div>

            <div style={{
                height: 'fit-content',
                width: '100vw',

                marginBottom: '10px',
                display: 'flex',
                flexDirection: 'row',
                alignItems: 'center',
                flexWrap: "wrap",
                justifyContent: 'center',
                gap: '10px',
                paddingTop: '10px'
            }}>
                {uppercase_russian_alphabet.map(letter => <div key={letter} onClick={(e) => {
                    setFilterFirstLetter(letter);
                    handleClick(letter)
                }} style={{
                    background: filterFirstLetter === letter ? '#334371' : 'white',
                    color: filterFirstLetter === letter ? 'white' : 'black',
                    height: 'fit-content',
                    width: '23px',
                    borderRadius: '3px',
                    cursor:'pointer',
                    fontSize: '23px',
                    padding: '3px',
                }}>{letter}</div>)}
                <div onClick={() => setFilterFirstLetter('')}
                     style={{background: "white", padding: '3px', borderRadius: '3px', fontSize: '20px',}}>СБРОС
                </div>
            </div>

            <div className={'board'}>
                {!loading && filteredMessages.map((msg, index) => (
                    <CardOut filteredMessages={filteredMessages} filterText={filterText} index={index} key={index}
                             msg={msg} order={index}/>
                ))}
            </div>

            <img src={reloadImages} alt={'reload'} style={{position: "fixed", bottom: 20, width: '90px'}}
                 onClick={() => window.location.reload()}/>
        </div>
    );
}

export default AdminPanel;