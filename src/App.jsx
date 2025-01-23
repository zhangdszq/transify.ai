import { useState } from 'react';
import './App.css';
import PracticeArea from './components/PracticeArea';
import Sidebar from './components/Sidebar';
import LeftSidebar from './components/LeftSidebar';
import { translateText, analyzeEnglishGrammar, analyzeChineseGrammar } from './services/api';

function App() {
  const [sentences, setSentences] = useState([]);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isLeftSidebarOpen, setIsLeftSidebarOpen] = useState(false);
  const [grammarAnalysis, setGrammarAnalysis] = useState([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [isChineseAnalyzing, setIsChineseAnalyzing] = useState(false);  // 添加新状态

  const [lastInputText, setLastInputText] = useState('');
  const [translationCache, setTranslationCache] = useState({});
  const [grammarCache, setGrammarCache] = useState({});
  const [apiToken, setApiToken] = useState('');
  const [isLoading, setIsLoading] = useState(false);  // Add this line
  const [history, setHistory] = useState(() => {
    const savedHistory = localStorage.getItem('translationHistory');
    return savedHistory ? JSON.parse(savedHistory) : [];
  });
  const [showTranslation, setShowTranslation] = useState(true);
  const [practiceMode, setPracticeMode] = useState('writing'); // 添加练习模式状态
  const [favorites, setFavorites] = useState(() => {
    const savedFavorites = localStorage.getItem('favoritesSentences');
    return savedFavorites ? JSON.parse(savedFavorites) : [];
  });

  const handleFavoriteToggle = (sentence) => {
    const existingIndex = favorites.findIndex(item => item.sentence === sentence);
    let newFavorites;
    if (existingIndex >= 0) {
      newFavorites = favorites.filter((_, index) => index !== existingIndex);
    } else {
      newFavorites = [...favorites, {
        sentence,
        timestamp: new Date().getTime()
      }];
    }
    setFavorites(newFavorites);
    localStorage.setItem('favoritesSentences', JSON.stringify(newFavorites));
  };

  const processText = async (mode = 'writing') => {
    setShowTranslation(true);
    setPracticeMode(mode);
    const text = document.getElementById('inputText').value;
    if (!text.trim()) {
      alert('请输入文本');
      return;
    }

    if (text === lastInputText && translationCache[text] && translationCache[text].mode === mode) {
      setSentences(translationCache[text].sentences);
      return;
    }

    setIsLoading(true);
    setIsProcessing(true);
    try {
      const translatedText = await translateText(text, mode);
      const translatedSentences = translatedText.split(/[.!?]\s*/).filter(s => s.trim());
      setSentences(translatedSentences);
      setTranslationCache(prev => ({ 
        ...prev, 
        [text]: {
          sentences: translatedSentences,
          mode
        }
      }));
      setLastInputText(text);
      
      // 修改历史记录处理逻辑
      const existingIndex = history.findIndex(item => item.text === text);
      let newHistory;
      if (existingIndex >= 0) {
        // 如果存在相同内容，更新计数并移到最前
        const existingItem = history[existingIndex];
        newHistory = [
          {
            ...existingItem,
            count: (existingItem.count || 1) + 1,
            timestamp: new Date().getTime()
          },
          ...history.filter((_, index) => index !== existingIndex)
        ];
      } else {
        // 如果是新内容，添加到最前面
        newHistory = [{
          text,
          timestamp: new Date().getTime(),
          count: 1
        }, ...history];
      }
      setHistory(newHistory);
      localStorage.setItem('translationHistory', JSON.stringify(newHistory));
    } catch (error) {
      console.error('处理文本出错:', error);
      alert(error.message);
    } finally {
      setIsProcessing(false);
      setIsLoading(false);
    }
  };

  const analyzeGrammar = async (sentence) => {
    if (grammarCache[sentence]) {
      setGrammarAnalysis(grammarCache[sentence]);
      setIsSidebarOpen(true);
      return;
    }

    setIsAnalyzing(true);
    try {
      const analysis = await analyzeEnglishGrammar(sentence);
      const analysisPoints = analysis.split('\n').filter(point => point.trim());
      
      setGrammarAnalysis(analysisPoints);
      setGrammarCache(prev => ({ ...prev, [sentence]: analysisPoints }));
      setIsSidebarOpen(true);
    } catch (error) {
      console.error('语法分析出错:', error);
      alert('语法分析服务暂时不可用，请稍后再试');
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleChineseAnalysis = async () => {
    const text = document.getElementById('inputText').value;
    if (!text.trim()) {
      alert('请输入文本');
      return;
    }
    setIsChineseAnalyzing(true);  // 使用新状态
    try {
      const analysis = await analyzeChineseGrammar(text);
      const analysisPoints = analysis.split('\n').filter(point => point.trim());
      
      setGrammarAnalysis(analysisPoints);
      setIsSidebarOpen(true);
    } catch (error) {
      console.error('分析出错:', error);
      alert('分析服务暂时不可用，请稍后再试');
    } finally {
      setIsChineseAnalyzing(false);  // 使用新状态
    }
  };

  return (
    <div className="container">
      <button className="menu-button" onClick={() => setIsLeftSidebarOpen(true)}>
        <span className="bar"></span>
        <span className="bar"></span>
        <span className="bar"></span>
      </button>
      <LeftSidebar 
        isOpen={isLeftSidebarOpen}
        onClose={() => setIsLeftSidebarOpen(false)}
        apiToken={apiToken}
        onApiTokenChange={setApiToken}
        history={history}
        setShowTranslation={setShowTranslation}
        favorites={favorites}
      />
      <Sidebar 
        isOpen={isSidebarOpen} 
        onClose={() => setIsSidebarOpen(false)} 
        grammarAnalysis={grammarAnalysis} 
      />
      <div className="title-container">
            <h1>Transify.ai</h1>
            <div className="subtitle-container">
              <h2 className="subtitle-cn">帮你用中文组织英文句子</h2>
              <h2 className="subtitle-en">From Your Language to Any Language, Learn Efficiently.</h2>
            </div>
          </div>
      <div>
        <textarea id="inputText" placeholder="请输入中文文本..." />
      </div>
      <div className="button-container">
        <button 
          className="speak-practice-button"
          onClick={() => processText('speaking')}
          disabled={isProcessing}
        >
          {isProcessing && practiceMode === 'speaking' ? '处理中...' : '口语练习'}
        </button>
        <button 
          onClick={() => processText('writing')} 
          disabled={isProcessing}
        >
          {isProcessing && practiceMode === 'writing' ? '处理中...' : '书写练习'}
        </button>
        <button 
          className="analyze-chinese-button"
          onClick={handleChineseAnalysis}
          disabled={isChineseAnalyzing}  // 使用新状态
        >
          {isChineseAnalyzing ? '分析中...' : '分析语法结构'}  
        </button>
      </div>
      {showTranslation && !isLoading && (
          <PracticeArea 
              sentences={sentences} 
              onAnalyzeGrammar={analyzeGrammar}
              isAnalyzing={isAnalyzing}
              favorites={favorites}
              onFavoriteToggle={handleFavoriteToggle}
          />
      )}
      {isLoading && (
          <div className="loading-container">
              <div className="loading-spinner"></div>
              <p>正在处理文本...</p>
          </div>
      )}
    </div>
  );
}

export default App
