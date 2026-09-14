
import { useState, useEffect } from 'react'

function App() {
    // =========================
    // STATE
    // =========================

    const [token, setToken] = useState('')

    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')

    const [names, setNames] = useState([])
    const [firstName, setFirstName] = useState('')
    const [lastName, setLastName] = useState('')
    const [editingId, setEditingId] = useState(null)

    useEffect(() => {
    const savedToken = localStorage.getItem('token')

    if (savedToken) {
        setToken(savedToken)
        }
    }, [])




    // =========================
    // AUTHENTICATION
    // =========================

    async function login(e) {
        e.preventDefault()

        const response = await fetch(
            'http://127.0.0.1:8000/api/login',
            {
                method: 'POST',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    email,
                    password,
                }),
            }
        )

        const data = await response.json()

        console.log(data)

        if (!response.ok) {
            return
        }

        localStorage.setItem('token', data.token)
        setToken(data.token)
    }

    async function logout() {
        const response = await fetch(
            'http://127.0.0.1:8000/api/logout',
            {
                method: 'POST',
                headers: {
                    'Accept': 'application/json',
                    'Authorization': `Bearer ${token}`,
                },
            }
        )

        const data = await response.json()

        console.log(data)

        if (!response.ok) {
            return
        }

        localStorage.removeItem('token')
        setToken('')
    }

    // =========================
    // READ
    // =========================

    async function getNames() {
        const response = await fetch(
            'http://127.0.0.1:8000/api/names',
            {
                headers: {
                    'Accept': 'application/json',
                    'Authorization': `Bearer ${token}`,
                },
            }
        )

        const data = await response.json()

        console.log(data)

        if (!response.ok) {
            return
        }

        setNames(data.data)
    }


    // =========================
    // CREATE
    // =========================

    async function addName(e) {
        e.preventDefault()

        const response = await fetch(
            'http://127.0.0.1:8000/api/names',
            {
                method: 'POST',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`,
                },
                body: JSON.stringify({
                    first_name: firstName,
                    last_name: lastName,
                }),
            }
        )

        const data = await response.json()

        console.log(data)

        if (!response.ok) {
            return
        }

        clearForm()
        getNames()
    }


    // =========================
    // UPDATE
    // =========================

    async function updateName(e) {
        e.preventDefault()

        const response = await fetch(
            `http://127.0.0.1:8000/api/names/${editingId}`,
            {
                method: 'PUT',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`,
                },
                body: JSON.stringify({
                    first_name: firstName,
                    last_name: lastName,
                }),
            }
        )

        const data = await response.json()

        console.log(data)

        if (!response.ok) {
            return
        }

        clearForm()
        getNames()
    }


    // =========================
    // DELETE
    // =========================

    async function deleteName(id) {
        const response = await fetch(
            `http://127.0.0.1:8000/api/names/${id}`,
            {
                method: 'DELETE',
                headers: {
                    'Accept': 'application/json',
                    'Authorization': `Bearer ${token}`,
                },
            }
        )

        const data = await response.json()

        console.log(data)

        if (!response.ok) {
            return
        }

        getNames()
    }


    // =========================
    // EDIT MODE
    // =========================

    function editName(name) {
        setEditingId(name.id)
        setFirstName(name.first_name)
        setLastName(name.last_name)
    }


    // =========================
    // FORM HELPERS
    // =========================

    function clearForm() {
        setFirstName('')
        setLastName('')
        setEditingId(null)
    }


    // =========================
    // UI
    // =========================

    return (
        <div style={{
            maxWidth: '600px',
            margin: '40px auto',
            fontFamily: 'Arial',
        }}>

            <h1>React + Laravel</h1>


            {/* =========================
                LOGIN SCREEN
            ========================= */}

            {!token && (
                <section>
                    <h2>Login</h2>

                    <form onSubmit={login}>
                        <input
                            type="email"
                            placeholder="Email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                        />

                        <input
                            type="password"
                            placeholder="Password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                        />

                        <button type="submit">
                            Login
                        </button>
                    </form>
                </section>
            )}


            {/* =========================
                APPLICATION
            ========================= */}

            {token && (
                <section>
                    <h2>Names</h2>

                    <button onClick={getNames}>
                        Get Names
                    </button>


                    {/* ADD / UPDATE FORM */}

                    <h3>
                        {editingId ? 'Edit Name' : 'Add Name'}
                    </h3>

                    <form onSubmit={editingId ? updateName : addName}>

                        <input
                            type="text"
                            placeholder="First name"
                            value={firstName}
                            onChange={(e) => setFirstName(e.target.value)}
                        />

                        <input
                            type="text"
                            placeholder="Last name"
                            value={lastName}
                            onChange={(e) => setLastName(e.target.value)}
                        />

                        <button type="submit">
                            {editingId ? 'Update Name' : 'Add Name'}
                        </button>

                        {editingId && (
                            <button
                                type="button"
                                onClick={clearForm}
                            >
                                Cancel
                            </button>
                        )}

                    </form>


                    {/* NAME LIST */}

                    <ul>
                        {names.map((name) => (
                            <li key={name.id}>
                                {name.first_name} {name.last_name}

                                <button
                                    onClick={() => editName(name)}
                                >
                                    Edit
                                </button>

                                <button
                                    onClick={() => deleteName(name.id)}
                                >
                                    Delete
                                </button>
                            </li>
                        ))}
                    </ul>
                    <button onClick={logout}>
                        Logout
                    </button>
                </section>
            )}

        </div>
    )
}

export default App
