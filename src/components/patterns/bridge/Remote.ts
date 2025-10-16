// ABSTRACTION (Bridge): controle de alto nível que fala com qualquer Device
import type { Device } from './Device';

export class Remote {
  constructor(protected device: Device) {}
  setDevice(d: Device) { this.device = d; }

  togglePower() {
    this.device.isEnabled() ? this.device.disable() : this.device.enable();
  }

  
  volumeDown() { this.device.setVolume(this.device.getVolume() - 1); }
  volumeUp()   { this.device.setVolume(this.device.getVolume() + 1); }

  channelDown(){ this.device.setChannel(this.device.getChannel() - 1); }
  channelUp()  { this.device.setChannel(this.device.getChannel() + 1); }

  snapshot(){
    return {
      name: this.device.getName(),
      on: this.device.isEnabled(),
      volume: this.device.getVolume(),
      channel: this.device.getChannel(),
    };
  }
}
