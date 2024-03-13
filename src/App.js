import React, {useEffect, useState} from "react"; 

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
    Title: "Inception",
    Year: "2010",
    Poster:
      "https://m.media-amazon.com/images/M/MV5BMjAxMzY3NjcxNF5BMl5BanBnXkFtZTcwNTI5OTM0Mw@@._V1_SX300.jpg",
    runtime: 148,
    imdbRating: 8.8,
    userRating: 10,
  },
  {
    imdbID: "tt0088763",
    Title: "Back to the Future",
    Year: "1985",
    Poster:
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
  const [movies, setMovies] = useState(tempMovieData);
  const [watched, setWatched] = useState(tempWatchedData);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("")
  const [selectedId, setSelectedId] = useState("12345")

  function handleSelectedId(id){
    setSelectedId(selectedId => selectedId=== id ? null : id)
  }

  function handleClose(){
    setSelectedId(null)
  }

  useEffect(function(){
   async function fetchData(){
    setIsLoading(true);
    setErrorMessage("");

    try {
      const res = await fetch(`http://www.omdbapi.com/?apikey=${KEY}&s=${query}`)
      
      const data = await res.json()
      if(!res.ok) throw new Error()
      if(data.Response === "False") throw new Error()

      setMovies(data.Search)
}
      catch(err){
        setErrorMessage(err.message)
      }
      finally{
        setIsLoading(false)
      }
    } 
    if(query.length < 3){
      setMovies([])
      setErrorMessage("");
      return
    }
    fetchData();
  }, [query]
  )
 
  return (
    <>
      <NavBar query={query} setQuery={setQuery} movies={movies} />
      <Main movies={movies} watched={watched} isLoading={isLoading} errorMessage={errorMessage} selectedId={selectedId} setSelectedId={handleSelectedId} handleClose={handleClose}/>
    </>
  );
}

function NavBar({query, setQuery, movies}){
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
        />
        <p className="num-results">
          Found <strong>{movies.length}</strong> results
        </p>
      </nav>
}

function Main({movies, watched, isLoading, errorMessage, selectedId, setSelectedId, handleClose}){

  return (
  <main className="main">
  <Box>
  {isLoading && <Loader />}
  {!isLoading && !errorMessage && <MovieList movies={movies} selectedId={selectedId} setSelectedId={setSelectedId}/>}
  {errorMessage && <ErrorMessage message={errorMessage}/>}
  </Box>
  <Box>
    {selectedId ? <MovieDetails selectedId={selectedId} handleClose={handleClose}/> :
    <WatchedSummary watched={watched}/>}
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

function Loader(){
  return <p className="loader">Fetching data....!</p>
}

function ErrorMessage({message}){
  return <p className="error"><span>🚫 </span>{message}</p>
}

function WatchedSummary({watched}){
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
              <span>{avgImdbRating}</span>
            </p>
            <p>
              <span>🌟</span>
              <span>{avgUserRating}</span>
            </p>
            <p>
              <span>⏳</span>
              <span>{avgRuntime} min</span>
            </p>
          </div>
        </div>

        <ul className="list list-movies">
          {watched.map((movie) => (
            <li key={movie.imdbID}>
              <img src={movie.Poster} alt={`${movie.Title} poster`} />
              <h3>{movie.Title}</h3>
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
              </div>
            </li>
          ))}
        </ul>
      </>
  )
}

function MovieDetails({selectedId, handleClose}){
  const [movie, setMovie] = useState({})
  useEffect(function(){
    async function movieDetails(){
      const res = await fetch(`http://www.omdbapi.com/?apikey=${KEY}&i=${selectedId}`)
      const data = await res.json();
      setMovie(data)
    }
    movieDetails()
  }, [selectedId]);

  return <div>
    <button className="btn-back" onClick={handleClose}>&larr;</button>
    {selectedId}
  </div>
}