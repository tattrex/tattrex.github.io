/** No microphone capture until start() is called by a user gesture. */
export function createSpeech({onTranscript,onStatus,onError,scope=window}){
 const Constructor=scope.SpeechRecognition||scope.webkitSpeechRecognition;let recognition=null,active=false;
 function stop(){if(recognition){recognition.abort();recognition=null;}active=false;onStatus('idle');}
 function start(){
  if(active){stop();return;}if(!Constructor){onError('Speech input is unavailable in this browser. Type a command or use a suggestion.');return;}
  const current=new Constructor();recognition=current;current.lang='en-US';current.continuous=false;current.interimResults=true;let delivered=false;
  current.onstart=()=>{if(recognition===current){active=true;onStatus('listening');}};
  current.onresult=event=>{if(recognition!==current)return;let interim='';for(let i=event.resultIndex;i<event.results.length;i++){const r=event.results[i];if(r.isFinal&&!delivered){delivered=true;onTranscript(r[0].transcript);}else interim+=r[0].transcript;}if(interim)onStatus('listening',interim);};
  current.onerror=event=>{if(recognition!==current)return;const messages={'not-allowed':'Microphone access was not granted. You can still type or tap a command.','audio-capture':'No microphone is available. Type or tap a command instead.','network':'Speech recognition could not connect. Try typing the same command.','no-speech':'No speech was heard. Try again or type a command.'};onError(messages[event.error]||'Speech stopped. Try again or use a typed command.');};
  current.onend=()=>{if(recognition===current){active=false;recognition=null;onStatus('idle');}};
  try{active=true;onStatus('connecting');current.start();}catch{stop();onError('Speech could not start. Use a typed command instead.');}
 }
 return {supported:!!Constructor,start,stop,get active(){return active;}};
}
export function speakResponse(text,enabled){if(!enabled||!('speechSynthesis'in window))return;window.speechSynthesis.cancel();const utterance=new SpeechSynthesisUtterance(text);utterance.rate=1.02;utterance.lang='en-US';window.speechSynthesis.speak(utterance);}
