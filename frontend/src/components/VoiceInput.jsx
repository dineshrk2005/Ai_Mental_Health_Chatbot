import React, { useState, useRef } from 'react';

const VoiceInput = ({ onTranscriptionAndAnalysis }) => {
  const [isRecording, setIsRecording] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [analysisStatus, setAnalysisStatus] = useState('');
  const [emotionFeatures, setEmotionFeatures] = useState(null);

  const mediaRecorderRef = useRef(null);
  const audioChunksRef = useRef([]);
  const recognitionRef = useRef(null);

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      mediaRecorderRef.current = new MediaRecorder(stream);
      audioChunksRef.current = [];

      mediaRecorderRef.current.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data);
        }
      };

      mediaRecorderRef.current.onstop = async () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/webm' });
        await sendAudioToBackend(audioBlob);
        
        // Stop all tracks to release microphone
        stream.getTracks().forEach(track => track.stop());
      };

      // Initialize SpeechRecognition
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      if (SpeechRecognition) {
        recognitionRef.current = new SpeechRecognition();
        recognitionRef.current.continuous = true;
        recognitionRef.current.interimResults = true;
        
        recognitionRef.current.onresult = (event) => {
          let currentTranscript = '';
          for (let i = event.resultIndex; i < event.results.length; i++) {
            currentTranscript += event.results[i][0].transcript;
          }
          setTranscript(currentTranscript);
        };

        recognitionRef.current.start();
      } else {
        console.warn('Speech Recognition API is not supported in this browser.');
      }

      mediaRecorderRef.current.start();
      setIsRecording(true);
      setTranscript('');
      setEmotionFeatures(null);
      setAnalysisStatus('Recording...');

    } catch (error) {
      console.error('Error accessing microphone:', error);
      setAnalysisStatus('Error accessing microphone.');
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
      setIsRecording(false);
      setAnalysisStatus('Processing audio...');
    }
  };

  const sendAudioToBackend = async (audioBlob) => {
    const formData = new FormData();
    // Assuming backend expects 'audio' field
    formData.append('audio', audioBlob, 'recording.webm');

    try {
      // Send to python service
      const voiceApiUrl = import.meta.env.VITE_VOICE_API_URL || 'http://localhost:5001/api/analyze-voice';
      const response = await fetch(voiceApiUrl, {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error('Network response was not ok');
      }

      const data = await response.json();
      if (data.status === 'success') {
        setEmotionFeatures(data.features);
        setAnalysisStatus('Analysis complete.');
        
        // Optional callback to parent component
        if (onTranscriptionAndAnalysis) {
          onTranscriptionAndAnalysis({
            transcript,
            features: data.features
          });
        }
      } else {
        throw new Error(data.error || 'Failed to analyze voice');
      }
    } catch (error) {
      console.error('Error sending audio to backend:', error);
      setAnalysisStatus('Error analyzing audio.');
    }
  };

  return (
    <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex flex-col items-center">
      <h3 className="text-xl font-bold text-gray-800 mb-4">Voice Capture & Tone Detection</h3>
      
      <div className="flex flex-col items-center mb-6">
        <button
          onClick={isRecording ? stopRecording : startRecording}
          className={`flex items-center justify-center w-16 h-16 rounded-full text-white transition-all duration-300 shadow-md ${
            isRecording 
              ? 'bg-red-500 hover:bg-red-600 animate-pulse' 
              : 'bg-indigo-600 hover:bg-indigo-700 hover:scale-105'
          }`}
        >
          {isRecording ? (
            <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M3 5a2 2 0 012-2h10a2 2 0 012 2v10a2 2 0 01-2 2H5a2 2 0 01-2-2V5zm3 2a1 1 0 00-1 1v4a1 1 0 001 1h8a1 1 0 001-1V8a1 1 0 00-1-1H6z" clipRule="evenodd" />
            </svg>
          ) : (
            <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
            </svg>
          )}
        </button>
        <span className="mt-3 text-sm font-medium text-gray-500">
          {isRecording ? 'Recording Active...' : 'Click to start recording'}
        </span>
      </div>

      <div className="w-full space-y-4">
        {transcript && (
          <div className="bg-gray-50 p-4 rounded-xl">
            <h4 className="text-sm font-semibold text-gray-700 mb-2">Transcript:</h4>
            <p className="text-gray-600 italic">"{transcript}"</p>
          </div>
        )}

        <div className="flex justify-between items-center text-sm">
          <span className="text-gray-500">Status:</span>
          <span className={`font-medium ${isRecording ? 'text-indigo-600' : 'text-gray-700'}`}>
            {analysisStatus || 'Idle'}
          </span>
        </div>

        {emotionFeatures && (
          <div className="bg-indigo-50 p-4 rounded-xl border border-indigo-100">
            <h4 className="text-sm font-semibold text-indigo-900 mb-3">Tone Detection Features:</h4>
            <div className="grid grid-cols-3 gap-2">
              <div className="bg-white p-2 rounded-lg text-center shadow-sm">
                <p className="text-xs text-gray-500 mb-1">Energy (RMS)</p>
                <p className="font-semibold text-indigo-700">
                  {emotionFeatures.energy_mean ? emotionFeatures.energy_mean.toFixed(4) : 'N/A'}
                </p>
              </div>
              <div className="bg-white p-2 rounded-lg text-center shadow-sm">
                <p className="text-xs text-gray-500 mb-1">Pitch (Hz)</p>
                <p className="font-semibold text-indigo-700">
                  {emotionFeatures.pitch_mean ? emotionFeatures.pitch_mean.toFixed(2) : '0.00'}
                </p>
              </div>
              <div className="bg-white p-2 rounded-lg text-center shadow-sm">
                <p className="text-xs text-gray-500 mb-1">MFCC Mean</p>
                <p className="font-semibold text-indigo-700">
                  {emotionFeatures.mfcc_mean && emotionFeatures.mfcc_mean.length > 0 
                    ? emotionFeatures.mfcc_mean[0].toFixed(2) 
                    : 'N/A'}
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default VoiceInput;
