import os
import numpy as np
import librosa
from flask import Flask, request, jsonify
from flask_cors import CORS

app = Flask(__name__)
CORS(app)

@app.route('/api/analyze-voice', methods=['POST'])
def analyze_voice():
    if 'audio' not in request.files:
        return jsonify({'error': 'No audio file provided'}), 400
        
    audio_file = request.files['audio']
    if audio_file.filename == '':
        return jsonify({'error': 'No audio file selected'}), 400

    try:
        # Save temporarily
        temp_path = os.path.join('/tmp' if os.name != 'nt' else os.getenv('TEMP', 'C:\\temp'), 'temp_audio_file')
        audio_file.save(temp_path)
        
        # Load audio with librosa
        y, sr = librosa.load(temp_path, sr=None)
        
        # 1. Extract MFCC
        mfccs = librosa.feature.mfcc(y=y, sr=sr, n_mfcc=13)
        mfccs_mean = np.mean(mfccs.T, axis=0).tolist()
        
        # 2. Extract Pitch (Fundamental frequency)
        pitches, magnitudes = librosa.piptrack(y=y, sr=sr)
        pitch_mean = float(np.mean(pitches[pitches > 0])) if np.any(pitches > 0) else 0.0
        
        # 3. Extract Energy (RMS)
        rms = librosa.feature.rms(y=y)
        energy_mean = float(np.mean(rms))
        
        # Clean up
        try:
            os.remove(temp_path)
        except Exception:
            pass

        return jsonify({
            'status': 'success',
            'features': {
                'mfcc_mean': mfccs_mean,
                'pitch_mean': pitch_mean,
                'energy_mean': energy_mean
            }
        })

    except Exception as e:
        return jsonify({'error': str(e)}), 500

if __name__ == '__main__':
    app.run(debug=True, port=5001)
