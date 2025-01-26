import React, { useState, useEffect } from 'react';
import { XMarkIcon, MicrophoneIcon } from '@heroicons/react/24/outline';

const ChatDialog = ({ isOpen, onClose }) => {
  const [isRecording, setIsRecording] = useState(false);
  const [mediaRecorder, setMediaRecorder] = useState(null);
  const [audioURL, setAudioURL] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    // 清理函数
    return () => {
      if (mediaRecorder && mediaRecorder.state === 'recording') {
        mediaRecorder.stop();
        mediaRecorder.stream.getTracks().forEach(track => track.stop());
      }
    };
  }, [mediaRecorder]);

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const recorder = new MediaRecorder(stream);
      const chunks = [];

      recorder.ondataavailable = (e) => chunks.push(e.data);
      recorder.onstop = () => {
        const blob = new Blob(chunks, { type: 'audio/ogg; codecs=opus' });
        setAudioURL(URL.createObjectURL(blob));
      };

      recorder.start();
      setMediaRecorder(recorder);
      setIsRecording(true);
      setError(null);
    } catch (err) {
      console.error('录音失败:', err);
      setError('无法访问麦克风，请确保已授予麦克风访问权限');
      setIsRecording(false);
    }
  };

  const stopRecording = () => {
    if (mediaRecorder && mediaRecorder.state === 'recording') {
      mediaRecorder.stop();
      mediaRecorder.stream.getTracks().forEach(track => track.stop());
      setIsRecording(false);
    }
  };

  const handleRecordClick = () => {
    if (!isRecording) {
      startRecording();
    } else {
      stopRecording();
    }
  };

  const playRecording = () => {
    if (audioURL) {
      const audio = new Audio(audioURL);
      audio.play();
    }
  };

  return (
    <div className={`chat-dialog ${isOpen ? 'active' : ''}`}>
      <div className="chat-dialog-header">
        <h3>语音练习</h3>
        <button className="chat-close" onClick={onClose}>
          <XMarkIcon className="h-6 w-6" />
        </button>
      </div>
      <div className="chat-dialog-content">
        <div className="messages-container">
          {error && (
            <div className="error-message">
              {error}
            </div>
          )}
        </div>
        <div className="recording-controls">
          <div className="recording-status">
            <div className={`recording-indicator ${isRecording ? 'active' : ''}`}></div>
            <span>{isRecording ? '正在录音...' : '准备开始录音...'}</span>
          </div>
          <div className="recording-buttons">
            <button 
              className={`record-button ${isRecording ? 'recording' : ''}`}
              onClick={handleRecordClick}
              title={isRecording ? '停止录音' : '开始录音'}
            >
              <MicrophoneIcon className="h-8 w-8" />
            </button>
            {audioURL && !isRecording && (
              <button
                className="play-recording-button"
                onClick={playRecording}
                title="播放录音"
              >
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="h-8 w-8">
                  <path d="M5.25 5.653c0-.856.917-1.398 1.667-.986l11.54 6.348a1.125 1.125 0 010 1.971l-11.54 6.347c-.75.412-1.667-.13-1.667-.986V5.653z" />
                </svg>
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChatDialog;