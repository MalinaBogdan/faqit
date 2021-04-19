import React, { useState, useContext, useEffect } from 'react'
import { AuthContext } from '../context/AuthContext'
import { useHttp } from '../hooks/http.hook'

export const CreatePost = () => {
  const { userId } = useContext(AuthContext)
  const { request } = useHttp()
  const [form, setForm] = useState({})

  const addPost = async () => {
    try {
            const data = await request('/api/post/add', 'POST', { ...form })
            console.log(data)
        } catch (e) {
            console.log(e)
        }
  }
  
  const changeHandler = event => {
        setForm({ ...form, [event.target.name]: event.target.value })
  }

  useEffect(() => {
       async function getInfo() {
        try {
            const data = await request('/api/auth/info', 'POST', { id: userId })
            setForm({ title: '', text: '', like: 0, authorId: userId, author: data.login })
        } catch (e) {
            console.log(e)
        }
       }
      getInfo()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <>
      <div className="form-post">
        <h3>Создать вопрос</h3>
          <input
            placeholder="Введите заголовок"
            id="title"
            type="text"
            name="title"
            onChange={changeHandler}
          ></input>
          <textarea
            placeholder="Введите описание"
            id="text"
            type="text"
            name="text"
            onChange={changeHandler}
          ></textarea>
          <button className="create-post" onClick={addPost}>Создать</button>
      </div>
    </>
  )
}
