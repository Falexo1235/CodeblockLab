import type { PlacedBlockType, VariableData } from "../types";

export class Interpreter {
  private variables: Map<string, number> = new Map()
  private errors: { blockId: string; message: string }[] = []

  constructor() {
    this.reset()
  }

  reset() {
    this.variables.clear()
    this.errors = []
  }

  getVariables(): VariableData[] {
    return Array.from(this.variables.entries()).map(([name, value]) => ({ name, value }))
  }

  getErrors() {
    return this.errors
  }

  execute(blocks: PlacedBlockType[]): {
    success: boolean
    variables: VariableData[]
    errors: { blockId: string; message: string }[]
  } {
    this.reset()

    const sortedBlocks = [...blocks].sort((a, b) => a.y - b.y)

    for (const block of sortedBlocks) {
      try {
        this.executeBlock(block)
      } catch (error) {
        this.errors.push({ blockId: block.instanceId, message: error.message })
      }
    }

    return {
      success: this.errors.length === 0,
      variables: this.getVariables(),
      errors: this.errors,
    }
  }

  private executeBlock(block: PlacedBlockType) {
    switch (block.type) {
      case "variable":
        this.executeVariableBlock(block)
        break
      case "assignment":
        this.executeAssignmentBlock(block)
        break
      case "arithmetic":
        this.executeArithmeticBlock(block)
        break
      case "if":
        this.executeIfBlock(block)
        break
      default:
        throw new Error(`Неизвестный тип блока: ${block.type}`)
    }
  }

  private executeVariableBlock(block: PlacedBlockType) {
    const variableName = block.data?.variableName

    if (!variableName) {
      throw new Error("Имя переменной не указано")
    }

    if (this.variables.has(variableName)) {
      throw new Error(`Переменная '${variableName}' уже существует`)
    }

    this.variables.set(variableName, 0)
  }

  private executeAssignmentBlock(block: PlacedBlockType) {
    const variableName = block.data?.variableName
    const value = block.data?.value

    if (!variableName) {
      throw new Error("Имя переменной не указано")
    }

    if (!this.variables.has(variableName)) {
      throw new Error(`Переменная '${variableName}' не существует`)
    }

    if (value === undefined || value === "") {
      throw new Error("Значение не указано")
    }

    const numericValue = this.evaluateExpression(value)
    this.variables.set(variableName, numericValue)
  }

  private executeArithmeticBlock(block: PlacedBlockType) {
    return
  }

  private executeIfBlock(block: PlacedBlockType) {
    const condition = block.data?.condition

    if (!condition) {
      throw new Error("Условие не указано")
    }

    const parts = condition.split(" ")
    if (parts.length !== 3) {
      throw new Error("Неверный формат условия")
    }

    const leftValue = this.evaluateExpression(parts[0])
    const operator = parts[1]
    const rightValue = this.evaluateExpression(parts[2])

    let result = false

    switch (operator) {
      case "<":
        result = leftValue < rightValue
        break
      case ">":
        result = leftValue > rightValue
        break
      case "==":
        result = leftValue === rightValue
        break
      case "!=":
        result = leftValue !== rightValue
        break
      case "<=":
        result = leftValue <= rightValue
        break
      case ">=":
        result = leftValue >= rightValue
        break
      default:
        throw new Error(`Неизвестный оператор: ${operator}`)
    }
  }

  private evaluateExpression(expression: string): number {
    if (this.variables.has(expression)) {
      return this.variables.get(expression)!
    }
    const numericValue = Number(expression)
    if (!isNaN(numericValue)) {
      return numericValue
    }
    throw new Error(`Неверное выражение: ${expression}`)
  }
}
