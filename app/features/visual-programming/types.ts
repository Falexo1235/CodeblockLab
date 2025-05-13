export type BlockType = {
  id: string;
  category: 'Переменные' | 'Управление' | 'Операторы' | 'Мои блоки';
  title: string;
  description: string;
  color: string;
  type?: "variable" | "assignment" | "arithmetic" | "if";
};

export type PlacedBlockType = BlockType & {
  instanceId: string;
  x: number;
  y: number;
  data?: {
    variableName?: string;
    value?: string;
    leftValue?: string;
    rightValue?: string;
    operation?: string;
    condition?: string;
    operator?: string;
  };
};

export type VariableData = {
  name: string;
  value: number;
};
