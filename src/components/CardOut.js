import React, {useEffect, useState} from "react";

function CardOut({msg, order}) {





    function formatMessage(message){
        const childName = message.split(' ')[0] +' '+ message.split(' ')[1];
        const timeOut = formatDateTime(message.split(' ')[message.split(' ').length-1])
        const dateOut = Number(new Date(message.split(' ')[message.split(' ').length-1]))
        const dateNow = Date.now()
        return {name:childName, timeOut:timeOut, confirmOut:dateOut <= dateNow?'Выход разрешен':'Выход запрещен'};
    }

    function formatDateTime(dateTimeString) {
        // Создаем объект даты из строки
        const date = new Date(dateTimeString);

        // Извлекаем необходимые компоненты даты и времени
        const day = String(date.getDate()).padStart(2, '0');
        const month = String(date.getMonth() + 1).padStart(2, '0'); // Месяцы в JavaScript начинаются с 0
        const hours = String(date.getHours()).padStart(2, '0');
        const minutes = String(date.getMinutes()).padStart(2, '0');

        // Формируем строку в нужном формате
        return `${day}.${month} в ${hours}:${minutes}`;
    }
    return(
        <div className="CardOut" style={{backgroundColor:(formatMessage(msg).confirmOut==="Выход разрешен")?'green':'red', order:-order}}>
                <h4>Имя ученика: <span style={{textTransform:'uppercase'}}>{formatMessage(msg).name}</span></h4>
                <h4>Время выхода: <span>{formatMessage(msg).timeOut}</span></h4>
                <span style={{textTransform:'uppercase', marginTop:'11px', fontWeight:'bold'}}>{formatMessage(msg).confirmOut}</span>
        </div>
    )
}

export default CardOut;