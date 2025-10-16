import type { MenuComponent } from './MenuComponent';
export class MenuGroup implements MenuComponent {
  private children: MenuComponent[] = [];
  constructor(private name: string) {}
  add(c: MenuComponent){ this.children.push(c); return this; }
  remove(c: MenuComponent){ this.children = this.children.filter(x => x !== c); }
  getChildren(){ return this.children; }
  getName(){ return this.name; }
  isLeaf(){ return false; }
  print(indent: string = ''): string {
    const lines: string[] = [`${indent}+ ${this.name}/`];
    for(const c of this.children) lines.push(c.print(indent + '  '));
    return lines.join('\n');
  }
}
