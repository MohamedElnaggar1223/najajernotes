import { createSelector, createEntityAdapter } from '@reduxjs/toolkit'
import { apiSlice } from '../../app/api/apiSlice'

export const usersAdapter = createEntityAdapter()

const initialState = usersAdapter.getInitialState()

export const usersExtendedApiSlice = apiSlice.injectEndpoints(
    {
        endpoints: builder => (
            {
                getUsers: builder.query(
                    {
                        query: () => 
                        ({
                            url: '/users',
                            validateStatus: (response, result) => 
                            {
                                return response.status === 200 && !result.isError
                            }
                        }),
                        transformResponse: (response) => 
                        {
                            //@ts-ignore
                            const loadedUsers = response.map(user => 
                                {
                                    user.id = user._id
                                    return user
                                })
                            return usersAdapter.setAll(initialState, loadedUsers)
                        },
                        // @ts-ignore
                        providesTags: (result, err, arg) => 
                        {
                            if(result?.ids)
                            {
                                return(
                                    [
                                        {type: 'User', id: 'LIST'},
                                        ...result.ids.map(id => ({type: 'User', id}))
                                    ]
                                )
                            }
                            else return [{type: 'User', id: 'LIST'}] 
                        }
                    }),
                addNewUser: builder.mutation(
                    {
                        query: (user) => (
                            {
                                'url': '/users',
                                'method': 'POST',
                                'body': {...user} 
                            }),
                        invalidatesTags: [
                            {type: 'User', id: 'LIST'}
                        ]
                    }),
                updateUser: builder.mutation(
                    {
                        query: (user) => (
                            {
                                'url': '/users',
                                'method': 'PATCH',
                                'body': {...user}
                            }),
                        invalidatesTags: (result, err, args) => [{type: 'User', id: args.id}]
                    }),
                deleteUser: builder.mutation(
                    {
                        query: ({ id }) => (
                            {
                                'url': '/users',
                                'method': 'DELETE',
                                'body': {id}
                            }),
                        invalidatesTags: (result, err, args) => [{type: 'User', id: args.id}]
                    }),
                getUserById: builder.query(
                    {
                        query: (userId) => `/users/${userId}`,
                        validateStatus: (response, result) => 
                        {
                            return response.status === 200 && !result.isError
                        },
                        //@ts-ignore
                        providesTags: (result, err, arg) => 
                        {
                            return [{type: 'User', id: 'LIST'}, { type: 'Post', id: arg }]
                        }
                    })
            })
    })

export const 
{ 
    useGetUsersQuery, 
    useGetUserByIdQuery,
    useAddNewUserMutation,
    useUpdateUserMutation,
    useDeleteUserMutation
} = usersExtendedApiSlice

//@ts-ignore
export const selectUsersResult = usersExtendedApiSlice.endpoints.getUsers.select()

const selectUsersData = createSelector(
    selectUsersResult,
    userResults => userResults.data
)

export const 
{
    selectAll: selectAllUsers,
    selectById: selectUserById,
    selectIds: selectUserIds
} = usersAdapter.getSelectors((state) => selectUsersData(state) ?? initialState)