import { Remote } from './Remote';
export class AdvancedRemote extends Remote {
  mute(){ 
    this.device.setVolume(0); 
  }
  
  macroMovieNight(){ 
    if(!this.device.isEnabled()) this.device.enable(); 
    this.device.setVolume(35); 
    this.device.setChannel(12); 
  }
}
