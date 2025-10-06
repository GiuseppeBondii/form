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
        const lines = text.split('\n').map(l => l.trim()).filter(line => line);

        // Se l'ultima riga non contiene ':->:' la consideriamo messaggio finale
        let message = '';
        let finalImages = [];
        if (lines.length > 0 && !lines[lines.length - 1].includes(':->:')) {
          const last = lines.pop();
          // extract images from final line too
          const extractImages = (raw) => {
            const images = [];
            if (!raw) return { text: raw, images };
            // supporta img:"url" oppure :img: "url" con spazi variabili
            const regex = /(?::)?img\s*:\s*\"([^\"]+)\"/gi;
            let match;
            let cleaned = raw;
            while ((match = regex.exec(raw)) !== null) {
              const url = match[1].trim();
              if (/^https?:\/\//i.test(url)) images.push(url);
              cleaned = cleaned.replace(match[0], '').trim();
            }
            return { text: cleaned, images };
          };

          const finalExtract = extractImages(last);
          message = finalExtract.text;
          finalImages = finalExtract.images;
        }

        // Helper (reused) per estrarre immagini da una stringa
        const extractImages = (raw) => {
          const images = [];
          if (!raw) return { text: raw, images };
          const regex = /(?::)?img\s*:\s*\"([^\"]+)\"/gi;
          let match;
          let cleaned = raw;
          while ((match = regex.exec(raw)) !== null) {
            const url = match[1].trim();
            if (/^https?:\/\//i.test(url)) images.push(url);
            cleaned = cleaned.replace(match[0], '').trim();
          }
          return { text: cleaned, images };
        };

        // Ora costruiamo le domande: supportiamo lines che contengono solo immagini prima della domanda
        const parsedQuestions = [];
        let imagesBuffer = [];
        let pendingText = '';

        for (let i = 0; i < lines.length; i++) {
          const line = lines[i];

          if (line.includes(':->:')) {
            const parts = line.split(':->:');
            const qPart = (parts[0] || '').trim();
            const answerPart = (parts[1] || '').trim();

            // unisci testo multilinea precedente con il testo della domanda
            const fullQRaw = (pendingText ? pendingText + ' ' + qPart : qPart).trim();
            pendingText = '';

            const { text: questionText, images: imgsFromQ } = extractImages(fullQRaw);
            const images = [...imagesBuffer, ...imgsFromQ];
            imagesBuffer = [];

            parsedQuestions.push({ question: questionText, answer: answerPart.toLowerCase(), images });
          } else {
            // riga senza risposta: può contenere solo immagini, testo aggiuntivo della domanda, o entrambe
            const { text: cleaned, images } = extractImages(line);
            if (images && images.length > 0) {
              imagesBuffer.push(...images);
            }
            if (cleaned) {
              // testo che dovrebbe essere concatenato alla prossima domanda
              pendingText = pendingText ? pendingText + ' ' + cleaned : cleaned;
            }
          }
        }
  
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
  // se ci sono immagini nel messaggio finale, le aggiungiamo come "finalImages"
  setFinalMessage(JSON.stringify({ text: message, images: finalImages }));
  
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
  // finalMessage può essere una stringa semplice (vecchio formato) o una stringa JSON con { text, images }
  let finalData = null;
  try {
    finalData = finalMessage ? JSON.parse(finalMessage) : null;
  } catch (e) {
    finalData = { text: finalMessage || '', images: [] };
  }

  if ((finalData && finalData.text) && currentQuestionIndex >= questions.length) {
    return (
      <div className="final-message">
        {finalData.images && finalData.images.length > 0 && (
          <div className="final-images">
            {finalData.images.map((src, i) => (
              // eslint-disable-next-line react/no-array-index-key
              <img key={i} src={src} alt={`final-${i}`} className="final-image" onError={(e) => { e.target.style.display = 'none'; }} />
            ))}
          </div>
        )}
        <p>{finalData.text}</p>
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
        <h2>
          {questions[currentQuestionIndex].question}
        </h2>
        {questions[currentQuestionIndex].images && questions[currentQuestionIndex].images.length > 0 && (
          <div className="question-images">
            {questions[currentQuestionIndex].images.map((src, i) => (
              // eslint-disable-next-line react/no-array-index-key
              <img key={i} src={src} alt={`question-${i}`} className="question-image" onError={(e) => { e.target.style.display = 'none'; }} />
            ))}
          </div>
        )}
        
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