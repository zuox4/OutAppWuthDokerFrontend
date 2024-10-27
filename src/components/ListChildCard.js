import React, {useEffect, useState} from "react";
import ChildCard from "./ChildCard";
import axios from "axios";

function ListChildCard({setModal, isOpen, setActiveChildCard, activeChildCardName,dataStudents}) {

    const [childCards, setChildCards] = useState(dataStudents);
    const [filterInput, setFilterInput] = useState('');
    return(
        <div className="ListChildCard" style={{display: 'flex', flexDirection: 'column', alignItems: 'center'}}>
            <h1 style={{textAlign: 'center', marginTop:'10px', color:'white', fontSize:'25px'}}>Мой класс</h1>
            <div style={{width:'200px', backgroundColor:'white', height:'2px', marginBottom:'10px', marginTop:'10px'}}></div>
            <input type={'text'} style={{height:'15px', width:'300px',fontSize:'15px',marginBottom:'10px',padding:'7px',textAlign:'center'}} placeholder={'Поиск'} onChange={(e)=>setFilterInput(e.target.value)} value={filterInput}/>
            {childCards.filter(item=>item.fullName.toLowerCase().includes(filterInput.toLowerCase())).map((childCard, index) => (
                <ChildCard key={index} childCard={childCard} activeChildCardName={activeChildCardName}
                           setModal={setModal} isOpen={isOpen} setActiveChildCard={setActiveChildCard}/>))}
            <div style={{height:'100px'}}></div>
        </div>
    )
}

export default ListChildCard;