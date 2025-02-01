import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

function QuizForm() {
  const { githubUrl } = useParams();
  const navigate = useNavigate();
  const [questions, setQuestions] = useState([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [userAnswer, setUserAnswer] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [finalMessage, setFinalMessage] = useState('');

  useEffect(() => {
    const loadProgress = () => {
      const savedData = localStorage.getItem('quizProgress');
      if (savedData) {
        const { savedUrl, index } = JSON.parse(savedData);
        if (savedUrl === githubUrl) {
          if (index >= questions.length) {
            setFinalMessage(localStorage.getItem('finalMessage') || '');
          } else {
            setCurrentQuestionIndex(index);
          }
        }
      }
    };

    const fetchAndParseQuestions = async () => {
      try {
        const response = await fetch(`https://raw.githubusercontent.com/${githubUrl}`);
        if (!response.ok) throw new Error('File non trovato');
        
        const text = await response.text();
        const lines = text.split('\n').map(line => line.trim()).filter(line => line);

        if (lines.length === 0) throw new Error('File vuoto');

        let message = '';
        let questionLines = lines;
        
        // Check if last line is a message
        if (lines.length > 0 && !lines[lines.length - 1].includes(':->:')) {
          message = lines.pop();
        }

        const parsedQuestions = questionLines.map(line => {
          const [question, answer] = line.split(':->:').map(part => part.trim());
          if (!question || !answer) throw new Error('Formato non valido');
          return { question, answer: answer.toLowerCase() };
        });

        setQuestions(parsedQuestions);
        setFinalMessage(message);
        loadProgress();
        
      } catch (err) {
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    };

    fetchAndParseQuestions();
  }, [githubUrl]);

  const saveProgress = (index) => {
    localStorage.setItem('quizProgress', JSON.stringify({
      savedUrl: githubUrl,
      index: index
    }));
    if (finalMessage) {
      localStorage.setItem('finalMessage', finalMessage);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const normalizedAnswer = userAnswer.trim().toLowerCase();
    
    if (normalizedAnswer === questions[currentQuestionIndex].answer) {
      if (currentQuestionIndex === questions.length - 1) {
        if (finalMessage) {
          saveProgress(questions.length);
        } else {
          localStorage.removeItem('quizProgress');
        }
      } else {
        const newIndex = currentQuestionIndex + 1;
        setCurrentQuestionIndex(newIndex);
        saveProgress(newIndex);
      }
      setUserAnswer('');
    } else {
      alert('Risposta errata! Prova di nuovo.');
    }
  };

  if (isLoading) return <div className="loading">Caricamento in corso...</div>;
  if (error) return <div className="error">Errore: {error}</div>;
  if (finalMessage && currentQuestionIndex >= questions.length) {
    return (
      <div className="final-message">
        <h2>Completato!</h2>
        <p>{finalMessage}</p>
        <button onClick={() => navigate('/')}>Torna alla home</button>
      </div>
    );
  }

  return (
    <div className="quiz-container">
      <div className="progress">
        Domanda {currentQuestionIndex + 1} di {questions.length}
      </div>
      <h2 className="question">{questions[currentQuestionIndex].question}</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          value={userAnswer}
          onChange={(e) => setUserAnswer(e.target.value)}
          placeholder="Scrivi la tua risposta..."
          autoFocus
        />
        <button type="submit">Invia</button>
      </form>
    </div>
  );
}

export default QuizForm;