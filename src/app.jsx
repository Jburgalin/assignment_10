import { useState, useEffect, useRef, useReducer } from 'react'; 

const initialState = { 
 data: [], 
 isLoading: false, 
 isError: false, 
 searchTerm: 'react', 
}; 

function storiesReducer(state, action) { 
 switch (action.type) { 
   case 'FETCH_INIT': 
     return { ...state, isLoading: true, isError: false }; 
   case 'FETCH_SUCCESS': 
     return { ...state, isLoading: false, data: action.payload }; 
   case 'FETCH_FAILURE': 
     return { ...state, isLoading: false, isError: true }; 
   case 'REMOVE_ITEM': 
     return { ...state, data: state.data.filter(item => item.objectID !== action.payload) }; 
   case 'SET_SEARCH_TERM': 
     return { ...state, searchTerm: action.payload }; 
   default: 
     throw new Error(); 
 } 
} 

function App() { 
 const inputRef = useRef(); 
 const [state, dispatch] = useReducer(storiesReducer, initialState); 
 
 const handleFetch = () => { 
     dispatch({ type: 'FETCH_INIT' });
        fetch(`https://hn.algolia.com/api/v1/search?query=${state.searchTerm}`)
        .then(response => response.json())
        .then(result => {
          dispatch({ type: 'FETCH_SUCCESS', payload: result.hits });
          })
        .catch(() => {
          dispatch({ type: 'FETCH_FAILURE' });
        });
   };

  useEffect(() => {
    handleFetch();
  }, []);

  const handleSearchInput = (event) => { 
     dispatch({ type: 'SET_SEARCH_TERM', payload: event.target.value }); 
   }
 
 const handleSearchSubmit = (event) => {
     event.preventDefault(); 
      handleFetch();
      inputRef.current.focus(); 
   };

 return ( 
   <div style={{ padding: '20px', fontFamily: 'Arial' }}>
     <h1>My Articles</h1> 

     {/* Your code goes here */} 
    <form onSubmit={handleSearchSubmit}>
      <input 
        type="text"
        ref={inputRef}
        onChange={handleSearchInput}
        value={state.searchTerm}
    />
    <button type="submit">Search</button>
    </form>

    {state.isError && <p>Something went wrong ...</p>}
    {state.isLoading ? (
      <p>Loading ...</p>
    ) : (
      <ul>
        {state.data.map(item => (
          <li key={item.objectID} style={{ marginBottom: '10px' }}>
            <a href={item.url} target="_blank" rel="noopener noreferrer" style={{ marginRight: '10px' }}>
              {item.title}
            </a>
            <button
              type="button"
              onClick={() => dispatch({ type: 'REMOVE_ITEM', payload: item.objectID })}
            >
              Remove
            </button>
          </li>
        ))}
      </ul>
    )}
   </div> 

 ); 

}  

export default App; 