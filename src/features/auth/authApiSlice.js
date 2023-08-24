import { apiSlice } from '../../app/api/apiSlice'
import { logOut, setCredentials } from './authSlice'

export const authExtendedApiSlice = apiSlice.injectEndpoints(
    {
        endpoints: (builder) => (
            {
                login: builder.mutation(
                    {
                        query: credentials => (
                            {
                                url: '/auth',
                                method: 'POST',
                                body: { ...credentials }
                            })
                    }),
                sendLogout: builder.mutation(
                    {
                        query: () => (
                            {
                                url: '/auth/logout',
                                method: 'POST',
                            }),
                        async onQueryStarted(arg, {dispatch, queryFulfilled})
                        {
                            try
                            {
                                await queryFulfilled

                                //@ts-ignore
                                dispatch(logOut())
                                setTimeout(() => 
                                {
                                    dispatch(apiSlice.util.resetApiState())
                                }, 1000)
                            }
                            catch(e)
                            {
                                console.error(e)
                            }
                        }
                    }),
                refresh: builder.mutation(
                    {
                        query: () => (
                            {
                                url: '/auth/refresh',
                                method: 'GET',
                            }),
                        async onQueryStarted(arg, { dispatch , queryFulfilled })
                        {
                            try
                            {
                                const { data } = await queryFulfilled
                                console.log(data)
                                const { accessToken } = data
                                dispatch(setCredentials({ accessToken }))
                            }
                            catch(e)
                            {
                                console.error(e)
                            }
                        }
                    })
            })
    })

export const 
{
    useLoginMutation,
    useSendLogoutMutation,
    useRefreshMutation
} = authExtendedApiSlice