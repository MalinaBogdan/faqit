import React, { useState, useEffect } from 'react'
import { useHttp } from '../hooks/http.hook'
import { useHistory } from 'react-router-dom'

export const SearchPosts = () => {
  const { request } = useHttp()
  const [allPosts, setAllPosts] = useState([])
  const history = useHistory()
  const storageName = "post"
  const [search, setSearch] = useState()
     
  async function resultSearch(e) {
        try {
          const data = await request('/api/post/searc-author', 'POST', { text: search })
            console.log(data)
            setAllPosts(data)
        } catch (e) {
            console.log(e.response)
        }
  }
  
  async function openPost(e) {
    try {
      localStorage.setItem(storageName, e.currentTarget.getAttribute("idpost"))
      await history.push('/links')
    } catch (e) {
      console.log(e)
    }
  }

  function searchInput(e) {
        setSearch(e.target.value)
  }

  useEffect(() => {
    resultSearch()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [search])
  return (
    <>
       <input
                        placeholder="Введите заголовок"
                        id="search"
                        type="search"
                        name="search"
                        onChange={searchInput}
        ></input>
        <div className="posts-wrap">
        {allPosts.map(({ item }, i) => 
          <div className="card-post" key={i} idpost={item._id} onClick={openPost}>
            <header className="card-post__title">
              <h3>{ item.title }</h3>
              <div className="like">
                <p>{ item.like }</p>
                <div idpost={item._id}>❤️</div>
              </div>
            </header>
            <div className="card-post__text">
              <p>{ item.text }</p>
            </div>
            <footer className="card-post__footer">
              <div className="date">
                <p>Создан: </p>
                <p>{ item.date }</p>
              </div>
              <div className="author">
                <p>Автор: </p>
                <p>{ item.author }</p>
              </div>
            </footer>
          </div>
        )}
        </div>
    </>
  )
}
