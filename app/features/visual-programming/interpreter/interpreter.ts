import type { ArrayData, ExpressionResult, FunctionData, PlacedBlockType, VariableData } from "../types";

export class Interpreter {
  private scopes: Array<Map<string, number>> = [];
  private arrayScopes: Array<Map<string, ArrayData>> = [];
  private errors: { blockId: string; message: string }[] = [];
  private outputMessages: { blockId: string; message: string }[] = []; 
  private blocks: PlacedBlockType[] = [];
  private maxIterations = 1000;
  private initializedForLoops: Set<string> = new Set();
  private functions: Map<string, FunctionData> = new Map();
  private maxCallStackDepth = 50;
  private callStack: string[] = []

  constructor() {
    this.reset();
  }

  reset() {
    this.scopes = [new Map()];
    this.arrayScopes = [new Map()];
    this.errors = [];
    this.outputMessages = []; 
    this.initializedForLoops.clear();
    this.functions.clear()
    this.callStack = []
  }

  private pushScope() {
    this.scopes.push(new Map());
    this.arrayScopes.push(new Map());
  }

  private popScope() {
    if (this.scopes.length > 1) {
      this.scopes.pop();
      this.arrayScopes.pop();
    } else {
      
      console.warn("Attempted to pop the global scope");
    }
  }

  private getCurrentScope(): Map<string, number> {
    if (this.scopes.length === 0) this.pushScope(); 
    return this.scopes[this.scopes.length - 1];
  }

  private getCurrentArrayScope(): Map<string, ArrayData> {
    if (this.arrayScopes.length === 0) this.pushScope()
    return this.arrayScopes[this.arrayScopes.length - 1]
  }

  private findVariable(name: string): { scopeIndex: number; value: number } | null {
    for (let i = this.scopes.length - 1; i >= 0; i--) {
      if (this.scopes[i].has(name)) {
        return { scopeIndex: i, value: this.scopes[i].get(name)! };
      }
    }
    return null;
  }

  private findArray(name: string): ArrayData | null {
    for (let i = this.arrayScopes.length - 1; i >= 0; i--) {
      if (this.arrayScopes[i].has(name)) {
        return this.arrayScopes[i].get(name)!
      }
    }
    return null
  }

  private declareOrUpdateInCurrentScope(name: string, value: number): void {
    this.getCurrentScope().set(name, value);
  }

  private declareArrayInCurrentScope(name: string, size: number): void {
    const arrayData: ArrayData = {
      name,
      size,
      elements: new Array(size).fill(0),
    }
    this.getCurrentArrayScope().set(name, arrayData)
  }

  private updateVariable(name: string, value: number): void {
    for (let i = this.scopes.length - 1; i >= 0; i--) {
      if (this.scopes[i].has(name)) {
        this.scopes[i].set(name, value);
        return;
      }
    }
    throw new Error(`Переменная '${name}' не объявлена.`);
  }

  private updateArrayElement(arrayName: string, index: number, value: number): void {
    const arrayData = this.findArray(arrayName)
    if (!arrayData) {
      throw new Error(`Массив '${arrayName}' не объявлен.`)
    }
    if (index < 0 || index >= arrayData.size) {
      throw new Error(`Индекс ${index} выходит за границы массива '${arrayName}' (размер: ${arrayData.size}).`)
    }
    arrayData.elements[index] = value
  }

  private getArrayElement(arrayName: string, index: number): number {
    const arrayData = this.findArray(arrayName)
    if (!arrayData) {
      throw new Error(`Массив '${arrayName}' не объявлен.`)
    }
    if (index < 0 || index >= arrayData.size) {
      throw new Error(`Индекс ${index} выходит за границы массива '${arrayName}' (размер: ${arrayData.size}).`)
    }
    return arrayData.elements[index]
  }

  getVariables(): VariableData[] {
    const allVariables = new Map<string, number>();

    for (const scope of this.scopes) {
      for (const [name, value] of scope.entries()) {
        allVariables.set(name, value);
      }
    }
    return Array.from(allVariables.entries()).map(([name, value]) => ({ name, value }));
  }

  getArrays(): ArrayData[] {
    const allArrays = new Map<string, ArrayData>()

    for (const scope of this.arrayScopes) {
      for (const [name, arrayData] of scope.entries()) {
        allArrays.set(name, arrayData)
      }
    }
    return Array.from(allArrays.values())
  }

  getArrayNames(): string[] {
    return this.getArrays().map((arr) => arr.name)
  }

  getFunctions(): string[] {
    return Array.from(this.functions.keys())
  }

  getErrors() {
    return this.errors
  }

  getOutputMessages() { 
    return this.outputMessages;
  }
private discoverFunctions() {
    const functionStarts = this.blocks.filter((block) => block.type === "functionStart")
    for (const startBlock of functionStarts) {
      const functionName = startBlock.data?.functionName?.trim()
      if (!functionName) {
        this.errors.push({
          blockId: startBlock.instanceId,
          message: "Имя функции не указано",
        })
        continue
      }
      const endBlock = this.findFunctionEnd(startBlock)
      if (!endBlock) {
        this.errors.push({
          blockId: startBlock.instanceId,
          message: `Не найден блок конца для функции '${functionName}'`,
        })
        continue
      }
      if (this.functions.has(functionName)) {
        this.errors.push({
          blockId: startBlock.instanceId,
          message: `Функция '${functionName}' уже объявлена`,
        })
        continue
      }
      this.functions.set(functionName, {
        name: functionName,
        startBlockId: startBlock.instanceId,
        endBlockId: endBlock.instanceId,
      })
    }
  }
  
  private findFunctionEnd(startBlock: PlacedBlockType): PlacedBlockType | null {
    let currentBlock = startBlock
    const visited = new Set<string>()

    while (currentBlock && !visited.has(currentBlock.instanceId)) {
      visited.add(currentBlock.instanceId)
      if (currentBlock.type === "functionEnd") {
        return currentBlock
      }
      if (currentBlock.nextBlockId) {
        const nextBlock = this.blocks.find((b) => b.instanceId === currentBlock.nextBlockId)
        if (nextBlock) {
          currentBlock = nextBlock
        } else {
          break
        }
      } else {
        break
      }
    }
    return null
  }
  
  private executeFunction(functionName: string): void {
    if (this.callStack.length >= this.maxCallStackDepth) {
      throw new Error(
        `Превышена максимальная глубина вызовов функций (${this.maxCallStackDepth}). Возможна бесконечная рекурсия.`,
      )
    }
    if (this.callStack.includes(functionName)) {
      throw new Error(`Обнаружена рекурсия в функции '${functionName}'`)
    }
    const functionData = this.functions.get(functionName)
    if (!functionData) {
      throw new Error(`Функция '${functionName}' не найдена`)
    }
    const startBlock = this.blocks.find((b) => b.instanceId === functionData.startBlockId)
    if (!startBlock) {
      throw new Error(`Не найден начальный блок функции '${functionName}'`)
    }

    this.callStack.push(functionName)
    this.pushScope()

    try {
      if (startBlock.nextBlockId) {
        const firstBlock = this.blocks.find((b) => b.instanceId === startBlock.nextBlockId)
        if (firstBlock) {
          this.executeFunctionBody(firstBlock, functionData.endBlockId)
        }
      }
    } finally {
      this.popScope()
      this.callStack.pop()
    }
  }

  private executeFunctionBody(currentBlock: PlacedBlockType, endBlockId: string, iterationCount = 0): void {
    if (iterationCount > this.maxIterations) {
      this.errors.push({
        blockId: currentBlock.instanceId,
        message: `Превышено максимальное количество итераций (${this.maxIterations}) в функции. Возможно, бесконечный цикл.`,
      })
      return
    }

    if (currentBlock.instanceId === endBlockId) {
      return
    }

    if (currentBlock.type === "functionEnd") {
      return
    }

    if (currentBlock.type !== "functionStart") {
      try {
        this.executeBlock(currentBlock)
      } catch (error) {
        if (!this.errors.some((e) => e.blockId === currentBlock.instanceId)) {
          this.errors.push({ blockId: currentBlock.instanceId, message: (error as Error).message })
        }
        return;
      }
    }

    if (currentBlock.type === "if") {
      let condition: boolean
      try {
        condition = this.evaluateCondition(currentBlock)
      } catch (error) {
        this.errors.push({ blockId: currentBlock.instanceId, message: (error as Error).message })
        return
      }

      if (condition && currentBlock.trueBlockId) {
        const nextBlock = this.blocks.find((b) => b.instanceId === currentBlock.trueBlockId)
        if (nextBlock) {
          this.executeFunctionBody(nextBlock, endBlockId, iterationCount)
        }
      } else if (!condition && currentBlock.falseBlockId) {
        const nextBlock = this.blocks.find((b) => b.instanceId === currentBlock.falseBlockId)
        if (nextBlock) {
          this.executeFunctionBody(nextBlock, endBlockId, iterationCount)
        }
      }
    }
    else if (currentBlock.type === "while") {
      let condition: boolean
      try {
        condition = this.evaluateCondition(currentBlock)
      } catch (error) {
        this.errors.push({ blockId: currentBlock.instanceId, message: (error as Error).message })
        return
      }

      if (condition && currentBlock.trueBlockId) {
        const bodyBlock = this.blocks.find((b) => b.instanceId === currentBlock.trueBlockId)
        if (bodyBlock) {
          this.executeFunctionBody(bodyBlock, endBlockId, iterationCount + 1)
          this.executeFunctionBody(currentBlock, endBlockId, iterationCount + 1)
        }
      } else if (!condition && currentBlock.falseBlockId) {
        const nextBlock = this.blocks.find((b) => b.instanceId === currentBlock.falseBlockId)
        if (nextBlock) {
          this.executeFunctionBody(nextBlock, endBlockId, iterationCount)
        }
      }
    } else if (currentBlock.type === "for") {
      let isNewLoopIteration = false
      try {
        if (!this.initializedForLoops.has(currentBlock.instanceId)) {
          this.pushScope()
          isNewLoopIteration = true
          if (currentBlock.data?.initialization && currentBlock.data.initialization.trim() !== "") {
            this.executeAssignmentStatement(currentBlock.data.initialization, currentBlock.instanceId, true)
          }
          this.initializedForLoops.add(currentBlock.instanceId)
        }

        let conditionResult = false
        if (currentBlock.data?.condition && currentBlock.data.condition.trim() !== "") {
          conditionResult = this.evaluateCondition(currentBlock)
        }

        if (conditionResult) {
          if (currentBlock.trueBlockId) {
            const bodyBlock = this.blocks.find((b) => b.instanceId === currentBlock.trueBlockId)
            if (bodyBlock) {
              this.executeFunctionBody(bodyBlock, endBlockId, iterationCount + 1)

              if (this.errors.length > 0 && this.errors.some((e) => e.blockId === bodyBlock.instanceId || !e.blockId)) {
                return
              }
            }
          }

          if (currentBlock.data?.iteration && currentBlock.data.iteration.trim() !== "") {
            this.executeAssignmentStatement(currentBlock.data.iteration, currentBlock.instanceId, false)
          }

          if (this.errors.length > 0 && this.errors.some((e) => e.blockId === currentBlock.instanceId)) {
            const iterationError = this.errors.find(
              (e) => e.blockId === currentBlock.instanceId && e.message.includes("присваивания"),
            )
            if (iterationError) return
          }

          this.executeFunctionBody(currentBlock, endBlockId, iterationCount + 1)
          return
        } else {
          this.initializedForLoops.delete(currentBlock.instanceId)
          if (isNewLoopIteration || this.scopes.length > 1) {
            this.popScope()
          }
          if (currentBlock.falseBlockId) {
            const nextBlock = this.blocks.find((b) => b.instanceId === currentBlock.falseBlockId)
            if (nextBlock) {
              this.executeFunctionBody(nextBlock, endBlockId, iterationCount)
            }
          }
        }
      } catch (error) {
        if (!this.errors.some((e) => e.blockId === currentBlock.instanceId)) {
          this.errors.push({
            blockId: currentBlock.instanceId,
            message: `Ошибка в цикле FOR: ${(error as Error).message}`,
          })
        }

        if (this.initializedForLoops.has(currentBlock.instanceId) && this.scopes.length > 1 && isNewLoopIteration) {
          this.popScope()
        }
        this.initializedForLoops.delete(currentBlock.instanceId)
        return
      }
    } else if (currentBlock.nextBlockId) {

      const nextBlock = this.blocks.find((b) => b.instanceId === currentBlock.nextBlockId)
      if (nextBlock) {
        this.executeFunctionBody(nextBlock, endBlockId, iterationCount)
      }
    }
  }

  execute(blocks: PlacedBlockType[]): {
    success: boolean
    variables: VariableData[]
    arrays: ArrayData[]
    errors: { blockId: string; message: string }[]
    output: { blockId: string; message: string }[]
  } {
    this.reset()
    this.blocks = blocks
    this.discoverFunctions()

    const startBlock = blocks.find((block) => block.type === "start")
    if (!startBlock) {
      this.errors.push({ blockId: "", message: "Блок 'Старт' не найден" })
      return {
        success: false,
        variables: this.getVariables(),
        arrays: this.getArrays(),
        errors: this.errors,
        output: this.outputMessages,
      }
    }

    try {
      this.executeBlockChain(startBlock)
    } catch (error) {
      this.errors.push({ blockId: "", message: (error as Error).message })
    }

    return {
      success: this.errors.length === 0,
      variables: this.getVariables(),
      arrays: this.getArrays(),
      errors: this.errors,
      output: this.outputMessages,
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

    if (currentBlock.type === "functionStart" || currentBlock.type === "functionEnd") {
      if (currentBlock.nextBlockId) {
        const nextBlock = this.blocks.find((block) => block.instanceId === currentBlock.nextBlockId)
        if (nextBlock) {
          this.executeBlockChain(nextBlock, iterationCount)
        }
      }
      return
    }

    if (currentBlock.type !== "start") {
      try {
        this.executeBlock(currentBlock)
      } catch (error) {
        if (!this.errors.some((e) => e.blockId === currentBlock.instanceId)) {
          this.errors.push({ blockId: currentBlock.instanceId, message: (error as Error).message })
        }
        return;
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
        this.errors.push({ blockId: currentBlock.instanceId, message: (error as Error).message })
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
    } else if (currentBlock.type === "while") {
      let condition: boolean
      try {
        condition = this.evaluateCondition(currentBlock)
      } catch (error) {
        this.errors.push({ blockId: currentBlock.instanceId, message: (error as Error).message })
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
    } else if (currentBlock.type === "for") {
      let isNewLoopIteration = false
      try {
        if (!this.initializedForLoops.has(currentBlock.instanceId)) {
          this.pushScope()
          isNewLoopIteration = true
          if (currentBlock.data?.initialization && currentBlock.data.initialization.trim() !== "") {
            this.executeAssignmentStatement(currentBlock.data.initialization, currentBlock.instanceId, true);
          }
          this.initializedForLoops.add(currentBlock.instanceId);
        }

        let conditionResult = false; 
        if (currentBlock.data?.condition && currentBlock.data.condition.trim() !== "") {
          conditionResult = this.evaluateCondition(currentBlock);
        } else {
        }

        if (conditionResult) {
          if (currentBlock.trueBlockId) {
            const bodyBlock = this.blocks.find((b) => b.instanceId === currentBlock.trueBlockId);
            if (bodyBlock) {
              this.executeBlockChain(bodyBlock, iterationCount + 1)

              if (this.errors.length > 0 && this.errors.some((e) => e.blockId === bodyBlock.instanceId || !e.blockId)) {
                return
              }
            }
          }

          if (currentBlock.data?.iteration && currentBlock.data.iteration.trim() !== "") {
            this.executeAssignmentStatement(currentBlock.data.iteration, currentBlock.instanceId, false);
          }

          if (this.errors.length > 0 && this.errors.some((e) => e.blockId === currentBlock.instanceId)) {
            const iterationError = this.errors.find(
              (e) => e.blockId === currentBlock.instanceId && e.message.includes("присваивания"),
            )
            if (iterationError) return
          }

          this.executeBlockChain(currentBlock, iterationCount + 1);
          return; 
        } else {
          this.initializedForLoops.delete(currentBlock.instanceId);
          if (isNewLoopIteration || this.scopes.length > 1) { 
            this.popScope(); 
          }
          if (currentBlock.falseBlockId) {
            const nextBlock = this.blocks.find((b) => b.instanceId === currentBlock.falseBlockId);
            if (nextBlock) {
              this.executeBlockChain(nextBlock, iterationCount);
            }
          }
        }
      } catch (error) {
        if (!this.errors.some((e) => e.blockId === currentBlock.instanceId)) {
          this.errors.push({
            blockId: currentBlock.instanceId,
            message: `Ошибка в цикле FOR: ${(error as Error).message}`,
          })
        }

        if (this.initializedForLoops.has(currentBlock.instanceId) && this.scopes.length > 1 && isNewLoopIteration) {
          this.popScope()
        }
        this.initializedForLoops.delete(currentBlock.instanceId); 
        return; 
      }
    } else if (currentBlock.nextBlockId) {
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
      if (!arithmeticBlock || (arithmeticBlock.type !== "arithmetic" && arithmeticBlock.type !== "arrayElement")) {
        throw new Error("Неверное соединение с арифметическим блоком для левого значения")
      }
      const result =
        arithmeticBlock.type === "arithmetic"
          ? this.evaluateArithmeticExpression(arithmeticBlock)
          : this.evaluateArrayElement(arithmeticBlock)
      if (result.error) {
        throw new Error(`Ошибка в выражении: ${result.error}`)
      }
      leftValue = result.value
    } else {
      const leftExpr = block.data?.condition?.split(" ")[0] || ""
      leftValue = this.evaluateSimpleExpression(leftExpr)
    }

    if (block.inputConnections?.rightInputId) {
      const arithmeticBlock = this.blocks.find((b) => b.instanceId === block.inputConnections?.rightInputId)
      if (!arithmeticBlock || (arithmeticBlock.type !== "arithmetic" && arithmeticBlock.type !== "arrayElement")) {
        throw new Error("Неверное соединение с арифметическим блоком для правого значения")
      }
      const result =
        arithmeticBlock.type === "arithmetic"
          ? this.evaluateArithmeticExpression(arithmeticBlock)
          : this.evaluateArrayElement(arithmeticBlock)
      if (result.error) {
        throw new Error(`Ошибка в выражении: ${result.error}`)
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
        case "output":
          this.executeOutputBlock(block);
          break
        case "functionCall":
          this.executeFunctionCallBlock(block)
          break
        case "arrayDeclaration":
          this.executeArrayDeclarationBlock(block)
          break
        case "arrayAssignment":
          this.executeArrayAssignmentBlock(block)
          break
        case "arrayElement":
          break 
        case "if":
        case "while":
        case "for":
          break
        case "start":
        case "end":
          break
        case "functionStart":
        case "functionEnd":
        default:
          throw new Error(`Неизвестный тип блока: ${block.type}`)
      }
    } catch (error) {
      this.errors.push({ blockId: block.instanceId, message: (error as Error).message })
      throw error
    }
  }

  private executeArrayDeclarationBlock(block: PlacedBlockType) {
    const arrayName = block.data?.arrayName?.trim()
    const arraySizeStr = block.data?.arraySize?.trim()

    if (!arrayName) {
      throw new Error("Имя массива не указано")
    }

    if (!arraySizeStr) {
      throw new Error("Размер массива не указан")
    }

    const arraySize = Number.parseInt(arraySizeStr, 10)
    if (isNaN(arraySize) || arraySize <= 0) {
      throw new Error("Размер массива должен быть положительным числом")
    }

    if (this.findArray(arrayName)) {
      throw new Error(`Массив '${arrayName}' уже существует`)
    }

    this.declareArrayInCurrentScope(arrayName, arraySize)
  }

  private executeArrayAssignmentBlock(block: PlacedBlockType) {
    const arrayName = block.data?.arrayName?.trim()

    if (!arrayName) {
      throw new Error("Имя массива не указано")
    }

    let index: number
    if (block.inputConnections?.indexInputId) {
      const indexBlock = this.blocks.find((b) => b.instanceId === block.inputConnections?.indexInputId)
      if (!indexBlock || (indexBlock.type !== "arithmetic" && indexBlock.type !== "arrayElement")) {
        throw new Error("Неверное соединение для индекса массива")
      }
      const result =
        indexBlock.type === "arithmetic"
          ? this.evaluateArithmeticExpression(indexBlock)
          : this.evaluateArrayElement(indexBlock)
      if (result.error) {
        throw new Error(`Ошибка в вычислении индекса: ${result.error}`)
      }
      index = Math.floor(result.value)
    } else {
      const indexStr = block.data?.arrayIndex?.trim()
      if (!indexStr) {
        throw new Error("Индекс массива не указан")
      }
      index = Math.floor(this.evaluateSimpleExpression(indexStr))
    }

    let value: number
    if (block.inputConnections?.valueInputId) {
      const valueBlock = this.blocks.find((b) => b.instanceId === block.inputConnections?.valueInputId)
      if (!valueBlock || (valueBlock.type !== "arithmetic" && valueBlock.type !== "arrayElement")) {
        throw new Error("Неверное соединение для значения")
      }
      const result =
        valueBlock.type === "arithmetic"
          ? this.evaluateArithmeticExpression(valueBlock)
          : this.evaluateArrayElement(valueBlock)
      if (result.error) {
        throw new Error(`Ошибка в вычислении значения: ${result.error}`)
      }
      value = result.value
    } else {
      const valueStr = block.data?.value?.trim()
      if (!valueStr) {
        throw new Error("Значение не указано")
      }
      value = this.evaluateSimpleExpression(valueStr)
    }

    this.updateArrayElement(arrayName, index, value)
  }

  private evaluateArrayElement(block: PlacedBlockType): ExpressionResult {
    const arrayName = block.data?.arrayName?.trim()

    if (!arrayName) {
      return { value: 0, error: "Имя массива не указано" }
    }

    try {
      let index: number
      if (block.inputConnections?.indexInputId) {
        const indexBlock = this.blocks.find((b) => b.instanceId === block.inputConnections?.indexInputId)
        if (!indexBlock || (indexBlock.type !== "arithmetic" && indexBlock.type !== "arrayElement")) {
          return { value: 0, error: "Неверное соединение для индекса массива" }
        }
        const result =
          indexBlock.type === "arithmetic"
            ? this.evaluateArithmeticExpression(indexBlock)
            : this.evaluateArrayElement(indexBlock)
        if (result.error) {
          return { value: 0, error: `Ошибка в вычислении индекса: ${result.error}` }
        }
        index = Math.floor(result.value)
      } else {
        const indexStr = block.data?.arrayIndex?.trim()
        if (!indexStr) {
          return { value: 0, error: "Индекс массива не указан" }
        }
        index = Math.floor(this.evaluateSimpleExpression(indexStr))
      }

      const value = this.getArrayElement(arrayName, index)
      return { value }
    } catch (error) {
      return { value: 0, error: (error as Error).message }
    }
  }

  private executeFunctionCallBlock(block: PlacedBlockType) {
    const functionName = block.data?.functionName?.trim()
    if (!functionName) {
      throw new Error("Имя функции для вызова не указано")
    }

    this.executeFunction(functionName)
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

      if (this.getCurrentScope().has(name)) {
        throw new Error(`Переменная '${name}' уже существует в текущей области видимости.`)
      }
      this.getCurrentScope().set(name, 0)
    }
  }

  private executeAssignmentBlock(block: PlacedBlockType) {
    const variableName = block.data?.variableName

    if (!variableName) {
      throw new Error("Имя переменной не указано")
    }

    const varInfo = this.findVariable(variableName);
    if (!varInfo) {
      throw new Error(`Переменная '${variableName}' не существует`)
    }

    let value: number

    if (block.inputConnections?.valueInputId) {
      const valueBlock = this.blocks.find((b) => b.instanceId === block.inputConnections?.valueInputId)
      if (!valueBlock || (valueBlock.type !== "arithmetic" && valueBlock.type !== "arrayElement")) {
        throw new Error("Неверное соединение с блоком значения")
      }
      const result =
        valueBlock.type === "arithmetic"
          ? this.evaluateArithmeticExpression(valueBlock)
          : this.evaluateArrayElement(valueBlock)
      if (result.error) {
        throw new Error(`Ошибка в выражении: ${result.error}`)
      }
      value = result.value
    } else {
      if (block.data?.value === undefined || block.data?.value === "") {
        throw new Error("Значение не указано")
      }
      value = this.evaluateSimpleExpression(block.data.value)
    }

    this.updateVariable(variableName, value); 
  }

  private executeOutputBlock(block: PlacedBlockType) {
    const expressionStr = block.data?.expression;
    let outputValue: string | number;

    if (block.inputConnections?.valueInputId) {
      const valueBlock = this.blocks.find((b) => b.instanceId === block.inputConnections?.valueInputId)
      if (!valueBlock || (valueBlock.type !== "arithmetic" && valueBlock.type !== "arrayElement")) {
        throw new Error("Неверное соединение с блоком для вывода")
      }
      const result =
        valueBlock.type === "arithmetic"
          ? this.evaluateArithmeticExpression(valueBlock)
          : this.evaluateArrayElement(valueBlock)
      if (result.error) {
        throw new Error(`Ошибка в выражении для вывода: ${result.error}`)
      }
      outputValue = result.value;
    } else if (expressionStr !== undefined && expressionStr.trim() !== "") {
      try {
        
        outputValue = this.evaluateSimpleExpression(expressionStr);
      } catch (e) {
        outputValue = expressionStr; 
      }
    } else {
      throw new Error("Значение или выражение для вывода не указано");
    }
    this.outputMessages.push({ blockId: block.instanceId, message: String(outputValue) });
  }

  private evaluateSimpleExpression(expression: string): number {
    const varInfo = this.findVariable(expression);
    if (varInfo) {
      return varInfo.value;
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

      for (let i = this.scopes.length - 1; i >= 0; i--) {
        for (const [name, value] of this.scopes[i].entries()) {
          const regex = new RegExp(`\\b${name}\\b`, "g")
          if (new RegExp(`\\b${name}\\b`).test(processedExpression)) {
            processedExpression = processedExpression.replace(regex, value.toString())
          }
        }
      }

      if (!/^[^a-zA-Z]*$/.test(processedExpression) && !/^[[\]\d\s+\-*/^().%]+$/.test(processedExpression)) {
        this.errors.push({
          blockId: block.instanceId,
          message: "Выражение содержит недопустимые символы",
        })
        return { value: 0, error: "Недопустимые символы" }
      }
      const tokens = this.tokenize(processedExpression)
      const rpn = this.infixToRPN(tokens)
      const result = this.calculateRPN(rpn)

      if (isNaN(result) || !isFinite(result)) {
        this.errors.push({
          blockId: block.instanceId,
          message: "Некорректный результат вычислений",
        })
        return { value: 0, error: "Некорректный результат" }
      }
      return { value: result }
    } catch (error) {
      this.errors.push({
        blockId: block.instanceId,
        message: `Ошибка вычисления: ${(error as Error).message}`,
      })
      return { value: 0, error: (error as Error).message }
    }
  }

  private tokenize(expression: string): string[] {
    const regex = /(\d+\.?\d*)|(\/\/|%|[+\-*/^()])/g
    const tokens = []
    let match

    while ((match = regex.exec(expression)) !== null) {
      if (match[1]) tokens.push(match[1])
      else if (match[2]) tokens.push(match[2])
    }

    return tokens
  }

  private infixToRPN(tokens: string[]): string[] {
    const output: string[] = []
    const stack: string[] = []
    const precedence: { [key: string]: number } = {
        '^': 4,
        '*': 3,
        '/': 3,
        '//': 3,
        '%': 3,
        '+': 2,
        '-': 2,
    };

    for (const token of tokens) {
      if (/\d/.test(token)) {
        output.push(token)
      } else if (token === "(") {
        stack.push(token)
      } else if (token === ")") {
        while (stack.length && stack[stack.length - 1] !== "(") {
          output.push(stack.pop()!)
        }
        stack.pop()
      } else {
        while (
          stack.length &&
          stack[stack.length - 1] !== "(" &&
          precedence[token] <= precedence[stack[stack.length - 1]]
        ) {
          output.push(stack.pop()!)
        }
        stack.push(token)
      }
    }

    while (stack.length) {
      output.push(stack.pop()!)
    }

    return output
  }

  private calculateRPN(rpn: string[]): number {
    const stack: number[] = []

    for (const token of rpn) {
      if (/\d/.test(token)) {
        stack.push(Number.parseFloat(token))
      } else {
        const b = stack.pop()!
        const a = stack.pop()!
        switch (token) {
          case "+":
            stack.push(a + b)
            break
          case "-":
            stack.push(a - b)
            break
          case "*":
            stack.push(a * b)
            break
          case "/":
            if (b === 0) throw new Error("Деление на ноль")
            stack.push(a / b)
            break
          case "//":
            if (b === 0) throw new Error("Деление на ноль (целочисленное)")
            stack.push(Math.floor(a / b))
            break
          case "%":
            if (b === 0) throw new Error("Деление на ноль (остаток)")
            stack.push(a % b)
            break
          case "^":
            stack.push(a ** b)
            break
          default:
            throw new Error(`Неизвестный оператор: ${token}`)
        }
      }
    }
    return stack.pop()!
  }

  private evaluateArithmeticFromString(expressionStr: string, blockIdForErrorMessage: string): number {
    if (!expressionStr || expressionStr.trim() === "") {
      throw new Error("Пустое выражение недопустимо для вычисления.")
    }

    const tempBlock: PlacedBlockType = {
      instanceId: blockIdForErrorMessage,
      id: "temp-arithmetic-for-string",
      type: "arithmetic",
      title: "Temp Arithmetic",
      description: "",
      category: "Операторы",
      color: "",
      x: 0,
      y: 0,
      data: { expression: expressionStr },
    }
    const result = this.evaluateArithmeticExpression(tempBlock)
    if (result.error) {
      throw new Error(`Ошибка в выражении '${expressionStr}': ${result.error}`)
    }
    return result.value;
  }

  private executeAssignmentStatement(statement: string, blockId: string, isInitialization = false) {
    if (!statement || !statement.includes("=")) {
      throw new Error(`Некорректное выражение присваивания: '${statement}'`)
    }
    const parts = statement.split("=").map((p) => p.trim())
    if (parts.length !== 2 || !parts[0]) {
      throw new Error(`Некорректное выражение присваивания: '${statement}'`)
    }
    const variableName = parts[0];
    const expressionStr = parts[1];

    if (isInitialization) {
    } else {
      if (!this.findVariable(variableName)) {
        throw new Error(`Переменная '${variableName}' не объявлена (в выражении '${statement}').`);
      }
    }

    try {
      const value = this.evaluateArithmeticFromString(expressionStr, blockId)
      if (isInitialization) {
        this.declareOrUpdateInCurrentScope(variableName, value)
      } else {
        this.updateVariable(variableName, value)
      }
    } catch (e) {
      this.errors.push({ blockId, message: `Ошибка в присваивании '${statement}': ${(e as Error).message}` })
      throw e
    }
  }
}

export default Interpreter;