import React from 'react'
import { useParams } from 'react-router-dom'
import EditNoteForm from './EditNoteForm'
import { useGetNotesQuery } from './notesApiSlice'
import { useGetUsersQuery } from '../users/usersApiSlice'
import useAuth from '../../hooks/useAuth'
import PulseLoader from 'react-spinners/PulseLoader'

export default function EditNote()
{
    const { id } = useParams()

    const { username, isManager, isAdmin } = useAuth()

    //@ts-ignore
    const { note } = useGetNotesQuery("notesList", 
    {
        selectFromResult: ({ data }) => 
        ({
            //@ts-ignore
            note: data?.entities[id]
        })
    })
    const { users } = useGetUsersQuery("usersList", 
    {
        selectFromResult: ({ data }) => 
        ({
            users: data?.ids.map(userId => data?.entities[userId])
        })
    })

    if (!note || !users?.length) return <PulseLoader color={"#FFF"} />


    if (!isManager && !isAdmin) {
        if (note.username !== username) {
            return <p className="errmsg">No access</p>
        }
    }

    const content = <EditNoteForm note={note} users={users} />

    return content
}