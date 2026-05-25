import Login from "./components/Login";
import Register from "./components/Register";
import Show from "./assets/show";
import { Routes ,BrowserRouter ,Route } from "react-router-dom";
import Waits from "./assets/wait";


  

export default function App(){


  return(
    <>
    <BrowserRouter>
     <Routes>
        <Route path="/" element={<Register/>}></Route>
        <Route path="/wait/:email" element={<Waits/>}></Route>
        <Route path="/show" element={<Show/>}></Route>
     </Routes>
    
    </BrowserRouter>
   

    </>
  )
}