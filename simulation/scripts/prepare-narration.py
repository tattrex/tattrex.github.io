"""Render review narration locally, then measure its actual spectrum (40 fps).
Requires macOS say, ffmpeg and numpy. No network or microphone recording.
"""
import json, subprocess, tempfile, wave
from pathlib import Path
import numpy as np

OUT = Path(__file__).resolve().parents[1] / 'public/audio'
OUT.mkdir(parents=True, exist_ok=True)
COMMANDS = [
    ('Open the most critical patient', 'Open the most critical patient.'),
    ('Change it to brain window', 'Change it to brain window.'),
    ('Highlight acute infarct', 'Highlight acute infarct.'),
    ('Create MIP on 15 mm', 'Create mip on fifteen millimetres.'),
    ('Give me MPR', 'Give me M P R.'),
    ('Pull up priors', 'Pull up priors.'),
    ('Compare the ventricular region across time', 'Compare the ventricular region across time.'),
    ('Draft the report', 'Draft the report.')
]
tracks = []
with tempfile.TemporaryDirectory(prefix='tattrex-voice-') as temp:
    for index, (text, spoken) in enumerate(COMMANDS):
        aiff, wav = Path(temp) / 'voice.aiff', Path(temp) / 'voice.wav'
        subprocess.run(['say', '-v', 'Samantha (English (US))', '-r', '185', '-o', str(aiff), spoken], check=True)
        subprocess.run(['ffmpeg', '-v', 'error', '-y', '-i', str(aiff), '-af',
                        'silenceremove=start_periods=1:start_threshold=-48dB:start_silence=0.08,areverse,silenceremove=start_periods=1:start_threshold=-48dB:start_silence=0.18,areverse',
                        '-ar', '24000', '-ac', '1', str(wav)], check=True)
        with wave.open(str(wav)) as f:
            rate = f.getframerate()
            samples = np.frombuffer(f.readframes(f.getnframes()), dtype='<i2').astype(float) / 32768
        name = f'command-{index+1:02}.mp3'
        subprocess.run(['ffmpeg', '-v', 'error', '-y', '-i', str(wav), '-codec:a', 'libmp3lame', '-b:a', '96k', str(OUT/name)], check=True)
        fps, size = 40, 2048
        freqs = np.fft.rfftfreq(size, 1/rate)
        edges = np.geomspace(80, 7500, 55)
        frames = []
        for t in np.arange(0, len(samples)/rate, 1/fps):
            start = int(t*rate)-size//2
            segment = samples[max(0,start):max(0,start)+size]
            segment = np.pad(segment, (max(0,-start), 0))[:size]
            segment = np.pad(segment, (0,size-len(segment)))
            spectrum = np.abs(np.fft.rfft(segment*np.hanning(size)))
            bands = [np.max(spectrum[(freqs>=a)&(freqs<b)], initial=0) for a,b in zip(edges[:-1],edges[1:])]
            frames.append(bands)
        matrix = np.array(frames)
        # Log compression preserves syllabic dynamics and silent gaps without a looping motif.
        matrix = np.log1p(matrix*1.6)
        matrix = np.clip(matrix / max(np.percentile(matrix,98.5),.01), 0, 1)
        tracks.append({'text':text,'src':f'public/audio/{name}','duration':round(len(samples)/rate*1000),
                       'fps':fps,'frames':np.rint(matrix*255).astype(int).tolist()})
        print(f'{name}: {tracks[-1]["duration"]} ms')
(OUT/'narration.json').write_text(json.dumps({'source':'Locally synthesized Samantha narration; measured FFT bands, 80–7500 Hz. Word highlighting is estimated from text, not forced aligned.','tracks':tracks},separators=(',',':')))
