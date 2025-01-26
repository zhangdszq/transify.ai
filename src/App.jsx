import { useState } from 'react';
import './App.css';
import PracticeArea from './components/PracticeArea';
import Sidebar from './components/Sidebar';
import LeftSidebar from './components/LeftSidebar';
import { translateText, analyzeEnglishGrammar, getRandomChineseArticle, analyzeWordTypes, analyzeChineseContent } from './services/api';

function App() {
  const [sentences, setSentences] = useState([]);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isLeftSidebarOpen, setIsLeftSidebarOpen] = useState(false);
  const [grammarAnalysis, setGrammarAnalysis] = useState([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [isChineseAnalyzing, setIsChineseAnalyzing] = useState(false);
  const [wordAnalysis, setWordAnalysis] = useState({});  // 添加词性分析状态

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
  
    setIsLoading(true);
    setIsProcessing(true);
    try {
      // 同步分析中文内容
      const contentAnalysis = await analyzeChineseContent(text);
      
      // 更新UI显示分析结果
      setWordAnalysis({
        segments: contentAnalysis.keywords.map(keyword => ({
          chinese: keyword
        })),
        mainIdea: contentAnalysis.mainIdea,
        keySentences: contentAnalysis.keySentences
      });
  
      // 继续原有的翻译逻辑
      if (text === lastInputText && translationCache[text] && translationCache[text].mode === mode) {
        setSentences(translationCache[text].sentences);
        return;
      }
  
      const translatedText = await translateText(text, mode);
      const translatedSentences = translatedText.split(/[.!?]\s*/).filter(s => s.trim());
      setSentences(translatedSentences);
      
      // 保存到缓存
      setTranslationCache(prev => ({
        ...prev,
        [text]: {
          sentences: translatedSentences,
          mode,
          analysis: wordAnalysis
        }
      }));
      
      setLastInputText(text);
      
      // 修改历史记录处理逻辑
      const existingIndex = history.findIndex(item => item.text === text);
      let newHistory;
      if (existingIndex >= 0) {
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

  const handleGetRandomArticle = async () => {
    setIsChineseAnalyzing(true);
    try {
      const article = await getRandomChineseArticle();
      document.getElementById('inputText').value = article;
      document.getElementById('inputText').dispatchEvent(new Event('input'));
    } catch (error) {
      console.error('获取随机文章失败:', error);
      alert('获取随机文章服务暂时不可用，请稍后再试');
    } finally {
      setIsChineseAnalyzing(false);
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
              <h2 className="subtitle-cn">帮你用中文学习英文</h2>
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
          {isProcessing && practiceMode === 'speaking' ? '处理中...' : '口语翻译'}
        </button>
        {/* <button 
          onClick={() => processText('writing')} 
          disabled={isProcessing}
        >
          {isProcessing && practiceMode === 'writing' ? '处理中...' : '书写翻译'}
        </button> */}
        <button 
          className="random-article-button"
          onClick={handleGetRandomArticle}
          disabled={isChineseAnalyzing}
        >
          {isChineseAnalyzing ? '获取中...' : '随机短文'}  
        </button>
      </div>
      {!isLoading && lastInputText && (
        <>
          <div className="section-title">
            <h2>一. 对照中文，尝试开口说英文</h2>
            <p className="section-subtitle">🤗 大胆开口练习,
别害怕犯错
勇敢开口
摆脱哑巴英语的关键!</p>
          </div>
          <div className="chinese-content-section">
            <div className="chinese-content">
              {lastInputText && (
                <div>
                  {(() => {
                    const highlightedText = [];
                    let currentIndex = 0;

                    // 遍历所有关键词
                    wordAnalysis.segments?.forEach((segment, segmentIndex) => {
                      const keyword = segment.chinese;
                      let startIndex = 0;

                      // 在文本中查找所有匹配项
                      while (true) {
                        const matchIndex = lastInputText.indexOf(keyword, startIndex);
                        if (matchIndex === -1) break;

                        // 添加匹配项之前的普通文本
                        if (matchIndex > currentIndex) {
                          highlightedText.push(
                            <span key={`text-${currentIndex}`}>
                              {lastInputText.slice(currentIndex, matchIndex)}
                            </span>
                          );
                        }

                        // 添加高亮的关键词
                        highlightedText.push(
                          <span
                            key={`highlight-${matchIndex}`}
                            className={`highlight-${segmentIndex % 5}`}
                          >
                            {keyword}
                          </span>
                        );

                        currentIndex = matchIndex + keyword.length;
                        startIndex = matchIndex + 1;
                      }
                    });

                    // 添加剩余的文本
                    if (currentIndex < lastInputText.length) {
                      highlightedText.push(
                        <span key={`text-${currentIndex}`}>
                          {lastInputText.slice(currentIndex)}
                        </span>
                      );
                    }

                    return highlightedText;
                  })()}
                </div>
              )}
            </div>
          </div>
        </>
      )}
      {sentences.length > 0 && !isLoading && (
        <>
          <div className="section-title">
            <h2>二、对照英文，排查卡壳的地方</h2>
            <p className="section-subtitle">对照 AI 母语者的表达，查看不会和卡壳的地方。</p>
          </div>
          <div className="comparison-container">
            <div className="chinese-section">
              <h3>中文原文</h3>
              <div className="content">
                {(() => {
                  // 使用更智能的中文分句规则
                  const splitChineseSentences = (text) => {
                    const sentenceEnds = ['。', '！', '？', '；', '.', '!', '?', ';'];
                    const sentences = [];
                    let currentSentence = '';
                    
                    for (let i = 0; i < text.length; i++) {
                      currentSentence += text[i];
                      if (sentenceEnds.includes(text[i]) || i === text.length - 1) {
                        sentences.push(currentSentence.trim());
                        currentSentence = '';
                      }
                    }
                    
                    return sentences.filter(s => s.length > 0);
                  };
                  
                  const chineseSentences = splitChineseSentences(lastInputText);
                  
                  return chineseSentences.map((segment, index) => {
                    const segmentData = wordAnalysis.segments?.[index];
                    return (
                      <p key={index} className={segmentData ? `highlight-${index % 5}` : ''}>
                        {segment}
                      </p>
                    );
                  });
                })()}
              </div>
            </div>
            <div className="english-section">
              <h3>英文翻译</h3>
              <div className="content">
                {sentences.map((sentence, index) => {
                  const segmentData = wordAnalysis.segments?.[index];
                  return (
                    <p key={index} className={segmentData ? `highlight-${index % 5}` : ''}>
                      {sentence}
                    </p>
                  );
                })}
              </div>
            </div>
          </div>
        </>
      )}
      {sentences.length > 0 && !isLoading && showTranslation && (
        <>
          <div className="section-title">
            <h2>三、精读文本，积累地道实用生词和短语</h2>
            <p className="section-subtitle">学习母语者地道的表达。坚持每天积累一点点，你会惊讶于自己的词汇量增长速度。</p>
          </div>
          <PracticeArea 
              sentences={sentences} 
              onAnalyzeGrammar={analyzeGrammar}
              isAnalyzing={isAnalyzing}
              favorites={favorites}
              onFavoriteToggle={handleFavoriteToggle}
          />
        </>
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
