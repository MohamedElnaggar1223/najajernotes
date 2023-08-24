import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'
import { setCredentials } from '../../features/auth/authSlice'

const baseQuery = fetchBaseQuery(
    {
        baseUrl: 'https://najajernotes-api.onrender.com',
        credentials: 'include',
        prepareHeaders: (headers, { getState }) => 
        {
            //@ts-ignore
            const token = getState().auth.token

            if(token) headers.set('authorization', `Bearer ${token}`)

            return headers
        }
    })

const baseQueryWithReAuth = async (args, api, extraoptions) => 
{
    let result = await baseQuery(args, api, extraoptions)

    if(result?.error?.status === 403)
    {
        const refreshAuth = await baseQuery('/auth/refresh', api, extraoptions)

        if(refreshAuth?.data)
        {
            // @ts-ignore
            api.dispatch(setCredentials(refreshAuth.data))

            result = await baseQuery(args, api, extraoptions)
        }
        else
        {
            //@ts-ignore
            if(refreshAuth.error?.status === 403) refreshAuth.error.data.message = "Your Login Has Expired"
            return refreshAuth
        }
    }

    return result
}

export const apiSlice = createApi(
    {
        baseQuery: baseQueryWithReAuth,
        tagTypes: ['Note', 'User'],
        endpoints: (builder) => ({})
    })