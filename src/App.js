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
                <h2>📘 How to use</h2>
                <p>Follow these steps to create and use a quiz hosted on GitHub:</p>
                <ol>
                  <li>Create a plain text file (.txt) in a public GitHub repository.</li>
                  <li>Write questions using the format <code>{'Question :->: Answer'}</code>. Answers are checked case-insensitively.</li>
                  <li>To add images to a question, place image tokens before the question or on the same line. Supported formats:
                    <ul>
                      <li><code>img:"https://.../image.jpg"</code></li>
                      <li><code>img:'https://.../image.jpg'</code></li>
                      <li><code>img:https://.../image.jpg</code></li>
                      <li><code>:img: "https://.../image.jpg"</code></li>
                    </ul>
                  </li>
                  <li>If you paste a GitHub URL that contains <code>/blob/</code>, the app will automatically convert it to the raw URL (e.g. <code>raw.githubusercontent.com</code>).</li>
                  <li>Upload the file and open it in the app using the hash URL with this pattern:
                    <pre>https://giuseppebondii.github.io/form/#/form/&lt;user&gt;/&lt;repo&gt;/&lt;branch&gt;/&lt;path-to-file.txt&gt;</pre>
                  </li>
                  <li>Quick example:
                    <pre>https://giuseppebondii.github.io/form/#/form/GiuseppeBondii/form/main/src/ESCRM.txt</pre>
                  </li>
                </ol>
                <p>Notes:
                  <ul>
                    <li>The repository must be public so the browser can fetch the file.</li>
                    <li>Images that fail to load are hidden (onError). I can add a visual placeholder if you prefer.</li>
                  </ul>
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
                      className="btn-sec"
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
                <p>Developed by Giuseppe Bondi</p>                
              </footer>
            </div>
          } 
        />
      </Routes>
    </Router>
  );
}

export default App;