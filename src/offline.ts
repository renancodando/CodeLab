export type OfflineStatus='preparing'|'ready'|'unavailable'|'update';
export let offlineStatus:OfflineStatus='preparing';
const set=(status:OfflineStatus)=>{offlineStatus=status;window.dispatchEvent(new Event('offlinestatus'));};
export async function enableOffline(){
 if(!import.meta.env.PROD||!('serviceWorker' in navigator)){set('unavailable');return;}
 try{
  const registration=await navigator.serviceWorker.register('/sw.js',{scope:'/'});
  if(registration.waiting)set('update');
  registration.addEventListener('updatefound',()=>{const worker=registration.installing;worker?.addEventListener('statechange',()=>{if(worker.state==='installed'&&navigator.serviceWorker.controller)set('update');});});
  await navigator.serviceWorker.ready;if(offlineStatus!=='update')set('ready');
 }catch{set('unavailable');}
}
