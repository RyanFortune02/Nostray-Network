import { useState, useEffect } from "react";
import api from "../api";

function Home() {
  //first will send authorized request to grab all the notes created by the user
  const [notes, setNotes] = useState([]);
  const [content, setContent] = useState("");
  const [title, setTitle] = useState("");

  useEffect(() => {
    //calls the getNote function when we load the page
    getNotes();
  }, []);

  const getNotes = () => {
    api
      .get("/api/notes/")
      .then((response) => response.data)
      .then((data) => {
        setNotes(data);
        console.log(data);
      })
      .catch((error) => alert(error));
  };

  const deleteNote = (id) => {
    api
      .delete(`/api/notes/delete/${id}/`)
      .then((res) => {
        if (res.status === 204) alert("Note Deleted");
        else alert("Error Deleting Note");
      })
      .catch((error) => alert(error));
    getNotes(); //best practice should be instead of regetting all notes to just remove the note from the state on the front end (notes array)
  };

  const createNote = (e) => {
    e.preventDefault();
    api
      .post("/api/notes/", { content, title })
      .then((res) => {
        if (res.status === 201) alert("Note Created");
        else alert("Error Creating Note");
      })
      .catch((error) => alert(error));
    getNotes(); //best practice should be instead of regetting all notes to just add the note to the state on the front end (notes array)
  };
  /**
   * Using a form OnSubmit vs form action reloads just the form and not the whole page vs form action reloads the whole page
   */
  return (
    <div>
      <div>
        <h2>Notes</h2>
      </div>
      <h2>Create a Note</h2>
      <form onSubmit={createNote}>
        <label htmlFor="title">Title:</label>
        <br />
        <input
          type="text"
          id="title"
          name="title"
          required
          onChange={(e) => setTitle(e.target.value)}
          value={title}
        />
        <label htmlFor="content">Content:</label>
        <br />
        <textarea
          id="content"
          name="content"
          required
          onChange={(e) => setContent(e.target.value)}
          value={content}
        />
        <br />
        <input type="submit" value="Submit" />
      </form>
    </div>
  );
}

export default Home;
