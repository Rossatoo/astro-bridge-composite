export interface MenuComponent {
  getName(): string;
  print(indent?: string): string;
  isLeaf(): boolean;
}
