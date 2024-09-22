import React, {useEffect, useState} from "react";
import ChildCard from "./ChildCard";
import axios from "axios";

function ListChildCard({setModal, isOpen, setActiveChildCard, activeChildCardName,dataStudents}) {

    const [childCards, setChildCards] = useState(dataStudents);

    // async function getStudentsByTeacher(teacherId) {
    //     try {
    //         // Выполним GET-запрос к вашему серверу Flask
    //         const response = await axios.get(`http://91.77.160.177:4001/students_by_teacher/${teacherId}`);
    //
    //         // Обработка полученных данных
    //         const students = response.data.students;
    //
    //         // Например, выводим данные в консоль
    //         console.log("Список студентов:", students);
    //         setChildCards(students)
    //         // Здесь можно добавить дополнительную логику обработки
    //         // Например, обновление состояния в React, если вы используете его
    //         return students;  // Возвращаем список студентов
    //
    //     } catch (error) {
    //         // Обработка ошибок запроса
    //         console.error("Ошибка при получении данных:", error);
    //         // Можно также обработать конкретно, если нет данных или произошла ошибка
    //         if (error.response) {
    //             // Сервер ответил с кодом состояния, отличным от 2xx
    //             console.error("Ошибка сервера:", error.response.data);
    //         } else if (error.request) {
    //             // Запрос был сделан, но ответа не было
    //             console.error("Нет ответа от сервера:", error.request);
    //         } else {
    //             // Произошла ошибка при настройке запроса
    //             console.error("Ошибка:", error.message);
    //         }
    //     }
    // }
    // useEffect(() => {
    //     getStudentsByTeacher(1)
    // }, []);
    return(
        <div className="ListChildCard" style={{display: 'flex', flexDirection: 'column', alignItems: 'center'}}>
            <h1 style={{textAlign: 'center', marginTop:'10px', color:'white', fontSize:'25px'}}>Мой класс</h1>
            <div style={{width:'200px', backgroundColor:'white', height:'2px', marginBottom:'10px', marginTop:'10px'}}></div>
            {childCards.map((childCard, index) => (
                <ChildCard key={index} childCard={childCard} activeChildCardName={activeChildCardName}
                           setModal={setModal} isOpen={isOpen} setActiveChildCard={setActiveChildCard}/>))}
            <div style={{height:'100px'}}></div>
        </div>
    )
}

export default ListChildCard;