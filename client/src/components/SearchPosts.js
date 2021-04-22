import React, { useState, useEffect } from 'react'
import { useHttp } from '../hooks/http.hook'
import { useHistory } from 'react-router-dom'

export const SearchPosts = (search) => {
  const { request } = useHttp()
  const [allPosts, setAllPosts] = useState([])
  const history = useHistory()
  const storageName = "post"     
  async function resultSearch(e) {
  console.log(search.text, 'sss')
        try {
          const data = await request('/api/post/search', 'POST', { text: search.text })
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

  useEffect(() => {
    resultSearch()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [search])
  return (
    <>
        <div className="posts-wrap">
        {allPosts.map(({ item }, i) => 
          <div className="card-post" key={i} idpost={item._id} onClick={openPost}>
            <div className="card-post__left">
              <div className="avatar">
                <img src={item.authorAvatar}></img>
              </div>
              <div className="author">
                <p>Author: </p>
                <p>{ item.author }</p>
              </div>
              </div>
              <div className="card-post__right">
                <header className="card-post__title">
                  <h3>{item.title}</h3>
                  <div className="like">
                    <p>{ item.like }</p>
                    <div idpost={item._id}>❤️</div>
                  </div>
                </header>
                <div className="card-post__main">
                  <div className="card-post__text">
                    <p>{ item.text }</p>
                  </div>
                  <footer className="card-post__footer">
                    <div className="date">
                      <p>Created: </p>
                      <p>{ item.date }</p>
                    </div>
                  </footer>
                </div>
            </div>
          </div>
        )}
        </div>
    </>
  )
}
