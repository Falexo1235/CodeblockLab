import { BlockType } from '../types';

export const useBlockData = () => {
  const blocks: BlockType[] = [
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
      title: 'Арифметическая операция',
      description: 'Выполняет арифметическую операцию над двумя значениями',
      color: '#59C059',
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
  ];

  return { blocks };
}; 