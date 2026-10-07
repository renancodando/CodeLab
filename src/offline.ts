export type OfflineStatus='preparing'|'ready'|'unavailable'|'update';
export let offlineStatus:OfflineStatus='preparing';
const set=(status:OfflineStatus)=>{offlineStatus=status;window.dispatchEvent(new Event('offlinestatus'));};
export async function enableOffline(){
 if(!import.meta.env.PROD||!('serviceWorker' in navigator)){set('unavailable');return;}
 try{
  const registration=await navigator.serviceWorker.register('/sw.js',{scope:'/'});
  if(registration.waiting)set('update');
  const observe=(worker:ServiceWorker|null)=>{if(!worker)return;const changed=()=>{if(worker.state==='installed'&&navigator.serviceWorker.controller)set('update');else if(worker.state==='redundant'&&!registration.active)set('unavailable');};worker.addEventListener('statechange',changed);changed();};
  observe(registration.installing);registration.addEventListener('updatefound',()=>observe(registration.installing));
  await navigator.serviceWorker.ready;if(offlineStatus!=='update')set('ready');
 }catch{set('unavailable');}
}
