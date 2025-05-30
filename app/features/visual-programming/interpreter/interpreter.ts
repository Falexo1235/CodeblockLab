import type { ExpressionResult, PlacedBlockType, VariableData } from "../types";

export class Interpreter {
  private scopes: Array<Map<string, number>> = []; 
  private errors: { blockId: string; message: string }[] = [];
  private outputMessages: { blockId: string; message: string }[] = []; 
  private blocks: PlacedBlockType[] = [];
  private maxIterations = 1000;
  private initializedForLoops: Set<string> = new Set();

  constructor() {
    this.reset();
  }

  reset() {
    this.scopes = [new Map()]; 
    this.errors = [];
    this.outputMessages = []; 
    this.initializedForLoops.clear();
  }

  private pushScope() {
    this.scopes.push(new Map());
  }

  private popScope() {
    if (this.scopes.length > 1) { 
      this.scopes.pop();
    } else {
      
      console.warn("Attempted to pop the global scope");
    }
  }

  private getCurrentScope(): Map<string, number> {
    if (this.scopes.length === 0) this.pushScope(); 
    return this.scopes[this.scopes.length - 1];
  }

  private findVariable(name: string): { scopeIndex: number; value: number } | null {
    for (let i = this.scopes.length - 1; i >= 0; i--) {
      if (this.scopes[i].has(name)) {
        return { scopeIndex: i, value: this.scopes[i].get(name)! };
      }
    }
    return null;
  }

  
  private declareOrUpdateInCurrentScope(name: string, value: number): void {
    this.getCurrentScope().set(name, value);
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

  getVariables(): VariableData[] {
    const allVariables = new Map<string, number>();
    
    for (const scope of this.scopes) {
      for (const [name, value] of scope.entries()) {
        allVariables.set(name, value);
      }
    }
    return Array.from(allVariables.entries()).map(([name, value]) => ({ name, value }));
  }

  getErrors() {
    return this.errors
  }

  getOutputMessages() { 
    return this.outputMessages;
  }

  execute(blocks: PlacedBlockType[]): {
    success: boolean
    variables: VariableData[]
    errors: { blockId: string; message: string }[]
    output: { blockId: string; message: string }[] 
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

    if (currentBlock.type !== "start") {
      try {
        this.executeBlock(currentBlock)
      } catch (error) {
        if (!this.errors.some(e => e.blockId === currentBlock.instanceId)) {
          this.errors.push({ blockId: currentBlock.instanceId, message: (error as Error).message });
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
    }

    else if (currentBlock.type === "while") {
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
    }

    else if (currentBlock.type === "for") {
      let isNewLoopIteration = false;
      try {
        if (!this.initializedForLoops.has(currentBlock.instanceId)) {
          this.pushScope();
          isNewLoopIteration = true;
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
              this.executeBlockChain(bodyBlock, iterationCount + 1);
              
              if (this.errors.length > 0 && this.errors.some(e => e.blockId === bodyBlock.instanceId || !e.blockId)) {
                return;
              }
            }
          }
          
          if (currentBlock.data?.iteration && currentBlock.data.iteration.trim() !== "") {
            this.executeAssignmentStatement(currentBlock.data.iteration, currentBlock.instanceId, false);
          }
           
          if (this.errors.length > 0 && this.errors.some(e => e.blockId === currentBlock.instanceId)) {
             const iterationError = this.errors.find(e => e.blockId === currentBlock.instanceId && e.message.includes("присваивания"));
             if (iterationError) return;
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
        if (!this.errors.some(e => e.blockId === currentBlock.instanceId)) {
          this.errors.push({ blockId: currentBlock.instanceId, message: `Ошибка в цикле FOR: ${(error as Error).message}` });
        }
        
        if (this.initializedForLoops.has(currentBlock.instanceId) && this.scopes.length > 1 && isNewLoopIteration) {
            
            
            this.popScope();
        }
        this.initializedForLoops.delete(currentBlock.instanceId); 
        return; 
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
        case "output":
          this.executeOutputBlock(block);
          break
        case "if":
        case "while":
        case "for": 
          break
        case "start":
        case "end":
          break
        default:
          throw new Error(`Неизвестный тип блока: ${block.type}`)
      }
    } catch (error) {
      this.errors.push({ blockId: block.instanceId, message: (error as Error).message })
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
      
      
      
      if (this.scopes[0].has(name)) {
        throw new Error(`Переменная '${name}' уже существует в глобальной области видимости.`)
      }
      this.scopes[0].set(name, 0) 
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

    this.updateVariable(variableName, value); 
  }

  private executeOutputBlock(block: PlacedBlockType) {
    const expressionStr = block.data?.expression;
    let outputValue: string | number;

    if (block.inputConnections?.valueInputId) {
      const arithmeticBlock = this.blocks.find((b) => b.instanceId === block.inputConnections?.valueInputId);
      if (!arithmeticBlock || arithmeticBlock.type !== "arithmetic") {
        throw new Error("Неверное соединение с арифметическим блоком для вывода");
      }
      const result = this.evaluateArithmeticExpression(arithmeticBlock);
      if (result.error) {
        throw new Error(`Ошибка в арифметическом выражении для вывода: ${result.error}`);
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

        if (!/^[^a-zA-Z]*$/.test(processedExpression) && !/^[\[\]\d\s+\-*/^().%]+$/.test(processedExpression)) {
            this.errors.push({
                blockId: block.instanceId,
                message: "Выражение содержит недопустимые символы",
            });
            return { value: 0, error: "Недопустимые символы" }
        }
        const tokens = this.tokenize(processedExpression)
        const rpn = this.infixToRPN(tokens)
        const result = this.calculateRPN(rpn)

        if (isNaN(result) || !isFinite(result)) {
            this.errors.push({
                blockId: block.instanceId,
                message: "Некорректный результат вычислений",
            });
            return { value: 0, error: "Некорректный результат" }
        }
        return { value: result }
        
    } catch (error) {
        this.errors.push({
            blockId: block.instanceId,
            message: `Ошибка вычисления: ${(error as Error).message}`,
        });
        return { value: 0, error: (error as Error).message }
    }
  }

  private tokenize(expression: string): string[] {
    const regex = /(\d+\.?\d*)|(\/\/|%|[+\-*\/^()])/g;
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
        } else if (token === '(') {
            stack.push(token)
        } else if (token === ')') {
            while (stack.length && stack[stack.length - 1] !== '(') {
                output.push(stack.pop()!)
            }
            stack.pop()
        } else {
            while (
                stack.length &&
                stack[stack.length - 1] !== '(' &&
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
            stack.push(parseFloat(token))
        } else {
            const b = stack.pop()!
            const a = stack.pop()!
            switch (token) {
                case '+': stack.push(a + b); break;
                case '-': stack.push(a - b); break;
                case '*': stack.push(a * b); break;
                case '/':
                    if (b === 0) throw new Error("Деление на ноль");
                    stack.push(a / b);
                    break;
                case '//': 
                    if (b === 0) throw new Error("Деление на ноль (целочисленное)");
                    stack.push(Math.floor(a / b));
                    break;
                case '%': 
                    if (b === 0) throw new Error("Деление на ноль (остаток)");
                    stack.push(a % b);
                    break;
                case '^': stack.push(a ** b); break;
                default: throw new Error(`Неизвестный оператор: ${token}`);
            }
        }
    }
    return stack.pop()!
  }

  private evaluateArithmeticFromString(expressionStr: string, blockIdForErrorMessage: string): number {
    if (!expressionStr || expressionStr.trim() === "") {
        throw new Error("Пустое выражение недопустимо для вычисления.");
    }
    
    const tempBlock: PlacedBlockType = {
        instanceId: blockIdForErrorMessage, 
        id: 'temp-arithmetic-for-string',
        type: 'arithmetic',
        title: 'Temp Arithmetic',
        description: '',
        category: 'Операторы',
        color: '',
        x:0, y:0,
        data: { expression: expressionStr }
    };
    const result = this.evaluateArithmeticExpression(tempBlock);
    if (result.error) {
        throw new Error(`Ошибка в выражении '${expressionStr}': ${result.error}`);
    }
    return result.value;
  }

  private executeAssignmentStatement(statement: string, blockId: string, isInitialization: boolean = false) {
    if (!statement || !statement.includes('=')) {
        throw new Error(`Некорректное выражение присваивания: '${statement}'`);
    }
    const parts = statement.split('=').map(p => p.trim());
    if (parts.length !== 2 || !parts[0]) { 
        throw new Error(`Некорректное выражение присваивания: '${statement}'`);
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
        const value = this.evaluateArithmeticFromString(expressionStr, blockId);
        if (isInitialization) {
            this.declareOrUpdateInCurrentScope(variableName, value);
        } else {
            this.updateVariable(variableName, value);
        }
    } catch (e) {
        this.errors.push({ blockId, message: `Ошибка в присваивании '${statement}': ${(e as Error).message}` });
        throw e; 
    }
  }
}

export default Interpreter;