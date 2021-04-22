/* eslint-disable jsx-a11y/alt-text */
import React, { useContext, useEffect, useState } from 'react'
import { useHistory } from 'react-router-dom'
import { AuthContext } from '../context/AuthContext'
import { UserPosts } from '../components/UserPosts'
import { PopularPosts } from '../components/PopularPosts'
import { SearchPosts } from '../components/SearchPosts'
import { useHttp } from '../hooks/http.hook'

export const CreatePage = () => {
    const {userId, logout} = useContext(AuthContext)
    const { request } = useHttp()
    const history = useHistory()
    const [info, setInfo] = useState({})
    const [search, setSearch] = useState()
    const [openSettings, setOpenSettings] = useState(false)
    const [content, setContent] = useState({
        myQustions: false, popularPosts: true, searchPosts: false
    })

    const logoutHandler = event => {
        event.preventDefault()
        logout()
        history.push('/')
    }

    async function getInfo() {
        try {
            const data = await request('/api/auth/info', 'POST', { id: userId })
            console.log('getInfo', data)
            setInfo({ ...data })
        } catch (e) {
            console.log(e.response)
        }
    }

    function searchInput(e) {
        if (!e.target.value) {
        }
        getSearchPosts()
        setSearch(e.target.value)
    }

    function getMyQuestions() {
        setContent({
            myQustions: true, popularPosts: false, searchPosts: false
        })
    }

    function getPopularPosts() {
        console.log('popul')
         setContent({
            myQustions: false, popularPosts: true, searchPosts: false
        })
    }
    
    function getSearchPosts() {
       setContent({
            myQustions: false, popularPosts: false, searchPosts: true
        })
    }

    useEffect(() => {
        getInfo()
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])


    return (
        <>  
            <header className="header-main">
                <h1>Faqit</h1>
            </header>
            <div className="content-wrap">
                <div className="main-cards">
                    <div className="main-cards__card profile">
                        <button className="logout" onClick={logoutHandler}>
                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none">
                                <path fillRule="evenodd" clipRule="evenodd" d="M4 3C4 1.34315 5.34315 0 7 0H17C18.6569 0 20 1.34315 20 3V18.581C20 19.8559 19.1943 20.9915 17.9911 21.4126L11.991 23.5126C10.1425 24.1596 8.2132 22.8932 8.01644 21H7C5.34315 21 4 19.6569 4 18V3ZM8 19V5.91896C8 4.64413 8.80569 3.50853 10.0089 3.08739L13.1158 2H7C6.44772 2 6 2.44772 6 3V18C6 18.5523 6.44772 19 7 19H8ZM18 3.81896C18 3.13011 17.3198 2.64754 16.6697 2.8751L10.6696 4.9751C10.2686 5.11548 10 5.49402 10 5.91896V20.681C10 21.3699 10.6802 21.8525 11.3303 21.6249L17.3303 19.5249C17.7314 19.3845 18 19.006 18 18.581V3.81896ZM13 11C13.5523 11 14 11.4477 14 12V14C14 14.5523 13.5523 15 13 15C12.4477 15 12 14.5523 12 14V12C12 11.4477 12.4477 11 13 11Z" fill="#293644"/>
                            </svg>
                        </button>
                        <h3 className="main-title">Profile</h3>
                        <div className="avatar-img">
                            <img src={info.avatar}></img>
                            <div className="shadow"></div>
                        </div>
                        <div className="author">
                            <p>{ info.login }</p>
                            </div>
                        <div className="like">
                            <p>{ info.like }</p>
                            <p>❤️</p>
                        </div>
                        <button className="my-questions" onClick={getMyQuestions}>My Questions</button>
                    </div>
                </div>
                <div className="main-content">
                    <div className="main-cards__card search">
                     <input
                        placeholder="Search"
                        id="search"
                        type="search"
                        name="search"
                        onChange={searchInput}
                    ></input>
                </div>
                {content.myQustions ?
                    <>
                        <button className="btn-back" onClick={getPopularPosts} >{'<'} Назад</button>
                        <h3 className="main-title">My posts</h3>
                        <UserPosts></UserPosts>
                    </> : <></>}
                {content.popularPosts ?
                    <>
                        <h3 className="main-title">Popular posts</h3>
                        <PopularPosts></PopularPosts>
                    </> : <></>}
                {content.searchPosts ?
                    <>
                        <button className="btn-back" onClick={getPopularPosts}>{'<'} Назад</button>
                        <h3 className="main-title">Searching results</h3>
                            <SearchPosts text={search}></SearchPosts>
                    </> : <></>}
                </div>
            </div>
         </>
    )
}