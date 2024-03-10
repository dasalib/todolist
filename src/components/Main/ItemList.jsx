import { useEffect, useState, useRef } from 'react';
import './main.css';


const ItemList = () => {

    const [isModalOpen, setModalOpen] = useState(false);
  
    const openModal = () => {
      setModalOpen((prevState) => !prevState)
    };
  
    const [todoNew, setTodoNew] = useState('');
    //for todo's input
  
    const [filteredStatus, setFilteredStatus] = useState("active")
  
    const [todo, setTodo] = useState([{
      id: Date.now(),
      title: "My first todo. Add, complete and remove items.",
      isDone: false,
      isTrashed: false,
      isDeleted: false
    }]);
  
      
    const handleClick = () => {
        addTodo();
        setModalOpen(false);
        setTodoNew('');
      };

      const saveTodoToLocalStorage = (todoItems) => {
        localStorage.setItem('todoItems', JSON.stringify(todoItems));
    };

    const getTodoFromLocalStorage = () => {
      const storedTodoItems = localStorage.getItem('todoItems');
      return storedTodoItems ? JSON.parse(storedTodoItems) : [];
  };

  // useEffect hook to load todo items from localStorage when component mounts
  useEffect(() => {
      const storedTodoItems = getTodoFromLocalStorage();
      setTodo(storedTodoItems);
  }, []);
    
  const inputRef = useRef(null);
  useEffect(() => {
    if(isModalOpen) {
      inputRef.current.focus();
    }
  }, [isModalOpen])

    function addTodo() {
        if (todoNew.length==0) return null;
        const newTodoItem = {
          id: Date.now(),
          title: todoNew, 
          isDone: false,
          isTrashed: false,
          isDeleted: false
        }
        const updatedTodo = [...todo, newTodoItem];
        setTodo(updatedTodo);
        setTodoNew("");
        saveTodoToLocalStorage(updatedTodo);
      }
    
      function removeTodo(idx) {
        const newTodos = todo.filter((task) => task.id !== idx);
        setTodo(newTodos);
        saveTodoToLocalStorage(newTodos);
      }
    
      function toggleTodoDone(idx) {
        const newTodos = todo.map((todo_item) => todo_item.id === idx ? {...todo_item, isDone: !todo_item.isDone} : todo_item);
        setTodo(newTodos);
        saveTodoToLocalStorage(newTodos);
      }

      function trashTodo(idx) {
        const newTodos = todo.map((todo_item) => todo_item.id === idx ? {...todo_item, isTrashed: true} : todo_item)
        setTodo(newTodos);
        saveTodoToLocalStorage(newTodos);
      }      

      function untrashTodo(idx) {
        const newTodos = todo.map((todo_item) => todo_item.id === idx ? {...todo_item, isTrashed: false} : todo_item)
        setTodo(newTodos);
        saveTodoToLocalStorage(newTodos);
      }
    
      function changeStatus(newStatus) {
        setFilteredStatus(newStatus)
      }
    
      const filteredTodos = todo.filter((task) => {
        if (filteredStatus == "active" && task.isTrashed==false && task.isDone==false) return task;
        if (filteredStatus == "done" && task.isTrashed==false && task.isDone==true) return task;
        if (filteredStatus == "trashed" && task.isTrashed==true && task.isDeleted==false) return task;
      })
    

    return (
        <>
    <button className="addButton" onClick={openModal}>+</button>
        {isModalOpen &&
        <div className="modal" >
            <p>Add New ToDo</p>
            <input ref={inputRef} value={todoNew} onChange={(event) => setTodoNew(event.target.value)} className='todo_input'/>
            <button onClick={handleClick}>Add</button>
        </div>}        

        <div className="status_buttons">
            <button onClick={() => changeStatus('active')} className={filteredStatus === 'active' ? 'selected' : ''} >To Do</button>
            <button onClick={() => changeStatus('done')} className={filteredStatus === 'done' ? 'selected' : ''}>Done</button>
            <button onClick={() => changeStatus('trashed')} className={filteredStatus === 'trashed' ? 'selected' : ''}>Trash</button>
        </div>
        <div className='todo_container'>
        {filteredTodos.map((todo_item, idx) => (
            <div className='todo_item_container'>
            <input type='checkbox' checked={todo_item.isDone} onChange={() => toggleTodoDone(todo_item.id)} />
              <p className='todo_item'>{todo_item.title}</p>

              {filteredStatus !== 'trashed' && <button onClick={() => trashTodo(todo_item.id)} className='removeButton'>Remove</button>}

              {filteredStatus === 'trashed' && 
              (<div>
              <button onClick={() => untrashTodo(todo_item.id)} className='removeButton'>Move back to To Do</button>
              <button onClick={() => removeTodo(todo_item.id)} className='removeButton'>Delete Forever</button>
              </div>)}

            </div>
          ))}
        </div>
        </>
    )
}

export default ItemList;
