import { HashRouter as Router, Routes, Route } from 'react-router-dom';
import QuizForm from './QuizForm';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/form/:githubUrl" element={<QuizForm />} />
        <Route 
          path="/" 
          element={
            <div style={{ padding: '20px', textAlign: 'center' }}>
              <h1>Benvenuto al Quiz Generator</h1>
              <p>Usa un URL GitHub valido nel formato:</p>
              <code>tuo-username/tuo-repo/main/path/file.txt</code>
            </div>
          } 
        />
      </Routes>
    </Router>
  );
}

export default App;