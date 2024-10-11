import { useEffect, useState } from "react"

export default function Todo(){
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [todos, setTodos] = useState([]);
    const [error, setError] = useState("");
    const [message, setMessage] = useState("");

    const apiUrl = "http://localhost:8000/api"
    const handleSubmit = () => {
        setError("")

        if (title.trim() !== '' && description.trim() !== '') {
            fetch(apiUrl+"/todos", {
                method: "POST",
                headers: {
                    'Content-Type':'application/json'
                },
                body: JSON.stringify({title, description})
            }).then((res) => {
                if (res.ok) {
                    setTodos([...todos, {title, description}])
                    setTitle("");
                    setDescription("");
                    setMessage("Item added successfully")
                    setTimeout(() => {
                        setMessage("");
                    },3000)
    
                }else {
                    setTitle("");
                    setDescription("");
                    setError("Unable to create Todo item")
                }
            }).catch(() => {
                setError("Unable to create Todo item")
            })
        }
    }

    useEffect(() => {
        getItems()
    }, [])

    const getItems = () => {
        fetch(apiUrl+"/todos", {
            method: "GET"
        })
        .then((res) => res.json())
        .then((res) => {
            setTodos(res)
        })
    }

const handleDelete = (id) => {
    if(window.confirm('Are you sure')) {
        fetch(apiUrl+"/todos/"+id, {
            method: "DELETE"
        })
        .then(() => {
            const updatedTodos = todos.filter((item) => item._id !== id)
            setTodos(updatedTodos)
        })
    }
}

    return <>
        <div className="row p-3 bg-success text-light">
            <h1>ToDO Project using MERN stack</h1>
        </div>
        <div className="row">
            <h3>Add Item</h3>
            {message && <p className="text-success">{message}</p>}
            <div className="form-group d-flex gap-2">
                <input className="form-control" onChange={(e) => setTitle(e.target.value)} value={title} type="text" placeholder="Title"/>
                <input className="form-control" onChange={(e) => setDescription(e.target.value)} value={description} type="text" placeholder="Description"/>
                <button className="btn btn-dark" onClick={handleSubmit}>Submit</button>
            </div>
            {error && <p className="text-danger">{error}</p>}
        </div>
        <div className="row mt-3">
            <h3>Tasks</h3>
            <div className="col-md-6">
                <ul className="list-group">
                    {
                        todos.map((item) => 
                    <li className="list-group-item bg-info d-flex justify-content-between align-items-center my-2">
                        <div className="d-flex flex-column">
                            <span className="fw-bold">{item.title}</span>
                            <span>{item.description}</span>
                        </div>
                        <div>
                            <button className="btn btn-danger" onClick={() => handleDelete(item._id)}>Delete</button>
                        </div>
                    </li>)
                    }
                    
                </ul>
            </div>
        </div>
    </>
}