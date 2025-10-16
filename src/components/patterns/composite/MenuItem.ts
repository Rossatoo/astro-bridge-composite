import type { MenuComponent } from './MenuComponent';
import type { Device } from '../bridge/Device';
export class MenuItem implements MenuComponent {
  constructor(private name: string, private device: Device) {}
  getName(){ return this.name; }
  getDevice(){ return this.device; }
  isLeaf(){ return true; }
  print(indent: string = ''): string { return `${indent}- ${this.name}`; }
}
