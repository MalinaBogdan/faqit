/* eslint-disable jsx-a11y/alt-text */
import React, { useEffect, useState, useContext } from 'react'
import { useHttp } from '../hooks/http.hook'
import { AuthContext } from '../context/AuthContext'
import { useHistory } from 'react-router-dom'

export const PostPage = () => {
    const { request } = useHttp()
    const { userId } = useContext(AuthContext)
    const [post, setPost] = useState([])
    const [comments, setComments] = useState([])
    const [form, setForm] = useState({})
    const history = useHistory()
    const [plug, setPlug] = useState(false)

    const addComment = async () => {
        try {
                await request('/api/post/add-comment', 'POST', { ...form })
                document.getElementById('text').value = '';
                await getAllComments()
            } catch (e) {
                console.log(e)
            }
    }
    function goOut() {
        history.push('/create')
    }

    async function getPost() {
            try {
                const data = await request('/api/post/post', 'POST', {id: localStorage.getItem("post")})
                console.log(data)
                await setPost(data)
            } catch (e) {
            console.log(e)
            }
    }

    async function addLikePost(e) {
        try {
        const data = await request('/api/post/add-like', 'POST', { id: localStorage.getItem("post"), userId: userId })
        console.log(data)
        await setPost(data)
        } catch (e) {
        console.log(e)
        }
    }

    async function addLike(e) {
        const idComment = e.target.getAttribute("idcomment")
        try {
        const data = await request('/api/post/like-comment', 'POST', { id: idComment, userId: userId })
        console.log(data)
        await setComments(data)
        } catch (e) {
        console.log(e)
        }
    }
        
    async function getAllComments() {
            try {
                const data = await request('/api/post/comments-id', 'POST', {postId: localStorage.getItem("post")})
                console.log(data, 'qwe')
                if (data.length === 0) {
                    setPlug(true)
                }
                await setComments(data)
            } catch (e) {
                console.log(e)
            }
    }
    
    const changeHandler = event => {
            setForm({ ...form, [event.target.name]: event.target.value })
    }

    useEffect(() => {
        setForm({ text: '', authorId: userId, postId: localStorage.getItem("post") })
        getPost()
        getAllComments()
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    return (
        <>
            <div className="btn-back-wrap">
                <button className="btn-back" onClick={goOut}>{'<'} ??????????</button>
            </div>
            <div className="card-post shadow" idpost={post._id}>
                <div className="card-post__left">
                <div className="avatar">
                    <img src={post.authorAvatar}></img>
                </div>
                <div className="author">
                    <p>Author: </p>
                    <p>{ post.author }</p>
                </div>
                </div>
                <div className="card-post__right">
                    <header className="card-post__title">
                    <h3>{post.title}</h3>
                    <div className="like">
                        <p>{ post.like }</p>
                        <div idpost={post._id} onClick={ addLikePost }>??????</div>
                    </div>
                    </header>
                    <div className="card-post__main">
                    <div className="card-post__text">
                        <p>{ post.text }</p>
                    </div>
                    <footer className="card-post__footer">
                        <div className="date">
                        <p>Created: </p>
                        <p>{ post.date }</p>
                        </div>
                    </footer>
                    </div>
                </div>
                <div className="card-post__bottom">
                    {plug ? <p className="plug-text">Your comment will be the first.</p> : <>
                    {comments.sort((a, b) => a.like < b.like ? 1 : -1).map(({ text, author, like, date, _id, authorAvatar }, i) => 
                    <div className="comments-wrap" key={i}>
                        <div className="comment">
                            <div className="comment__author">
                                <div className="avatar">
                                        <img src={ authorAvatar }></img>
                                </div>
                                <div className="login">
                                    <p>{ author }</p>
                                    </div>
                                    <div className="line"></div>
                            </div>
                            <div className="comment__main">
                                <div className="text">{text}</div>
                                    <footer>
                                    <div className="date">
                                        <p>Created:</p>
                                        <p>{ date }</p> 
                                    </div>
                                    <div className="like">
                                        <p>{ like }</p>
                                        <div idpost={post._id} idcomment={ _id } onClick={ addLike }>??????</div>
                                    </div>
                                </footer>
                            </div>
                        </div>
                    </div>
                )}
                    </>}
                    
                    <div className="form-comment">
                    <textarea
                            placeholder="Enter comment"
                            id="text"
                            type="text"
                            name="text"
                            onChange={changeHandler}
                        ></textarea>
                    <button className="btn-comment" onClick={addComment}>Comment on</button>
                    </div>
                </div>
            </div>
        </>
    )
}