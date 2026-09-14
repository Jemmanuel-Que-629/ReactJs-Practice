import { useState } from 'react'

function App() {
    const [token, setToken] = useState('')
    const [names, setNames] = useState([])

    const [firstName, setFirstName] = useState('')
    const [lastName, setLastName] = useState('')

    async function login() {
        const response = await fetch(
            'http://127.0.0.1:8000/api/login',
            {
                method: 'POST',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    email: 'jemmanuel@example.com',
                    password: 'password123',
                }),
            }
        )

        const data = await response.json()

        console.log(data)

        setToken(data.token)
    }

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

        setFirstName('')
        setLastName('')

        getNames()
    }

    return (
        <>
            <h1>React + Laravel</h1>

            <button onClick={login}>
                Login
            </button>

            <button onClick={getNames}>
                Get Names
            </button>

            <h2>Add Name</h2>

            <form onSubmit={addName}>
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
                    Add Name
                </button>
            </form>

            <h2>Names</h2>

            <ul>
                {names.map((name) => (
                    <li key={name.id}>
                        {name.first_name} {name.last_name}
                    </li>
                ))}
            </ul>
        </>
    )
}

export default App