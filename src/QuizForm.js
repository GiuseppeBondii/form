import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

function QuizForm() {
  const params = useParams();
  const githubUrl = params['*']; 
  const navigate = useNavigate();
  const [questions, setQuestions] = useState([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [userAnswer, setUserAnswer] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [finalMessage, setFinalMessage] = useState('');

  useEffect(() => {
    const fetchAndParseQuestions = async () => {
      try {
        const response = await fetch(`https://raw.githubusercontent.com/${githubUrl}`);
        const text = await response.text();
        
        // Parsing delle domande
        const lines = text.split('\n').filter(line => line.trim());
        let message = '';
        let questionLines = lines;
  
        if (lines.length > 0 && !lines[lines.length - 1].includes(':->:')) {
          message = lines.pop();
        }
  
        const parsedQuestions = questionLines.map(line => {
          const [question, answer] = line.split(':->:').map(p => p.trim());
          return { question, answer: answer.toLowerCase() };
        });
  
        // Caricamento del progresso DOPO aver parsato le domande
        const savedData = localStorage.getItem('quizProgress');
        if (savedData) {
          const { savedUrl, index } = JSON.parse(savedData);
          
          if (savedUrl === githubUrl) {
            // Controllo sicurezza sull'indice
            const safeIndex = Math.min(index, parsedQuestions.length);
            
            if (safeIndex === parsedQuestions.length && message) {
              setCurrentQuestionIndex(safeIndex);
              setFinalMessage(message);
            } else {
              setCurrentQuestionIndex(safeIndex);
            }
          }
        }
  
        setQuestions(parsedQuestions);
        setFinalMessage(message);
  
      } catch (err) {
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    };
  
    fetchAndParseQuestions();
  }, [githubUrl]);
  
  const saveProgress = (index) => {
    const safeIndex = Math.min(index, questions.length);
    localStorage.setItem('quizProgress', JSON.stringify({
      savedUrl: githubUrl,
      index: safeIndex
    }));
  };


  const handleSubmit = (e) => {
    e.preventDefault();
    const normalizedAnswer = userAnswer.trim().toLowerCase();
    
    if (normalizedAnswer === questions[currentQuestionIndex].answer) {
      if (currentQuestionIndex === questions.length - 1) {
        if (finalMessage) {
          // Forza l'aggiornamento dello stato prima del salvataggio
          setCurrentQuestionIndex(prev => {
            const newIndex = prev + 1;
            saveProgress(newIndex);
            return newIndex;
          });
        } else {
          localStorage.removeItem('quizProgress');
          navigate('/');
        }
      } else {
        setCurrentQuestionIndex(prev => {
          const newIndex = prev + 1;
          saveProgress(newIndex);
          return newIndex;
        });
      }
      setUserAnswer('');
    } else {
      alert('Wrong, try again');
    }
  };

  // Renderizzazione condizionale
  if (isLoading) {
    return <div className="loading">Caricamento domande...</div>;
  }

  if (error) {
    return (
      <div className="error">
        <h2>Errore nel caricamento</h2>
        <p>{error}</p>
        <button onClick={() => navigate('/')}>Torna alla Home</button>
      </div>
    );
  }

  // Modifica la condizione del messaggio finale
if (finalMessage && currentQuestionIndex >= questions.length) {
    return (
      <div className="final-message">
        <p>{finalMessage}</p>
        <button onClick={() => {
          localStorage.removeItem('quizProgress');
          navigate('/');
        }}>Torna alla Home</button>
      </div>
    );
  }

  if (questions.length === 0) {
    return (
      <div className="error">
        <h2>Nessuna domanda disponibile</h2>
        <p>Il file non contiene domande valide nel formato richiesto</p>
      </div>
    );
  }

  return (
    <div className="quiz-container">
      
      <div className="question-card">
        <h2>{questions[currentQuestionIndex].question}</h2>
        
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            value={userAnswer}
            onChange={(e) => setUserAnswer(e.target.value)}
            placeholder="Scrivi la tua risposta..."
            autoFocus
            aria-label="Risposta alla domanda"
          />
          
          <button 
            type="submit"
            className="submit-button"
            disabled={!userAnswer.trim()}
          >
            Verifica
          </button>
        </form>
      </div>
    </div>
  );
}

export default QuizForm;