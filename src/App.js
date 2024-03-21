import React, {useEffect, useRef, useState} from "react"; 
import StarRating from "./StarRating";
import { Loader, ErrorMessage } from "./Loader";
import { useKey } from "./useKey";
import { useLocalStorage } from "./useLocalStorage";

const tempMovieData = [
  {
    imdbID: "tt1375666",
    Title: "Inception",
    Year: "2010",
    Poster:
      "https://m.media-amazon.com/images/M/MV5BMjAxMzY3NjcxNF5BMl5BanBnXkFtZTcwNTI5OTM0Mw@@._V1_SX300.jpg",
  },
  {
    imdbID: "tt0133093",
    Title: "The Matrix",
    Year: "1999",
    Poster:
      "https://m.media-amazon.com/images/M/MV5BNzQzOTk3OTAtNDQ0Zi00ZTVkLWI0MTEtMDllZjNkYzNjNTc4L2ltYWdlXkEyXkFqcGdeQXVyNjU0OTQ0OTY@._V1_SX300.jpg",
  },
  {
    imdbID: "tt6751668",
    Title: "Parasite",
    Year: "2019",
    Poster:
      "https://m.media-amazon.com/images/M/MV5BYWZjMjk3ZTItODQ2ZC00NTY5LWE0ZDYtZTI3MjcwN2Q5NTVkXkEyXkFqcGdeQXVyODk4OTc3MTY@._V1_SX300.jpg",
  },
];

const tempWatchedData = [
  {
    imdbID: "tt1375666",
    title: "Inception",
    year: "2010",
    poster:
      "https://m.media-amazon.com/images/M/MV5BMjAxMzY3NjcxNF5BMl5BanBnXkFtZTcwNTI5OTM0Mw@@._V1_SX300.jpg",
    runtime: 148,
    imdbRating: 8.8,
    userRating: 10,
  },
  {
    imdbID: "tt0088763",
    title: "Back to the Future",
    year: "1985",
    poster:
      "https://m.media-amazon.com/images/M/MV5BZmU0M2Y1OGUtZjIxNi00ZjBkLTg1MjgtOWIyNThiZWIwYjRiXkEyXkFqcGdeQXVyMTQxNzMzNDI@._V1_SX300.jpg",
    runtime: 116,
    imdbRating: 8.5,
    userRating: 9,
  },
];

const average = (arr) =>
  arr.reduce((acc, cur, i, arr) => acc + cur / arr.length, 0);

const KEY = "5172fd23";

export default function App() {
  const [query, setQuery] = useState("");
  const [movies, setMovies] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("")
  const [selectedId, setSelectedId] = useState(null);

 const [watched, setWatched] = useLocalStorage([],'watched')

  function handleWatched(movie){
    setWatched([...watched, movie])
  }

  function handleSelectedId(id){
    setSelectedId(selectedId => selectedId=== id ? null : id)
  }

  function handleClose(){
    setSelectedId(null)
  }


  useEffect(function(){
    // const controller = new AbortController();

   async function fetchData(){
    setIsLoading(true);
    setErrorMessage("");

    try {
      // const res = await fetch(`http://www.omdbapi.com/?apikey=${KEY}&s=${query}`, {signal: controller.signal})

      const res = await fetch(`http://www.omdbapi.com/?apikey=${KEY}&s=${query}`)
      
      const data = await res.json()
      if(!res.ok) throw new Error()
      if(data.Response === "False") throw new Error()

      setMovies(data.Search)
    }
      catch(err){
        if(err.name !== "AbortError"){
        setErrorMessage(err.message)
        }}
      finally{
        setIsLoading(false)
      }
    } 
    if(query.length < 3){
      setMovies([])
      setErrorMessage("");
      return
    }
    handleClose()
    fetchData();
    return function(){
      // controller.abort()
    }
  }, [query]
  )
 
  return (
    <>
      <NavBar query={query} setQuery={setQuery} movies={movies} />
      <Main movies={movies} watched={watched} isLoading={isLoading} errorMessage={errorMessage} selectedId={selectedId} setSelectedId={handleSelectedId} handleClose={handleClose} handleWatched={handleWatched} setWatched={setWatched}/>
    </>
  );
}

function NavBar({query, setQuery, movies}){
  const inputEl = useRef(null);
  useEffect(function(){
    inputEl.current.focus();
  },[]);

  useKey('Enter', function(){
    inputEl.current.focus()
    setQuery('')
  });

 return <nav className="nav-bar">
        <div className="logo">
          <span role="img">🎬</span>
          <h1>HeedMovies</h1>
        </div>
        <input
          className="search"
          type="text"
          placeholder="Search movies..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          ref={inputEl}
        />
        <p className="num-results">
          Found <strong>{movies.length}</strong> results
        </p>
      </nav>
}

function Main({movies, watched, isLoading, errorMessage, selectedId, setSelectedId, handleClose, handleWatched, setWatched}){

  function handleDeleteWatched(id){
    setWatched(watched => watched.filter(movies=> movies.imdbID !== id))
  }

  return (
  <main className="main">
  <Box>  {isLoading && <Loader />}
  {!isLoading && !errorMessage && <MovieList movies={movies} selectedId={selectedId} setSelectedId={setSelectedId}/>}
  {errorMessage && <ErrorMessage message={errorMessage}/>}
  </Box>

  <Box>
    {selectedId ? <MovieDetails selectedId={selectedId} watched={watched} handleClose={handleClose} handleWatched={handleWatched}/> :
    <WatchedSummary watched={watched} handleDeleteWatched={handleDeleteWatched}/>}
    </Box>
</main>
)}

function Box ({children}){
  const [isOpen, setIsOpen] = useState(true);
  return (
    <div className="box">
    <button
      className="btn-toggle"
      onClick={() => setIsOpen((open) => !open)}
    >
      {isOpen ? "–" : "+"}
    </button>
    {isOpen && children}
  </div>
  )
}

function MovieList({movies, setSelectedId}){

  return(
    <ul className="list list-movies">
      {movies?.map((movie) => (
        <li key={movie.imdbID} onClick={()=>setSelectedId(movie.imdbID)}>
          <img src={movie.Poster} alt={`${movie.Title} poster`} />
          <h3>{movie.Title}</h3>
          <div>
            <p>
              <span>📆</span>
              <span>{movie.Year}</span>
            </p>
          </div>
        </li>
      ))}
    </ul>
  )
}

function WatchedSummary({watched, handleDeleteWatched}){
  const avgImdbRating = average(watched.map((movie) => movie.imdbRating));
  const avgUserRating = average(watched.map((movie) => movie.userRating));
  const avgRuntime = average(watched.map((movie) => movie.runtime));
  
  return(
<>
        <div className="summary">
          <h2>Movies you watched</h2>
          <div>
            <p>
              <span>#️⃣</span>
              <span>{watched.length} movies</span>
            </p>
            <p>
              <span>⭐️</span>
              <span>{avgImdbRating.toFixed(2)}</span>
            </p>
            <p>
              <span>🌟</span>
              <span>{avgUserRating.toFixed(2)}</span>
            </p>
            <p>
              <span>⏳</span>
              <span>{avgRuntime.toFixed(1)} min</span>
            </p>
          </div>
        </div>

        <ul className="list list-movies">
          {watched.map((movie) => (
            <li key={movie.imdbID}>
              <img src={movie.poster} alt={`${movie.title} poster`} />
              <h3>{movie.title}</h3>
              <div>
                <p>
                  <span>⭐️</span>
                  <span>{movie.imdbRating}</span>
                </p>
                <p>
                  <span>🌟</span>
                  <span>{movie.userRating}</span>
                </p>
                <p>
                  <span>⏳</span>
                  <span>{movie.runtime} min</span>
                </p>
                <button className="btn-delete" onClick={()=>handleDeleteWatched(movie.imdbID)}>X</button>
              </div>
            </li>
          ))}
        </ul>
      </>
  )
}

function MovieDetails({selectedId, handleClose, handleWatched, watched}){
  const [movie, setMovie] = useState({})
  const [isLoading, setIsLoading] = useState(false)
  const [userRating, setUserRating] = useState("");
  const isWatched = watched.map(movie => movie.imdbID).includes(selectedId);
  const watchedRating = watched.find(movie => movie.imdbID === selectedId)?.userRating;


  function handleWatchedMovies(){
    const newWatched = {
      year,
      title,
      poster,
      userRating,
      imdbID: selectedId,
      imdbRating: Number(ratings),
      runtime: Number(runtime.split(" ")[0]),
    }

    handleWatched(newWatched)
    handleClose()
  }

  const {
    Title: title,
    Year: year,
    Actors: actors,
    Poster: poster,
    Plot: plot,
    Released: released,
    Runtime: runtime,
    Genre: genre,
    imdbRating: ratings,
    Director: director
  } = movie

  useKey('Escape', handleClose)

  // useEffect(function (){
  //   document.addEventListener("keydown",escape)

  //   function escape (e){
  //     if (e.code === "Escape"){
  //       handleClose()
  //     }
  //   }
  //   return function (e){
  //     document.removeEventListener("keydown",escape);
  //   }
  // }, [])

  useEffect(function(){
    async function movieDetails(){
      setIsLoading(true)
      const res = await fetch(`http://www.omdbapi.com/?apikey=${KEY}&i=${selectedId}`)
      const data = await res.json();
      setMovie(data)
      setIsLoading(false)
    }
    movieDetails()
  }, [selectedId]);

  useEffect(function(){
    document.title = `HeedMovz | ${title}`

    return function(){
      document.title = "Heedrhiss Movie App"
    }
  }, [title])
  
  return <div className="details">
    {isLoading ? <Loader /> :
    <>
      <header>
      <button className="btn-back" onClick={handleClose}>&larr;</button>
      <img src={poster} alt={title}/>
      <div className="details-overview">
      <h2>{title}</h2>
      <p>{released} &bull; {runtime}</p>
      <p>{genre}</p>
      <p><span>⭐ </span>{ratings} IMDb Ratings</p>
      </div>
    </header>
    <section>
      <div className="rating">
      
      {isWatched ? <p>You rated this movie {watchedRating}⭐</p> : <>
      <StarRating size={20} maxRating={10} onSetRating={setUserRating}/>
      {userRating && <button className="btn-add" onClick={handleWatchedMovies}>+ Add to List</button> }
      </>}
    
      </div>
      <em>{plot}</em>
      <p>Starring: {actors}</p>
      <p>Produced by {director}</p>
    </section>
    </>}
  </div>
}