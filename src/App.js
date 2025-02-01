import { HashRouter as Router, Routes, Route } from 'react-router-dom';
import QuizForm from './QuizForm';
import './App.css';
import CheckIcon from './CheckIcon.jsx';
import XIcon from './XIcon.jsx';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/form/*" element={<QuizForm />} />
        <Route 
          path="/" 
          element={
            <div className="guide-container">
              <header className="guide-header">
                <h1>FormalLogic Quest</h1>
                <p className="text-secondary">Unlimited free forms</p>
              </header>

              <div className="section-card">
                <h2>📡 URL Structure</h2>
                <div className="url-structure">
                  <code>
                    https://giuseppebondii.github.io/form/#/form/
                    <span className="url-part">user</span>/
                    <span className="url-part">repo</span>/
                    <span className="url-part">branch</span>/
                    <span className="url-part">file-path</span>
                  </code>
                </div>
                <p className="hint-text">
                  Replace the parts in <span className="url-part">blue</span> with your GitHub details
                </p>
              </div>

              <div className="section-card">
                <h2>💡 Live Examples</h2>
                <div className="example-grid">
                  <div className="example-card">
                    <h3>Basic Quiz</h3>
                    <pre>
{`https://giuseppebondii.github.io/form/#/form/GiuseppeBondii/form/main/prova.txt`}
                    </pre>
                    <a 
                      href="https://giuseppebondii.github.io/form/#/form/GiuseppeBondii/form/main/prova.txt" 
                      className="btn-primary"
                    >
                      Try Example
                    </a>
                  </div>
                </div>
              </div>

              <div className="section-card requirements">
                <h2>⚙️ Technical Requirements</h2>
                <ul className="status-list">
                  <li>
                    <CheckIcon className="status-icon valid" /> 
                    <span>Public GitHub repository</span>
                    <span className="status-detail">(required for file access)</span>
                  </li>
                  <li>
                    <XIcon className="status-icon invalid" />
                    <span>Authentication tokens</span>
                    <span className="status-detail">(not needed)</span>
                  </li>
                </ul>
              </div>

              <footer className="app-footer">
                <p>🔒 All data remains on GitHub's servers - No tracking or data collection</p>
              </footer>
            </div>
          } 
        />
      </Routes>
    </Router>
  );
}

export default App;