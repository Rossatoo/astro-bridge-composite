import type { Device } from './Device';
export class Radio implements Device {
  private on=false; private volume=20; private channel=88;
  constructor(private name:string='Rádio'){} getName(){return this.name;}
  isEnabled(){return this.on;} enable(){this.on=true;} disable(){this.on=false;}
  getVolume(){return this.volume;} setVolume(v:number){this.volume=Math.max(0,Math.min(100,v));}
  getChannel(){return this.channel;} setChannel(c:number){this.channel=Math.max(80,c|0);}
}
