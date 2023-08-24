import { createSelector, createEntityAdapter } from '@reduxjs/toolkit'
import { apiSlice } from '../../app/api/apiSlice'

export const notesAdapter = createEntityAdapter(
    {
        sortComparer: (a, b) => (a.completed === b.completed) ? 0 : a.completed ? 1 : -1
    })

const initialState = notesAdapter.getInitialState()

export const notesExtendedApiSlice = apiSlice.injectEndpoints(
    {
        endpoints: builder => (
            {
                getNotes: builder.query(
                    {
                        query: () =>
                            ({
                                url: '/notes',
                                validateStatus: (response, result) => 
                                {
                                    return response.status === 200 && !result.isError
                                }
                            }),
                        transformResponse: (response) => 
                        {
                            //@ts-ignore
                            const loadedNotes = response.map(note => 
                                {
                                    note.id = note._id
                                    return note
                                })
                            return notesAdapter.setAll(initialState, loadedNotes)
                        },
                        //@ts-ignore
                        providesTags: (result, err, arg) => 
                        {
                            if(result?.ids)
                            {
                                return(
                                    [
                                        {type: 'Note', id: 'LIST'},
                                        ...result.ids.map(id => ({type: 'Note', id}))
                                    ]
                                )
                            }
                            else return [{type: 'Note', id: 'LIST'}]
                        }
                    }),
                addNewNote: builder.mutation(
                    {
                        query: (note,) => (
                            {
                                'url': '/notes',
                                'method': 'POST',
                                'body': {
                                    ...note
                                }
                            }),
                        invalidatesTags: [{'type': 'Note', 'id': 'LIST'}]
                    }),
                updateNote: builder.mutation(
                    {
                        query: (note) => (
                            {
                                'url': '/notes',
                                'method': 'PATCH',
                                'body': {
                                    ...note,
                                }
                            }),
                        invalidatesTags: (result, err, arg) => [{'type': 'Note', 'id': arg.id}]
                    }),
                deleteNote: builder.mutation(
                    {
                        query: ({ id }) => (
                            {
                                'url': '/notes',
                                'method': 'DELETE',
                                'body': {
                                    id
                                }
                            }),
                        invalidatesTags: (result, err, arg) => [{'type': 'Note', 'id': arg.id}]
                    })
            })
    })

export const 
{ 
    useGetNotesQuery,
    useAddNewNoteMutation,
    useUpdateNoteMutation,
    useDeleteNoteMutation
} = notesExtendedApiSlice

//@ts-ignore
export const selectNotesResult = notesExtendedApiSlice.endpoints.getNotes.select()

export const selectNotesData = createSelector(
    selectNotesResult,
    notesData => notesData.data
)

export const 
{
    selectAll: selectAllNotes,
    selectById: selectNoteById,
    selectIds: selectNoteIds
} = notesAdapter.getSelectors((state) => selectNotesData(state) ?? initialState)