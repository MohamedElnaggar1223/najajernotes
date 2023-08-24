import { useState, useEffect } from 'react'

export default function usePersist()
{
    //@ts-ignore
    const [persist, setPersist] = useState(JSON.parse(localStorage.getItem('persist')) || false)

    useEffect(() =>
    {
        localStorage.setItem('persist', JSON.stringify(persist))
    }, [persist])

    return [persist, setPersist]
}