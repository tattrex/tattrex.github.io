// Scripted example grounded in the CPAISD reference annotation, not an AI output.
export const REPORT_DWELL=18000;
export const REPORT_WRITING_TIME=6800;
export const reportSections=[
 ['Clinical information','Acute stroke assessment.'],
 ['Technique','Non-contrast CT with multiplanar reformats.'],
 ['Comparison','No genuine prior examination available.'],
 ['Findings','Right cerebral hemispheric infarction corresponding to the highlighted ischaemic-core reference annotation. Interval change cannot be assessed from the illustrative comparison.'],
 ['Impression','Acute right hemispheric ischaemic infarct.']
];

export function createReportPresenter(root){
 const header=document.createElement('header');header.className='report-header';
 const eyebrow=document.createElement('p');eyebrow.className='report-eyebrow';eyebrow.textContent='Demo patient 01 · Draft report';
 const title=document.createElement('h4');title.textContent='CT brain';
 const subtitle=document.createElement('p');subtitle.className='report-subtitle';subtitle.textContent='Without contrast';header.append(eyebrow,title,subtitle);
 const body=document.createElement('div');body.className='report-body';
 const words=[];let length=0;
 for(const [label,text] of reportSections){
  const section=document.createElement('section');section.className='report-section'+(label==='Impression'?' report-impression':'');
  const heading=document.createElement('h5');heading.textContent=label;const paragraph=document.createElement('p');
  for(const token of text.match(/\S+\s*/g)){
   const span=document.createElement('span');span.className='report-word';span.textContent=token;
   words.push({span,start:length,end:length+token.length});length+=token.length;paragraph.append(span);
  }
  section.append(heading,paragraph);body.append(section);
 }
 const footer=document.createElement('footer');footer.className='report-footer';
 const status=document.createElement('span');status.className='report-status';
 const note=document.createElement('span');note.textContent='Illustrative draft · Radiologist review required';footer.append(status,note);
 root.replaceChildren(header,body,footer);let previous=-1;
 function write(progress){
  const count=Math.floor(Math.max(0,Math.min(1,progress))*length);if(count===previous)return;
  for(const {span,start,end} of words){
   if(previous>=end&&count>=end)continue;
   const fraction=Math.max(0,Math.min(1,(count-start)/(end-start)));
   span.style.opacity=fraction?'1':'0';span.style.clipPath=fraction>0&&fraction<1?`inset(0 ${(1-fraction)*100}% 0 0)`:'';
  }
  previous=count;root.dataset.written=String(count);root.dataset.complete=String(count===length);
  status.textContent=count===length?'Ready for review':'Drafting';
 }
 return {
  reset(){root.hidden=true;previous=-1;write(0);},
  show(){root.hidden=false;},
  write,
  complete(){root.hidden=false;write(1);}
 };
}
