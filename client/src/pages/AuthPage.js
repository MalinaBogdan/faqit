import React, { useContext, useEffect, useState } from 'react'
import { AuthContext } from '../context/AuthContext'
import { useHttp } from '../hooks/http.hook'
import Axios from 'axios'
import authImg from '../image/auth.png'

export const AuthPage = () => {
    const auth = useContext(AuthContext)
    const { loading, request, error, clearError } = useHttp()
    const [promp, setPromp] = useState('')
    const [form, setForm] = useState({
        login: '', password: '', name: '', surname: '', email: '', avatar: ''
    })
    const [registration, setRegistration] = useState(false)
    
    useEffect(() => {
        if (error != null) {
            setPromp(error)
        }
        clearError()
    }, [error, clearError, promp])

    const changeFile = async (event) => {
        document.querySelector("#file").innerHTML = 'Selected'
        const formData = new FormData();
        formData.append('myImage', event.target.files[0]);

        Axios.post('/api/auth/upload', formData)
            .then(res => setForm({ ...form, avatar: res.data }))
            .then(console.log(form, 'lkmlkm'))
    }

    const changeHandler = event => {
        setForm({ ...form, [event.target.name]: event.target.value }) 
    }
        
    const registerHandler = async () => {
        console.log(form)
        if (!registration) {
            setRegistration(!registration)
        } else {
            try {
                const data = await request('/api/auth/register', 'POST', { ...form })
                setPromp(data.message)
                await setRegistration(!registration)
                await loginHandler()
            } catch (e) {
                console.log(e)
            }
        }
    }

    const loginHandler = async () => {
        if (registration) {
            setRegistration(!registration)
        } else {
            try {      
                const data = await request('/api/auth/login', 'POST', { ...form })
                auth.login(data.token, data.userId)
            } catch (e) {
                console.log(e)
            }
        }
    }

    return (
        <div>
            <h1>FAQIT</h1>
            <div className="form-wrap">
                    <div className="form-auth">
                        {registration ? 
                            <div className="card-content white-text">
                                <h3 className="card-title">Register</h3>
                                <div className="input-field">
                                        <input
                                            placeholder="Enter name"
                                            id="name"
                                            type="text"
                                            name="name"
                                            className="custom-input"
                                            onChange={changeHandler}
                                        />
                                </div>
                                <div className="input-field">
                                        <input
                                            placeholder="Enter surname"
                                            id="surname"
                                            type="text"
                                            name="surname"
                                            className="custom-input"
                                            onChange={changeHandler}
                                        />
                                </div>
                                <div className="input-field">
                                        <input
                                            placeholder="Enter login"
                                            id="login"
                                            type="text"
                                            name="login"
                                            className="custom-input"
                                            onChange={changeHandler}
                                        />
                                </div>
                                <div className="input-field">
                                        <input
                                            placeholder="Enter email"
                                            id="email"
                                            type="text"
                                            name="email"
                                            className="custom-input"
                                            onChange={changeHandler}
                                        />
                                </div>
                                <div className="input-field">
                                        <input
                                            placeholder="Enter password"
                                            id="password"
                                            type="password"
                                            name="password"
                                            className="custom-input"
                                            onChange={changeHandler}
                                        />
                                </div>
                                <div className="input__wrapper">
                                    <input
                                        type="file"
                                        name="file"
                                        id="input__file"
                                        accept=".jpg, .jpeg, .png"
                                        className="input__file"
                                        onChange={changeFile}>
                                    </input>
                                    <label htmlFor="input__file" className="input__file-button" id="file">Select an avatar</label>
                                </div>
                            </div>
                            :
                             <div className="card-content">
                                <h3 className="card-title">Authorization</h3>
                                <div className="input-field">
                                        <input
                                            placeholder="Enter login"
                                            id="login"
                                            type="text"
                                            name="login"
                                            className="custom-input"
                                            onChange={changeHandler}
                                        />
                                </div>
                                <div className="input-field">
                                        <input
                                            placeholder="Enter password"
                                            id="password"
                                            type="password"
                                            name="password"
                                            className="custom-input"
                                            onChange={changeHandler}
                                        />
                                </div>
                            </div>
                        }
                        <p className="auth-promp">{ promp }</p>
                        <div className="card-action">
                            <button
                                onClick={loginHandler}
                                disabled={loading}
                            >
                                Log in
                            </button>
                            <button
                                onClick={registerHandler}
                                disabled={loading}
                            >
                                Sign up
                            </button>
                        </div>
                    </div>
                <img src={ authImg } alt={"auth-img"}></img>
            </div>
        </div>
    )
}
