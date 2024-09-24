import './PagesStyle.css'

import ListChildCard from "../components/ListChildCard";
import ModalWindow from "../components/ModalWindow";
import React, {useContext, useEffect, useState} from "react";
import Header from "../components/Header";
import io from "socket.io-client";
import Footer from "../components/Footer";
import axios from "axios";
import {UserId} from "../App";


const socket = io('http://91.77.160.177:4000/'); // URL вашего сервера
function ClientPanel() {
    const [message, setMessage] = useState('');
    const [modal, setModal] = React.useState(false);
    const [activeChildCardName, setActiveChildCard] = React.useState({fullName:'', id:'', numberPhone:'', birthDate:''});
    const [dataStudents, setDataStudents] = React.useState([]);
    const [className, setClassName] = React.useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [dateOut, setDateOut] = React.useState(Date.now());
    const { user } = useContext(UserId);
    function parseDate(dateString) {
        // Проверяем, заканчивается ли строка буквой 'Z'
        if (dateString.endsWith('Z')) {
            dateString = dateString.slice(0, -1); // Убираем 'Z'
        }

        // Разбиваем строку на дату и время
        const [datePart, timePart] = dateString.split('T');
        const [year, month, day] = datePart.split('-').map(Number);
        const [hours, minutes] = timePart.split(':').map(Number);

        // Создаём объект Date, учитывая UTC
        const date = new Date(Date.UTC(year, month - 1, day, hours, minutes));
        return date;
    }
    const sendMessage = () => {
        // Отправляем сообщение на сервер
        socket.emit('client-message', message);

        fix(user.id, parseDate(dateOut)).then(r => alert('Пропуск успешно оформлен')).catch(e => alert('Произошла ошибка'));
        console.log(parseDate(dateOut))
        setMessage('');
    };

        const fix = async (teacherId, date_out) => {
            const studentId = activeChildCardName.id;
            try {

                const response = await axios.post(`http://91.77.160.177:4001/fix_out`, { mentor_id:teacherId, student_id:studentId, date_out:date_out});
                console.log(response.data)
                return response.data;
            }catch (er){

                console.log(er);
            }

    }


    async function fetchClassInfoByTeacher(teacherId) {

        try {

            // Выполняем GET запрос к эндпоинту
            const response = await axios.get(`http://91.77.160.177:4001/get_info_mentor/${teacherId}`);

            // Обрабатываем полученные данные
            const { className, students } = response.data;
            console.log(students);
            setDataStudents(students)
            setClassName(className)
            console.log(`Класс: ${className}`);

            if (students.length > 0) {
                console.log('Список студентов:');
                students.forEach(student => {
                    console.log(`ID: ${student.id}, ФИО: ${student.fullName}, Телефон: ${student.numberPhone}`);
                });
            } else {
                console.log('Нет студентов в классе.');
            }

        } catch (error) {
            // Обрабатываем ошибки
            if (error.response) {
                // Сервер вернул ответ с кодом состояния, который выходит за пределы 2xx
                console.error('Ошибка при получении данных:', error.response.data);
            } else if (error.request) {
                // Запрос был сделан, но ответ не получен
                console.error('Нет ответа от сервера:', error.request);
            } else {
                // Произошла ошибка при настройке запроса
                console.error('Ошибка при настройке запроса:', error.message);
            }
        }
    setIsLoading(false)
    }

    useEffect(() => {
        setIsLoading(true)
        fetchClassInfoByTeacher(user.id)
    }, []);

    return(
        !isLoading&&<div className="main-page">
            <Header classGrad={className} nameApp={'Классный помощник'}/>
            {<ListChildCard dataStudents={dataStudents} setModal={setModal} setActiveChildCard={setActiveChildCard} activeChildCardName={activeChildCardName} />}
            <ModalWindow setDateOut={setDateOut} sendMessage={sendMessage} setMessage={setMessage} isOpen={modal} setModal={setModal} setActiveChildCard={setActiveChildCard} className={className} fullName={activeChildCardName.fullName} id={activeChildCardName.id}  />
            <Footer/>
        </div>
    )
}
export default ClientPanel;