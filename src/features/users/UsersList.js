import React from 'react'
import { useGetUsersQuery } from './usersApiSlice'
import User from './User'

export default function UsersList()
{
    const 
    {
        data: users,
        isLoading,
        isSuccess,
        isError,
        error
        //@ts-ignore
    } = useGetUsersQuery('usersList', {
        pollingInterval: 60000,
        refetchOnFocus: true,
        refetchOnMountOrArgChange: true
    })

    let content
    if(isLoading)
    {
        content = <p>Loading...</p>
    }
    else if(isError)
    {
        //@ts-ignore
        content = <p>{error?.data?.message}</p>
    }
    else if(isSuccess)
    {
        const { ids } = users

        let tableContent = ids?.length 
        ?   ids.map(userId => <User key={userId} userId={userId} />)
        :   null

        content = (
            <table className="table table--users">
                <thead className="table__thead">
                    <tr>
                        <th scope="col" className="table__th user__username">Username</th>
                        <th scope="col" className="table__th user__roles">Roles</th>
                        <th scope="col" className="table__th user__edit">Edit</th>
                    </tr>
                </thead>
                <tbody>
                    {tableContent}
                </tbody>
            </table>
        )
    }
    return content
}