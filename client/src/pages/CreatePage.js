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
    const [content, setContent] = useState({
        prev: 'Мои вопросы', main: 'Популярные вопросы', next: 'Поиск'
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
            const img = await request('/api/auth/img', 'POST', { avatar: data.avatar })
            await console.log(img, '[kjbkn]')
        } catch (e) {
            console.log(e.response)
        }
    }

    // async function getAvatar() {
    //     console.log(info)
    //     try {
    //         const data = await request('/api/auth/img', 'POST', { avatar: info.avatar })
    //         console.log('getImg', data)
    //         // setInfo({ ...data })
    //     } catch (e) {
    //         console.log(e, 'asd')
    //     }
    // }

    function switchContentPrev() {
        // eslint-disable-next-line default-case
        switch (content.main) {
            case 'Популярные вопросы':
                setContent({prev: 'Поиск', main: 'Мои вопросы', next: 'Популярные вопросы'})
                break;
            case 'Мои вопросы':
                setContent({prev: 'Популярные вопросы', main: 'Поиск', next: 'Мои вопросы'})
                break;
            case 'Поиск':
                setContent({prev: 'Мои вопросы', main: 'Популярные вопросы', next: 'Поиск'})
                break;
        }
    }
    
    function switchContentNext() {
        // eslint-disable-next-line default-case
        switch (content.main) {
            case 'Популярные вопросы':
                setContent({prev: 'Популярные вопросы', main: 'Поиск', next: 'Мои вопросы'})
                break;
            case 'Мои вопросы':
                setContent({prev: 'Мои вопросы', main: 'Популярные вопросы', next: 'Поиск'})
                break;
            case 'Поиск':
                setContent({ prev: 'Поиск', main: 'Мои вопросы', next: 'Популярные вопросы' })
                break;
        }
    }

    useEffect(() => {
        getInfo()
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])


    return (
        <div className="content-wrap">
            <div className="main-cards">
                <div className="main-cards__card profile">
                    <button className="logout" onClick={logoutHandler}>
                         <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none">
                            <path fillRule="evenodd" clipRule="evenodd" d="M4 3C4 1.34315 5.34315 0 7 0H17C18.6569 0 20 1.34315 20 3V18.581C20 19.8559 19.1943 20.9915 17.9911 21.4126L11.991 23.5126C10.1425 24.1596 8.2132 22.8932 8.01644 21H7C5.34315 21 4 19.6569 4 18V3ZM8 19V5.91896C8 4.64413 8.80569 3.50853 10.0089 3.08739L13.1158 2H7C6.44772 2 6 2.44772 6 3V18C6 18.5523 6.44772 19 7 19H8ZM18 3.81896C18 3.13011 17.3198 2.64754 16.6697 2.8751L10.6696 4.9751C10.2686 5.11548 10 5.49402 10 5.91896V20.681C10 21.3699 10.6802 21.8525 11.3303 21.6249L17.3303 19.5249C17.7314 19.3845 18 19.006 18 18.581V3.81896ZM13 11C13.5523 11 14 11.4477 14 12V14C14 14.5523 13.5523 15 13 15C12.4477 15 12 14.5523 12 14V12C12 11.4477 12.4477 11 13 11Z" fill="#293644"/>
                        </svg>
                    </button>
                    <h3 className="main-cards__title">Profile</h3>
                    <div className="avatar-img">
                        <img src={info.avatar}></img>
                    </div>
                    <div className="main-cards__table">
                        <div className="main-cards__ceil">
                            <p>Логин:</p>
                            <h4>{ info.login }</h4>
                        </div>
                        <div className="main-cards__ceil"></div>
                        <div className="main-cards__ceil">
                            <p>Лайки</p>
                            <h4>{ info.like }</h4>
                        </div>
                        <div className="main-cards__ceil"></div>
                    </div>
                </div>
                {/* <div className="main-cards__card search">
                    <h3 className="main-cards__title">Поиск</h3>
                     <input
                        placeholder="Введите заголовок"
                        id="search"
                        type="search"
                        name="search"
                        onChange={searchInput}
                    ></input>
                </div> */}
            </div>
            <div className="main-content">
                <div className="switch-content">
                    <div className="content prev" onClick={switchContentPrev}>
                        <button>{content.prev}</button>
                    </div>
                    <div className="content main">
                        <button>{content.main}</button>
                    </div>
                    <div className="content next" onClick={switchContentNext}>
                        <button>{content.next}</button>
                    </div>
                </div>
                {content.main === 'Мои вопросы' ? <UserPosts></UserPosts> : <></>}
                {content.main === 'Популярные вопросы' ? <PopularPosts></PopularPosts> : <></>}
                {content.main === 'Поиск' ? <SearchPosts></SearchPosts> : <></>}
            </div>
        </div>
    )
}