import type { ExpressionResult, PlacedBlockType, VariableData } from "../types";

export class Interpreter {
  private variables: Map<string, number> = new Map()
  private errors: { blockId: string; message: string }[] = []
  private blocks: PlacedBlockType[] = []
  private maxIterations = 1000 

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
    this.blocks = blocks

    const startBlock = blocks.find((block) => block.type === "start")
    if (!startBlock) {
      this.errors.push({ blockId: "", message: "Блок 'Старт' не найден" })
      return {
        success: false,
        variables: this.getVariables(),
        errors: this.errors,
      }
    }

    try {

      this.executeBlockChain(startBlock)
    } catch (error) {
      this.errors.push({ blockId: "", message: error.message })
    }

    return {
      success: this.errors.length === 0,
      variables: this.getVariables(),
      errors: this.errors,
    }
  }

  private executeBlockChain(currentBlock: PlacedBlockType, iterationCount = 0) {

    if (iterationCount > this.maxIterations) {
      this.errors.push({
        blockId: currentBlock.instanceId,
        message: `Превышено максимальное количество итераций (${this.maxIterations}). Возможно, бесконечный цикл.`,
      })
      return
    }

    if (currentBlock.type !== "start") {
      try {
        this.executeBlock(currentBlock)
      } catch (error) {

        return
      }
    }

    if (currentBlock.type === "end") {
      return
    }

    if (currentBlock.type === "if") {
      let condition: boolean
      try {
        condition = this.evaluateCondition(currentBlock)
      } catch (error) {

        this.errors.push({ blockId: currentBlock.instanceId, message: error.message })
        return
      }

      if (condition) {

        if (currentBlock.trueBlockId) {
          const nextBlock = this.blocks.find((block) => block.instanceId === currentBlock.trueBlockId)
          if (nextBlock) {
            this.executeBlockChain(nextBlock, iterationCount)
          }
        }
      } else {

        if (currentBlock.falseBlockId) {
          const nextBlock = this.blocks.find((block) => block.instanceId === currentBlock.falseBlockId)
          if (nextBlock) {
            this.executeBlockChain(nextBlock, iterationCount)
          }
        }
      }
    }

    else if (currentBlock.type === "while") {
      let condition: boolean
      try {
        condition = this.evaluateCondition(currentBlock)
      } catch (error) {

        this.errors.push({ blockId: currentBlock.instanceId, message: error.message })
        return
      }

      if (condition) {

        if (currentBlock.trueBlockId) {
          const bodyBlock = this.blocks.find((block) => block.instanceId === currentBlock.trueBlockId)
          if (bodyBlock) {

            this.executeBlockChain(bodyBlock, iterationCount + 1)

            this.executeBlockChain(currentBlock, iterationCount + 1)
          }
        }
      } else {

        if (currentBlock.falseBlockId) {
          const nextBlock = this.blocks.find((block) => block.instanceId === currentBlock.falseBlockId)
          if (nextBlock) {
            this.executeBlockChain(nextBlock, iterationCount)
          }
        }
      }
    }

    else if (currentBlock.nextBlockId) {
      const nextBlock = this.blocks.find((block) => block.instanceId === currentBlock.nextBlockId)
      if (nextBlock) {
        this.executeBlockChain(nextBlock, iterationCount)
      }
    }
  }

  private evaluateCondition(block: PlacedBlockType): boolean {
    const operator = block.data?.operator || "=="
    let leftValue: number
    let rightValue: number

    if (block.inputConnections?.leftInputId) {
      const arithmeticBlock = this.blocks.find((b) => b.instanceId === block.inputConnections?.leftInputId)
      if (!arithmeticBlock || arithmeticBlock.type !== "arithmetic") {
        throw new Error("Неверное соединение с арифметическим блоком для левого значения")
      }
      const result = this.evaluateArithmeticExpression(arithmeticBlock)
      if (result.error) {
        throw new Error(`Ошибка в арифметическом выражении: ${result.error}`)
      }
      leftValue = result.value
    } else {

      const leftExpr = block.data?.condition?.split(" ")[0] || ""
      leftValue = this.evaluateSimpleExpression(leftExpr)
    }

    if (block.inputConnections?.rightInputId) {
      const arithmeticBlock = this.blocks.find((b) => b.instanceId === block.inputConnections?.rightInputId)
      if (!arithmeticBlock || arithmeticBlock.type !== "arithmetic") {
        throw new Error("Неверное соединение с арифметическим блоком для правого значения")
      }
      const result = this.evaluateArithmeticExpression(arithmeticBlock)
      if (result.error) {
        throw new Error(`Ошибка в арифметическом выражении: ${result.error}`)
      }
      rightValue = result.value
    } else {

      const rightExpr = block.data?.condition?.split(" ")[2] || ""
      rightValue = this.evaluateSimpleExpression(rightExpr)
    }

    switch (operator) {
      case "<":
        return leftValue < rightValue
      case ">":
        return leftValue > rightValue
      case "==":
        return leftValue === rightValue
      case "!=":
        return leftValue !== rightValue
      case "<=":
        return leftValue <= rightValue
      case ">=":
        return leftValue >= rightValue
      default:
        throw new Error(`Неизвестный оператор: ${operator}`)
    }
  }

  private executeBlock(block: PlacedBlockType) {
    try {
      switch (block.type) {
        case "variable":
          this.executeVariableBlock(block)
          break
        case "assignment":
          this.executeAssignmentBlock(block)
          break
        case "arithmetic":

          break
        case "if":
        case "while":

          break
        case "start":
        case "end":

          break
        default:
          throw new Error(`Неизвестный тип блока: ${block.type}`)
      }
    } catch (error) {

      this.errors.push({ blockId: block.instanceId, message: error.message })
      throw error 
    }
  }

  private executeVariableBlock(block: PlacedBlockType) {
    const variableNameInput = block.data?.variableName || ""

    if (!variableNameInput.trim()) {
      throw new Error("Имя переменной не указано")
    }

    const variableNames = variableNameInput
      .split(",")
      .map((name) => name.trim())
      .filter((name) => name)

    if (variableNames.length === 0) {
      throw new Error("Имя переменной не указано")
    }

    for (const name of variableNames) {
      if (!name) {
        throw new Error("Имя переменной не может быть пустым")
      }

      if (this.variables.has(name)) {
        throw new Error(`Переменная '${name}' уже существует`)
      }

      this.variables.set(name, 0)
    }
  }

  private executeAssignmentBlock(block: PlacedBlockType) {
    const variableName = block.data?.variableName

    if (!variableName) {
      throw new Error("Имя переменной не указано")
    }

    if (!this.variables.has(variableName)) {
      throw new Error(`Переменная '${variableName}' не существует`)
    }

    let value: number

    if (block.inputConnections?.valueInputId) {
      const arithmeticBlock = this.blocks.find((b) => b.instanceId === block.inputConnections?.valueInputId)
      if (!arithmeticBlock || arithmeticBlock.type !== "arithmetic") {
        throw new Error("Неверное соединение с арифметическим блоком")
      }
      const result = this.evaluateArithmeticExpression(arithmeticBlock)
      if (result.error) {
        throw new Error(`Ошибка в арифметическом выражении: ${result.error}`)
      }
      value = result.value
    } else {

      if (block.data?.value === undefined || block.data?.value === "") {
        throw new Error("Значение не указано")
      }
      value = this.evaluateSimpleExpression(block.data.value)
    }

    this.variables.set(variableName, value)
  }

  private evaluateSimpleExpression(expression: string): number {
    if (this.variables.has(expression)) {
      return this.variables.get(expression)!
    }
    const numericValue = Number(expression)
    if (!isNaN(numericValue)) {
      return numericValue
    }
    throw new Error(`Неверное выражение: ${expression}`)
  }

  private evaluateArithmeticExpression(block: PlacedBlockType): ExpressionResult {
    const expression = block.data?.expression

    if (!expression) {
      return { value: 0, error: "Выражение не указано" }
    }

    try {

      let processedExpression = expression
      for (const [name, value] of this.variables.entries()) {
        const regex = new RegExp(`\\b${name}\\b`, "g")
        processedExpression = processedExpression.replace(regex, value.toString())
      }

      if (!/^[\d\s+\-*/$$$$.%^()]+$/.test(processedExpression)) {

        this.errors.push({
          blockId: block.instanceId,
          message: "Выражение содержит недопустимые символы",
        })
        return { value: 0, error: "Выражение содержит недопустимые символы" }
      }

      processedExpression = processedExpression.replace(/\^/g, "**")

      const result = eval(processedExpression)

      if (typeof result !== "number" || isNaN(result) || !isFinite(result)) {

        this.errors.push({
          blockId: block.instanceId,
          message: "Результат не является числом",
        })
        return { value: 0, error: "Результат не является числом" }
      }

      return { value: result }
    } catch (error) {

      this.errors.push({
        blockId: block.instanceId,
        message: `Ошибка вычисления: ${error.message}`,
      })
      return { value: 0, error: `Ошибка вычисления: ${error.message}` }
    }
  }
}