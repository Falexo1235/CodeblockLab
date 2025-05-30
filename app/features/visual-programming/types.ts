export type BlockType = {
  id: string;
  category: 'Переменные' | 'Управление' | 'Операторы' | 'Мои блоки';
  title: string;
  description: string;
  color: string;
  type?: 'variable' | 'assignment' | 'arithmetic' | 'if' | 'while' | 'start' | 'end' | 'for' | 'output';
};

export type PlacedBlockType = BlockType & {
  instanceId: string
  x: number
  y: number
  nextBlockId?: string | null
  trueBlockId?: string | null
  falseBlockId?: string | null
  previousBlockId?: string | null

  inputConnections?: {
    valueInputId?: string | null
    leftInputId?: string | null
    rightInputId?: string | null
  }
  data?: {
    variableName?: string
    value?: string
    leftValue?: string
    rightValue?: string
    operation?: string
    condition?: string
    operator?: string
    expression?: string
    initialization?: string
    iteration?: string
  }
}

export type VariableData = {
  name: string
  value: number
}

export type ConnectionPoint = {
  type: 'top' | 'bottom' | 'true' | 'false' | 'output' | 'valueInput' | 'leftInput' | 'rightInput'
  x: number
  y: number
  width: number
  height: number
  blockId: string
  inputField?: 'value' | 'left' | 'right'
}

export type ExpressionResult = {
  value: number
  error?: string
}

const Types = {
  BlockType: {} as BlockType,
  PlacedBlockType: {} as PlacedBlockType,
  VariableData: {} as VariableData,
  ConnectionPoint: {} as ConnectionPoint,
  ExpressionResult: {} as ExpressionResult,
};

export default Types;