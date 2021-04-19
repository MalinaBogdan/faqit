import React, { useState, useEffect } from 'react'
import { useHttp } from '../hooks/http.hook'
import { useHistory } from 'react-router-dom'

export const PopularPosts = () => {
  const { request } = useHttp()
  const [allPosts, setAllPosts] = useState([])
  const history = useHistory()
  const [loadingPosts, setLoadingPosts] = useState(5)
  const storageName = "post"

     
  const scrollHandler = (e) => {
    if (e.target.documentElement.scrollHeight - (e.target.documentElement.scrollTop + window.innerHeight) < 100) {
      console.log(loadingPosts)
      setLoadingPosts(loadingPosts + 5)
    }
  }

  useEffect(() => {
    document.addEventListener('scroll', scrollHandler)

    return function () {
      document.removeEventListener('scroll', scrollHandler) 
    }
  })

  async function openPost(e) {
    try {
      localStorage.setItem(storageName, e.currentTarget.getAttribute("idpost"))
      await history.push('/links')
    } catch (e) {
      console.log(e)
    }
  }
 
  async function getAllPost() {
    try {
      const data = await request('/api/post/posts', 'POST', {})
      console.log(data)
      await setAllPosts(data)
    } catch (e) {
      console.log(e)
    }
  }

  useEffect(() => {
    getAllPost()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])
  return (
    <>
        <div className="posts-wrap">
        {allPosts.sort((a, b) => a.like < b.like ? 1 : -1).slice(0, loadingPosts).map(({ title, text, date, author, like, _id }, i) => 
          <div className="card-post" key={i} idpost={_id} onClick={openPost}>
            <header className="card-post__title">
              <h3>{title}</h3>
              <div className="like">
                <p>{ like }</p>
                <div idpost={_id}>❤️</div>
              </div>
            </header>
            <div className="card-post__text">
              <p>{ text }</p>
            </div>
            <footer className="card-post__footer">
              <div className="date">
                <p>Создан: </p>
                <p>{ date.substring(0, 10) }</p>
              </div>
              <div className="author">
                <p>Автор: </p>
                <p>{ author }</p>
              </div>
            </footer>
          </div>
        )}
        </div>
    </>
  )
}
