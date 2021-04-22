import React from 'react'
import { Switch, Route } from 'react-router-dom'
import { AuthPage } from './pages/AuthPage'
import { CreatePage } from './pages/CreatePage'
import { PostPage } from './pages/PostPage'
import {Redirect} from 'react-router-dom'

export const UseRoutes = isAuthenticated => {
    if (isAuthenticated) {
        return (
            <Switch>
                <Route path="/post" exact>
                    <PostPage/>
                </Route>
                <Route path="/create" exact>
                    <CreatePage/>
                </Route>
                <Redirect to="/create"/>
            </Switch>
        )
    }

    return (
        <Switch>
            <Route path="/" exact>
                <AuthPage></AuthPage>
            </Route>
            <Redirect to="/create"></Redirect>
        </Switch>
    )
}
