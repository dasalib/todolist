import { useState } from "react";
import './main.css'

export const Modal = ({ addNewTodo, closeModal }) => {

  const [isModalOpen, setModalOpen] = useState(false);
  const openModal = () => {
    setModalOpen((prevState) => !prevState)
  };

  closeModal = () => {
    setModalOpen(false);
  };

  const [todos, setTodos] = useState([]);

  const [input, setInput] = useState('');

  const handleChange = (e) => {
    setInput(e.target.value);
  };
  
  const handleClick = () => {
    addNewTodo(input);
    closeModal();
    setInput('');
  };

  return (<>
    <button className="addButton"
    onClick={openModal}>+</button>
    {isModalOpen &&
    <div className="modal" >
        <p>Add New ToDo</p>
        <input value={input} onChange={handleChange} />
        <button onClick={handleClick}>Add</button>
    </div>}
    </>)
}