import React, { useState } from "react";
import NoteContext from "./NoteContext";
const NoteState = (props) => {
  const host = "http://localhost:5000"
  const notesinitial = []
  const [notes, setNotes] = useState(notesinitial)

  // Get all Notes 
  const getNotes = async () => {
    //API CALL to FETCH 
    console.log("testing resonse"); 
    const response = await fetch(`${host}/api/notes/fetchallnotes`, {
      method: 'GET',
      headers: {
        'content-type': 'application/json',
        "auth-token": (localStorage.getItem('token'))
      },
    })
    console.log(response)
    const json = await response.json()
    setNotes(json)

  }

  //Add Note 
  const addNote = async (title,description,tag) => {
    //API CALL 
    const response = await fetch(`${host}/api/notes/addnote`, {
      method: 'POST',
      headers: {
        'content-type': 'application/json',
        "auth-token": localStorage.getItem('token')
      },
      body: JSON.stringify({ title, description, tag })
    });
   
    const note= await response.json();
    setNotes(notes.concat(note))
   

  }

  //Delete Note
  const deleteNote = async (id) => {
    //API CALL
    const response = await fetch(`${host}/api/notes/deletenote/${id}`, {
      method: 'DELETE',
      headers: {
        'content-type': 'application/json',
        "auth-token": localStorage.getItem('token')
      }
        
    })
    // eslint-disable-next-line
    const json = response.json();

    //Logic to delete a note
    
    const newNote = notes.filter((note) => { return note._id !== id })
    setNotes(newNote)
  }

  //Edit Note 
  const editNote = async(id, title, description, tag) => {
    //API CALL
    const response = await fetch(`${host}/api/notes/updatenote/${id}`, {
      method: 'PUT',
      headers: {
        'content-type': 'application/json',
        "auth-token": localStorage.getItem('token') 
      },
      body: JSON.stringify({ title, description, tag })
      // eslint-disable-next-line
    });
    const json = await response.json();
    
 
    let newNotes = JSON.parse(JSON.stringify(notes))
    //Logic to edit at client side
    for (let index = 0; index < newNotes.length; index++) {
      const element = newNotes[index];
      if (element._id === id) {
        newNotes[index].title = title;
        newNotes[index].description = description;
        newNotes[index].tag = tag;
        break;
      }
    } 
    // console.log(id,notes); 
    setNotes(newNotes);
  }
  return (
    // eslint-disable-next-line
    <NoteContext.Provider value={{ notes, addNote, deleteNote, editNote, getNotes}}>

      {props.children}

    </NoteContext.Provider>
  )
  // eslint-disable-next-line
}

export default NoteState;