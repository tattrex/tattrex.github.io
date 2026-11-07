export const PRESETS={brain:{width:80,level:40,label:'Brain'},bone:{width:2000,level:500,label:'Bone'},soft:{width:400,level:50,label:'Soft tissue'}};
export const initialState=()=>({open:false,priority:false,window:'soft',mode:'axial',slabMm:0,priors:false,compare:false,overlay:false,maskMode:'core',overlayReviewed:false,report:false,reportDraft:null,point:[70,137,65],zoom:1});
export function parseCommand(input){
 const original=String(input??'').trim();let s=original.toLowerCase().replace(/[’']/g,"'").replace(/\bm\s+i\s+p\b/g,'mip').replace(/\bm\s+p\s+r\b/g,'mpr').replace(/\s+/g,' ');
 if(!s)return {type:'unknown'};
 if(/\b(do not|don't|never|cancel)\b/.test(s))return {type:'unknown',reason:'No action taken. Use a direct command or choose a sequence moment.'};
 const dictated=original.match(/^(?:add to findings|dictate|append to findings)\s*:?\s*(.+)$/i);if(dictated)return {type:'dictate',text:dictated[1]};
 if(/\b(reset|start over|restart)\b/.test(s))return {type:'reset'};
 if(/\b(critical|urgent|highest priority|priority case)\b/.test(s))return {type:'open',priority:true};
 if(/\b(hide|clear|remove)\b.*\b(overlay|mask|infarct|highlight|penumbra)\b/.test(s))return {type:'overlay',show:false};
 if(/\bpenumbra\b/.test(s)&&/\b(highlight|show|find|segment|outline)\b/.test(s))return {type:'overlay',show:true,mode:'both'};
 if(/\b(infarct|core|ischemi[ac]|ischaemi[ac])\b/.test(s)&&/\b(highlight|show|find|segment|outline)\b/.test(s))return {type:'overlay',show:true};
 if(/\b(ventricular|ventricles|across time)\b/.test(s))return {type:'compare'};
 if(/\b(prior|priors|previous exam|previous study)\b/.test(s))return {type:'priors'};
 if(/\bopen\b.*\b(patient|case|study|that)\b/.test(s))return {type:'open',priority:false};
 for(const preset of ['brain','bone','soft'])if(new RegExp('\\b'+preset+'\\b').test(s))return {type:'window',preset};
 if(/\b(mip|maximum intensity projection)\b/.test(s)){
  for(const [word,value] of Object.entries({five:5,ten:10,fifteen:15,twenty:20,thirty:30,fifty:50}))s=s.replace(new RegExp('\\b'+word+'\\b','g'),String(value));
  const match=s.match(/(-?\d+(?:\.\d+)?)\s*(cm|centimeters?|centimetres?|mm|millimeters?|millimetres?)?/);const mm=match?Number(match[1])*(match[2]?.startsWith('c')?10:1):15;
  return Number.isFinite(mm)&&mm>=1&&mm<=50?{type:'mip',mm}:{type:'unknown',reason:'Choose a slab between 1 and 50 mm.'};
 }
 if(/\b(mpr|multiplanar|multi planar)\b/.test(s))return {type:'mpr'};
 if(/\b(draft|prepare|create|generate|show|open)\b.*\breport\b/.test(s))return {type:'report'};
 for(const axis of ['axial','coronal','sagittal'])if(s.includes(axis))return {type:'plane',axis};
 if(/\bnext\b.*\bslice\b/.test(s))return {type:'step',amount:1};
 if(/\b(previous|back)\b.*\bslice\b/.test(s))return {type:'step',amount:-1};
 const slice=s.match(/\bslice\s+(\d+)\b/);if(slice)return {type:'slice',index:Number(slice[1])-1};
 if(/\bzoom\s+in\b/.test(s))return {type:'zoom',factor:1.25};if(/\bzoom\s+out\b/.test(s))return {type:'zoom',factor:.8};
 if(/\b(worklist|queue)\b/.test(s))return {type:'worklist'};
 return {type:'unknown'};
}
export function reduceCommand(state,command,meta){
 const unchanged=message=>({state,message});
 if(command.type==='unknown')return unchanged(command.reason||'Try a suggested command, such as “brain window” or “give me MPR”.');
 if(command.type==='reset')return {state:initialState(),message:'Demo reset. Open the priority case to begin.'};
 if(command.type==='worklist')return {state:{...state,open:false,report:false},message:'Back to the demonstration worklist.'};
 if(command.type==='open')return {state:{...state,open:true,priority:state.priority||command.priority,point:state.open?state.point:[...meta.initialPoint]},message:'Demo patient 01 is open. CT head is ready for review.',notification:command.priority?'Demo AI marked Demo patient 01 as the highest priority case. This is a staged priority notification.':undefined};
 if(!state.open)return unchanged('Open the demo patient first, then ask for the next instruction.');
 const next={...state,point:[...state.point]};let message='';const normal=state.mode==='coronal'?1:state.mode==='sagittal'?0:2;
 switch(command.type){
  case 'window':if(!PRESETS[command.preset])return unchanged('Unknown window preset.');next.window=command.preset;message=`${PRESETS[command.preset].label} window applied: width ${PRESETS[command.preset].width}, level ${PRESETS[command.preset].level}.`;break;
  case 'mip':next.mode='axial';next.slabMm=command.mm;message=`Axial maximum intensity projection over a ${command.mm} mm slab. Say “next slice” to move the slab.`;break;
  case 'mpr':next.mode='mpr';next.slabMm=0;message='Axial, coronal and sagittal reconstructions share the same spatial location.';break;
  case 'plane':next.mode=command.axis;next.slabMm=0;message=`${command.axis[0].toUpperCase()+command.axis.slice(1)} plane selected.`;break;
  case 'priors':next.priors=true;next.compare=false;next.slabMm=0;message='An illustrative prior is shown beside the source CT. It is derived for the workflow demonstration, not a real earlier examination.';break;
  case 'compare':next.priors=true;next.compare=true;next.mode='axial';next.slabMm=0;next.window='brain';next.point=[...meta.ventricularPoint];next.zoom=1.7;message='Linked ventricular region. The source CT is real; the companion is an explicitly derived illustration, not a measured interval change.';break;
  case 'overlay':next.overlay=command.show;next.maskMode=command.mode||'core';if(command.show){next.overlayReviewed=true;next.window='brain';next.point=[...meta.lesionPoint];next.zoom=1.15;}message=command.show?(next.maskMode==='both'?'Published reference masks shown: ischaemic core in coral, penumbra in gold. These are expert dataset annotations, not live AI predictions.':'Published ischaemic-core reference mask shown on the real CT. The annotation follows the source volume in every plane.'):'Reference overlay hidden. The underlying source CT is unchanged.';break;
  case 'slice':next.point[normal]=Math.max(0,Math.min(meta.dims[normal]-1,command.index));message=`Slice ${next.point[normal]+1} of ${meta.dims[normal]}.`;break;
  case 'step':next.point[normal]=Math.max(0,Math.min(meta.dims[normal]-1,next.point[normal]+command.amount));message=`Slice ${next.point[normal]+1}.`;break;
  case 'zoom':next.zoom=Math.max(.75,Math.min(3,next.zoom*command.factor));message=`Zoom ${Math.round(next.zoom*100)}%.`;break;
  case 'report':next.report=true;next.reportDraft=state.reportDraft||{findings:state.overlayReviewed?'The highlighted region corresponds to the published ischaemic-core annotation in this CPAISD case.':'Review the study and add your findings here.',impression:state.overlayReviewed?'Reference stroke annotation reviewed in the demonstration. Clinical interpretation requires radiologist review.':'Impression pending radiologist review.'};if(state.compare&&!next.reportDraft.findings.includes('ventricular'))next.reportDraft={...next.reportDraft,findings:next.reportDraft.findings+' The comparison uses a derived illustrative prior; no real interval change is reported.'};message='A demonstration report draft is ready from the staged findings. Its wording still needs radiologist review.';break;
  case 'dictate':next.report=true;next.reportDraft={findings:(state.reportDraft?.findings?state.reportDraft.findings+'\n':'')+command.text,impression:state.reportDraft?.impression||''};message='Added your words to the draft findings.';break;
  default:return unchanged('That action is not available in this demo.');
 }
 return {state:next,message};
}
