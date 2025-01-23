import ReactMarkdown from 'react-markdown';

const Sidebar = ({ isOpen, onClose, grammarAnalysis }) => {
    return (
        <div className={`sidebar ${isOpen ? 'active' : ''}`}>
            <span className="sidebar-close" onClick={onClose}>&times;</span>
            <h2>语法分析</h2>
            <div className="grammar-analysis">
                <ReactMarkdown>
                    {grammarAnalysis.join('\n')}
                </ReactMarkdown>
            </div>
        </div>
    );
};

export default Sidebar;