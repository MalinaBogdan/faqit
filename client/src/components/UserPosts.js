import React, { useState, useContext, useEffect } from 'react'
import { CreatePost } from '../components/CreatePost'
import { useHttp } from '../hooks/http.hook'
import { AuthContext } from '../context/AuthContext'
import { useHistory } from 'react-router-dom'


export const UserPosts = () => {
    const [visibleNewPost, setVisibleNewPost] = useState(false)
    const [allPosts, setAllPosts] = useState([])
    const { userId } = useContext(AuthContext)
    const { request } = useHttp()
    const history = useHistory()
    const storageName = "post"

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
  
    async function openPost(e) {
    try {
      localStorage.setItem(storageName, e.currentTarget.getAttribute("idpost"))
      await history.push('/links')
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
        {allPosts.map(({ title, text, date, author, like, _id, authorAvatar }, i) => 
          <div className="card-post" key={i} idpost={_id} onClick={openPost}>
            <div className="card-post__left">
              <div className="avatar">
                <img src={authorAvatar}></img>
              </div>
              <div className="author">
                <p>Author: </p>
                <p>{ author }</p>
              </div>
              </div>
              <div className="card-post__right">
                <header className="card-post__title">
                  <h3>{title}</h3>
                  <div className="like">
                    <p>{ like }</p>
                    <div idpost={_id}>❤️</div>
                  </div>
                </header>
                <div className="card-post__main">
                  <div className="card-post__text">
                    <p>{ text }</p>
                  </div>
                  <footer className="card-post__footer">
                    <div className="date">
                      <p>Created: </p>
                      <p>{ date }</p>
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
