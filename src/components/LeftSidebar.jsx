import { useState } from 'react';

const LeftSidebar = ({ isOpen, onClose, apiToken, onApiTokenChange, history, setShowTranslation, favorites }) => {
    const [activeTab, setActiveTab] = useState('history');
    const [hoveredItem, setHoveredItem] = useState(null);

    return (
        <div className={`left-sidebar ${isOpen ? 'active' : ''}`}>
            <span className="sidebar-close" onClick={onClose}>&times;</span>
            
            <div className="sidebar-tabs">
                <button 
                    className={`tab-button ${activeTab === 'history' ? 'active' : ''}`}
                    onClick={() => setActiveTab('history')}
                    onMouseEnter={() => setHoveredItem('history')}
                    onMouseLeave={() => setHoveredItem(null)}
                >
                    <svg viewBox="0 0 24 24" fill="currentColor" width="24" height="24">
                        <path d="M12 2C6.5 2 2 6.5 2 12s4.5 10 10 10 10-4.5 10-10S17.5 2 12 2zm0 18c-4.4 0-8-3.6-8-8s3.6-8 8-8 8 3.6 8 8-3.6 8-8 8zm1-13h-2v6l5.2 3.2.8-1.3-4-2.4V7z"/>
                    </svg>
                    <span>历史</span>
                </button>
                <button 
                    className={`tab-button ${activeTab === 'favorites' ? 'active' : ''}`}
                    onClick={() => setActiveTab('favorites')}
                    onMouseEnter={() => setHoveredItem('favorites')}
                    onMouseLeave={() => setHoveredItem(null)}
                >
                    <svg viewBox="0 0 24 24" fill="currentColor" width="24" height="24">
                        <path d="M17 3H7c-1.1 0-2 .9-2 2v16l7-3 7 3V5c0-1.1-.9-2-2-2z"/>
                    </svg>
                    <span>收藏</span>
                </button>
                <button 
                    className={`tab-button ${activeTab === 'settings' ? 'active' : ''}`}
                    onClick={() => setActiveTab('settings')}
                    onMouseEnter={() => setHoveredItem('settings')}
                    onMouseLeave={() => setHoveredItem(null)}
                >
                    <svg viewBox="0 0 24 24" fill="currentColor" width="24" height="24">
                        <path d="M19.4 13c0-.3.1-.6.1-1s0-.7-.1-1l2.1-1.6c.2-.2.2-.4.1-.6l-2-3.5c-.1-.2-.4-.3-.6-.2l-2.5 1c-.5-.4-1.1-.7-1.7-.9l-.4-2.6c0-.2-.2-.4-.5-.4h-4c-.3 0-.5.2-.5.4l-.4 2.6c-.6.2-1.2.6-1.7.9l-2.5-1c-.2-.1-.5 0-.6.2l-2 3.5c-.1.2-.1.5.1.6l2.1 1.6c0 .3-.1.6-.1 1s0 .7.1 1l-2.1 1.6c-.2.2-.2.4-.1.6l2 3.5c.1.2.4.3.6.2l2.5-1c.5.4 1.1.7 1.7.9l.4 2.6c0 .2.2.4.5.4h4c.3 0 .5-.2.5-.4l.4-2.6c.6-.2 1.2-.6 1.7-.9l2.5 1c.2.1.5 0 .6-.2l2-3.5c.1-.2.1-.5-.1-.6l-2.1-1.6zM12 15.5c-1.9 0-3.5-1.6-3.5-3.5s1.6-3.5 3.5-3.5 3.5 1.6 3.5 3.5-1.6 3.5-3.5 3.5z"/>
                    </svg>
                    <span>设置</span>
                </button>
            </div>

            <div className="sidebar-content">
                {activeTab === 'history' && (
                    <div className="history-list">
                        {history.map((item, index) => (
                            <div 
                                key={index} 
                                className="history-item"
                                onClick={() => {
                                    document.getElementById('inputText').value = item.text;
                                    document.getElementById('inputText').dispatchEvent(new Event('input'));
                                    setShowTranslation(false);
                                    onClose();
                                }}
                                style={{ cursor: 'pointer' }}
                            >
                                <p className="history-text">{item.text}</p>
                                <div className="history-footer">
                                  <p className="history-date">
                                    {new Date(item.timestamp).toLocaleString()}
                                  </p>
                                  {item.count > 1 && (
                                    <div className="repeat-badge">
                                      <svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor">
                                        <path d="M17.65 6.35A7.958 7.958 0 0012 4c-4.42 0-7.99 3.58-7.99 8s3.57 8 7.99 8c3.73 0 6.84-2.55 7.73-6h-2.08A5.99 5.99 0 0112 18c-3.31 0-6-2.69-6-6s2.69-6 6-6c1.66 0 3.14.69 4.22 1.78L13 11h7V4l-2.35 2.35z"/>
                                      </svg>
                                      <span>{item.count}</span>
                                    </div>
                                  )}
                                </div>
                            </div>
                        ))}
                    </div>
                )}

                {activeTab === 'favorites' && (
                    <div className="favorites-list">
                        {favorites && favorites.map((item, index) => (
                            <div key={index} className="favorite-item">
                                <p className="favorite-text">{item.sentence}</p>
                                <p className="favorite-date">{new Date(item.timestamp).toLocaleString()}</p>
                            </div>
                        ))}
                    </div>
                )}
                {activeTab === 'settings' && (
                    <div className="settings-panel">
                        <h3>API设置</h3>
                        <div className="setting-item">
                            <label htmlFor="apiToken">API Token:</label>
                            <input
                                type="password"
                                id="apiToken"
                                value={apiToken}
                                onChange={(e) => onApiTokenChange(e.target.value)}
                                placeholder="请输入API Token"
                            />
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default LeftSidebar;