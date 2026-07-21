import Welcome from "./components/Welcome";
import TodoList from "./components/TodoList";
import FocusApp from "./components/FocusApp";


function App(){
  return (
    <div style={{ maxWidth:'600px', margin:'40px auto',fontFamily:'sans-serif'}}>
      <h1>專案主頁面</h1>
      <hr/>
      {/*呼叫我剛剛建立的Welcome組件(Welcome.jsx)*/}
      <Welcome/>
      <TodoList/>
      <FocusApp/>
    </div>
  )
}

export default App
