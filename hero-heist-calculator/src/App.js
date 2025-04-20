import { BrowserRouter as Router, Route, Routes} from 'react-router';
import IndexPage from './Components/IndexPage/IndexPage';
import './App.css';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={ <IndexPage />   } />
      </Routes>
    </Router>
  );
}

export default App;
