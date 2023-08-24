import React, { useRef, useEffect, useState } from 'react'
import { Outlet, Link } from 'react-router-dom'
import { useRefreshMutation } from './authApiSlice'
import { selectCurrentToken } from './authSlice'
import { useSelector } from 'react-redux'
import usePersist from '../../hooks/usePersist'

export default function PersistLogin()
{
    const [persist] = usePersist()
    const token = useSelector(selectCurrentToken)
    const effectRan = useRef(false)

    const [trueSuccess, setTrueSuccess] = useState(false)

    const [refresh, 
        {
            isUninitialized,
            isLoading,
            isSuccess,
            isError,
            error
        }] = useRefreshMutation()

    //@ts-ignore
    useEffect(() => 
    {
        if(effectRan.current === true || process.env.NODE_ENV !== 'development')
        {
            async function verifyRefreshToken()
            {
                try
                {
                    //@ts-ignore
                    await refresh()
                    setTrueSuccess(true)
                }
                catch(e)
                {
                    console.error(e)
                }
            }

            if(!token && persist) verifyRefreshToken()
        }
        return () => effectRan.current = true
        // eslint-disable-next-line
    }, [])

    let content
    if (!persist) { // persist: no
        console.log('no persist')
        content = <Outlet />
    } else if (isLoading) { //persist: yes, token: no
        console.log('loading')
        content = <p>Loading...</p>
    } else if (isError) { //persist: yes, token: no
        console.log('error')
        content = (
            <p className='errmsg'>
                {/*@ts-ignore*/}
                {error?.data?.message}
                <Link to="/login">Please login again</Link>.
            </p>
        )
    } else if (isSuccess && trueSuccess) { //persist: yes, token: yes
        console.log('success')
        content = <Outlet />
    } else if (token && isUninitialized) { //persist: yes, token: yes
        console.log('token and uninit')
        console.log(isUninitialized)
        content = <Outlet />
    }

    return content
}