import { useState, useEffect } from 'react';

const PracticeArea = ({ sentences, onAnalyzeGrammar, isAnalyzing, favorites, onFavoriteToggle }) => {
    const [analyzingStates, setAnalyzingStates] = useState({});
    const [hiddenSentences, setHiddenSentences] = useState(new Set());

    const toggleSentenceVisibility = (index, isHidden) => {
        const newHiddenSentences = new Set(hiddenSentences);
        if (isHidden) {
            newHiddenSentences.add(index);
        } else {
            newHiddenSentences.delete(index);
        }
        setHiddenSentences(newHiddenSentences);
    };

    const handleAnalyzeGrammar = async (sentence, index) => {
        setAnalyzingStates(prev => ({ ...prev, [index]: true }));
        await onAnalyzeGrammar(sentence);
        setAnalyzingStates(prev => ({ ...prev, [index]: false }));
    };

    const playAudio = (text) => {
        const utterance = new SpeechSynthesisUtterance(text);
        utterance.lang = 'en-US';
        speechSynthesis.speak(utterance);
    };

    return (
        <div className="practice-area">
            {sentences.map((sentence, index) => (
                <div key={index} className="sentence-container">
                    <button
                        className={`favorite-star ${favorites.some(item => item.sentence === sentence) ? 'active' : ''}`}
                        onClick={() => onFavoriteToggle(sentence)}
                        title={favorites.some(item => item.sentence === sentence) ? '取消收藏' : '收藏'}
                    >
                        <svg viewBox="0 0 24 24" width="24" height="24" fill="currentColor">
                            <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z"/>
                        </svg>
                    </button>
                    <div 
                        className={`sentence-text ${hiddenSentences.has(index) ? 'hidden' : ''}`}
                        onMouseEnter={() => toggleSentenceVisibility(index, false)}
                        onMouseLeave={(e) => {
                            const input = e.target.nextElementSibling;
                            if (document.activeElement === input) {
                                toggleSentenceVisibility(index, true);
                            }
                        }}
                    >
                        {sentence}
                        <button 
                            className="play-button" 
                            onClick={() => playAudio(sentence)}
                            title="播放"
                        >
                            <svg viewBox="0 0 24 24" width="16" height="16" fill="#2563eb;">
                                <path d="M3 9v6h4l5 5V4L7 9H3zm13.5 3c0-1.77-1.02-3.29-2.5-4.03v8.05c1.48-.73 2.5-2.25 2.5-4.02z"/>
                            </svg>
                        </button>
                    </div>
                    <input
                        type="text"
                        className="practice-input"
                        placeholder="请输入上面的句子..."
                        onChange={(e) => handleInputChange(e, sentence)}
                        onFocus={() => toggleSentenceVisibility(index, true)}
                        onBlur={() => toggleSentenceVisibility(index, false)}
                    />
                    <button 
                        className="analyze-button"
                        onClick={() => handleAnalyzeGrammar(sentence + '.', index)}
                        disabled={analyzingStates[index]}
                    >
                        {analyzingStates[index] ? '分析中...' : '分析语法'}
                    </button>
                </div>
            ))}
        </div>
    );
};

export default PracticeArea;