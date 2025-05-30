import { BlockType } from '../types';

const useBlockData = () => {
  const blocks: BlockType[] = [
    {
      id: 'start-block',
      category: 'Управление',
      title: 'Старт',
      description: 'Начало программы',
      color: '#4CAF50',
      type: 'start',
    },
    {
      id: 'end-block',
      category: 'Управление',
      title: 'Конец',
      description: 'Конец программы',
      color: '#F44336',
      type: 'end',
    },
    {
      id: 'var-create',
      category: 'Переменные',
      title: 'Создать переменную',
      description: 'Создаёт новую переменную с заданным именем',
      color: '#9966FF',
      type: 'variable',
    },
    {
      id: 'var-assign',
      category: 'Переменные',
      title: 'Присвоить значение',
      description: 'Присваивает переменной указанное значение',
      color: '#9966FF',
      type: 'assignment',
    },
    {
      id: 'arithmetic',
      category: 'Операторы',
      title: 'Арифметическое выражение',
      description: 'Вычисляет арифметическое выражение с переменными и числами',
      color: '#FF9800',
      type: 'arithmetic',
    },
    {
      id: 'if-condition',
      category: 'Управление',
      title: 'Если условие',
      description: 'Выполняет блок кода, если условие истинно',
      color: '#FFAB19',
      type: 'if',
    },
    {
      id: 'while-loop',
      category: 'Управление',
      title: 'Цикл while',
      description: 'Повторяет блок кода, пока условие истинно',
      color: '#FF5722',
      type: 'while',
    },
    {
      id: 'for-loop',
      category: 'Управление',
      title: 'Цикл FOR',
      description: 'Повторяет блок кода (инициализация; условие; шаг)',
      color: '#00BCD4',
      type: 'for',
    },
    {
      id: 'output-block',
      category: 'Операторы',
      title: 'Вывод',
      description: 'Выводит значение выражения или переменную',
      color: '#795548', 
      type: 'output',
    },
    {
      id: "function-start",
      category: "Мои блоки",
      title: "Начало функции",
      description: "Объявляет начало новой функции",
      color: "#673AB7",
      type: "functionStart",
    },
    {
      id: "function-end",
      category: "Мои блоки",
      title: "Конец функции",
      description: "Завершает объявление функции",
      color: "#512DA8",
      type: "functionEnd",
    },
    {
      id: "function-call",
      category: "Мои блоки",
      title: "Вызов функции",
      description: "Вызывает ранее объявленную функцию",
      color: "#9C27B0",
      type: "functionCall",
    }
  ]

  return { blocks };
};

export { useBlockData };
export default useBlockData; 