import React, { useEffect } from 'react'
import { store } from '../../app/store'
import { notesExtendedApiSlice } from '../notes/notesApiSlice'
import { usersExtendedApiSlice } from '../users/usersApiSlice'
import { Outlet } from 'react-router-dom'

export default function Prefetch()
{
    useEffect(() => 
    {
        store.dispatch(notesExtendedApiSlice.util.prefetch('getNotes', 'notesList', {force: true}))
        store.dispatch(usersExtendedApiSlice.util.prefetch('getUsers', 'usersList', {force: true}))
    }, [])
    
    return <Outlet />
}