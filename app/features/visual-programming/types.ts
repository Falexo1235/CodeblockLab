export type BlockType = {
  id: string;
  category: 'Переменные' | 'Управление' | 'Операторы' | 'Мои блоки';
  title: string;
  description: string;
  color: string;
};

export type PlacedBlockType = BlockType & {
  instanceId: string;
  x: number;
  y: number;
}; 