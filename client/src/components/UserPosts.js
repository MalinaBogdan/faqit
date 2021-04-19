import React, { useState, useContext, useEffect } from 'react'
import { CreatePost } from '../components/CreatePost'
import { useHttp } from '../hooks/http.hook'
import { AuthContext } from '../context/AuthContext'


export const UserPosts = () => {
    const [visibleNewPost, setVisibleNewPost] = useState(false)
    const [allPosts, setAllPosts] = useState([])
    const { userId } = useContext(AuthContext)
    const { request } = useHttp()

    function changeVisibleNewPost() {
        setVisibleNewPost(!visibleNewPost)
    }
  
    async function getPost() {
      try {
        const data = await request('/api/post/posts-id', 'POST', { authorId: userId })
        setAllPosts(data)
      } catch (e) {
        console.log(e)
      }
   }
  
    useEffect(() => {
      getPost()
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

  return (
      <>
        <button className="add-post" onClick={changeVisibleNewPost}>+ Новый вопрос</button>
        {visibleNewPost ? <CreatePost/> : <></>}
        <div className="posts-wrap">
        {allPosts.map(({ title, text, date, author, like }, i) => 
          <div className="card-post" key={i}>
            <header className="card-post__title">
              <h3>{title}</h3>
              <div className="like">
                <p>{ like }</p>
                <div>❤️</div>
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
