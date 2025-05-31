export type BlockType = {
  id: string;
  category: 'Переменные' | 'Управление' | 'Операторы' | 'Мои блоки' | 'Массивы';
  title: string;
  description: string;
  color: string;
  type?:
    | 'variable'
    | 'assignment'
    | 'arithmetic'
    | 'if'
    | 'while'
    | 'start'
    | 'end'
    | 'for'
    | 'output'
    | 'functionStart'
    | 'functionCall'
    | 'functionEnd'
    | 'arrayDeclaration'
    | 'arrayAssignment'
    | 'arrayElement';
}

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
    indexInputId?: string | null
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
    functionName?: string
    arrayName?: string
    arraySize?: string
    arrayIndex?: string
  }
}

export type VariableData = {
  name: string
  value: number
}

export type ArrayData = {
  name: string
  size: number
  elements: number[]
}

export type FunctionData = {
  name: string
  startBlockId: string
  endBlockId: string
}

export type ConnectionPoint = {
  type: 'top' | 'bottom' | 'true' | 'false' | 'output' | 'valueInput' | 'leftInput' | 'rightInput' | 'indexInput'
  x: number
  y: number
  width: number
  height: number
  blockId: string
  inputField?: 'value' | 'left' | 'right' | 'index'
}

export type ExpressionResult = {
  value: number
  error?: string
}

const Types = {
  BlockType: {} as BlockType,
  PlacedBlockType: {} as PlacedBlockType,
  VariableData: {} as VariableData,
  ArrayData: {} as ArrayData,
  ConnectionPoint: {} as ConnectionPoint,
  ExpressionResult: {} as ExpressionResult,
  FunctionData: {} as FunctionData,
};

export default Types;