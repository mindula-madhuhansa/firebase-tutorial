import { useEffect, useState } from "react";
import "./App.css";
import { Auth } from "./components/Auth";
import { db, auth, storage } from "./config/firebase";
import {
  getDocs,
  collection,
  addDoc,
  deleteDoc,
  updateDoc,
  doc,
} from "firebase/firestore";
import { ref, uploadBytes } from "firebase/storage";

function App() {
  const [movieList, setMovieList] = useState([]);

  // new movie
  const [newmovieTitle, setNewMovieTitle] = useState("");
  const [newreleaseDate, setNewReleaseDate] = useState(0);
  const [isNewMovieOscar, setIsNewMovieOscar] = useState(false);

  // update movie
  const [updatedTitle, setUpdatedTitle] = useState("");

  // file upload
  const [fileUpload, setFileUpload] = useState();

  const moviesCollection = collection(db, "movies");

  // show
  const getMovieList = async () => {
    try {
      const data = await getDocs(moviesCollection);
      const filteredData = data.docs.map((doc) => ({
        ...doc.data(),
        id: doc.id,
      }));
      setMovieList(filteredData);
    } catch (e) {
      console.log(e);
    }
  };

  //delete
  const deleteMovie = async (id) => {
    const movieDoc = doc(db, "movies", id);
    await deleteDoc(movieDoc);
    getMovieList();
  };

  //update
  const updateMovieTitle = async (id) => {
    const movieDoc = doc(db, "movies", id);
    await updateDoc(movieDoc, { title: updatedTitle });
    getMovieList();
  };

  useEffect(() => {
    getMovieList();
  }, []);

  // create
  const onSubmitMovie = async () => {
    try {
      await addDoc(moviesCollection, {
        title: newmovieTitle,
        releaseDate: newreleaseDate,
        recievedAnOscar: isNewMovieOscar,
        userId: auth?.currentUser?.uid,
      });

      getMovieList();
    } catch (e) {
      console.log(e);
    }
  };

  // upload file
  const uploadFile = async () => {
    if (!fileUpload) return;
    const filesFolderRef = ref(storage, `projectFiles/${fileUpload.name}`);

    try {
      await uploadBytes(filesFolderRef, fileUpload);
    } catch (e) {
      console.log(e);
    }
  };

  return (
    <div className="App">
      <Auth />

      <div>
        <input
          placeholder="Movie title"
          onChange={(e) => setNewMovieTitle(e.target.value)}
        />
        <input
          placeholder="Release year"
          type="number"
          onChange={(e) => setNewReleaseDate(Number(e.target.value))}
        />
        <input
          type="checkbox"
          checked={isNewMovieOscar}
          onChange={(e) => setIsNewMovieOscar(e.target.checked)}
        />
        <label>Recieved an Oscar</label>
        <button onClick={onSubmitMovie}>Submit Movie</button>
      </div>

      <div>
        {movieList.map((movie) => (
          <div>
            <h1 style={{ color: movie.recievedAnOscar ? "green" : "red" }}>
              {movie.title}
            </h1>
            <p>Date: {movie.releaseDate}</p>
            <button onClick={() => deleteMovie(movie.id)}>Delete Movie</button>
            <input
              placeholder="New Title"
              onChange={(e) => setUpdatedTitle(e.target.value)}
            />
            <button onClick={() => updateMovieTitle(movie.id)}>
              Update Title
            </button>
          </div>
        ))}
      </div>

      <div>
        <input type="file" onChange={(e) => setFileUpload(e.target.files[0])} />
        <button onClick={uploadFile}>Upload</button>
      </div>
    </div>
  );
}

export default App;
