import { BlockType } from '../types';

export const useBlockData = () => {
  const blocks: BlockType[] = [
    {
      id: 'var-create',
      category: 'Переменные',
      title: 'Создать переменную',
      description: 'Создаёт новую переменную с заданным именем',
      color: '#9966FF',
    },
    {
      id: 'var-set',
      category: 'Переменные',
      title: 'Установить [var] в [0]',
      description: 'Присваивает переменной [var] значение 0',
      color: '#9966FF',
    },
    {
      id: 'var-change',
      category: 'Переменные',
      title: 'Изменить [var] на [1]',
      description: 'Увеличивает или уменьшает переменную [var] на указанное значение',
      color: '#9966FF',
    },
    {
      id: 'ctrl-if',
      category: 'Управление',
      title: 'Если [условие] то...',
      description: 'Если условие истинно, выполняет вложенные блоки',
      color: '#FFAB19',
    },
    {
      id: 'ctrl-if-else',
      category: 'Управление',
      title: 'Если... Иначе...',
      description: 'Если условие истинно — выполняет первый блок, иначе — второй',
      color: '#FFAB19',
    },
    {
      id: 'ctrl-repeat',
      category: 'Управление',
      title: 'Повторить [10] { ... }',
      description: 'Повторяет вложенные блоки указанное количество раз',
      color: '#FFAB19',
    },
    {
      id: 'ctrl-forever',
      category: 'Управление',
      title: 'Всегда { ... }',
      description: 'Бесконечный цикл, выполняющий вложенные блоки',
      color: '#FFAB19',
    },
    {
      id: 'ctrl-wait',
      category: 'Управление',
      title: 'Ждать [1] секунд',
      description: 'Приостанавливает выполнение на указанное количество секунд',
      color: '#FFAB19',
    },
    {
      id: 'op-less',
      category: 'Операторы',
      title: '[ ] < [ ]',
      description: 'Сравнение "меньше" между двумя числами',
      color: '#59C059',
    },
    {
      id: 'op-equal',
      category: 'Операторы',
      title: '[ ] = [ ]',
      description: 'Проверяет, равны ли два значения',
      color: '#59C059',
    },
    {
      id: 'op-and',
      category: 'Операторы',
      title: '[ ] и [ ]',
      description: 'Логическая операция "и"',
      color: '#59C059',
    },
    {
      id: 'op-or',
      category: 'Операторы',
      title: '[ ] или [ ]',
      description: 'Логическая операция "или"',
      color: '#59C059',
    },
    {
      id: 'op-not',
      category: 'Операторы',
      title: 'не [ ]',
      description: 'Логическая операция "не"',
      color: '#59C059',
    },
    {
      id: 'op-random',
      category: 'Операторы',
      title: 'Случайное число от [1] до [10]',
      description: 'Возвращает случайное число в указанном диапазоне',
      color: '#59C059',
    },
    {
      id: 'my-block-1',
      category: 'Мои блоки',
      title: 'Пользовательский блок 1',
      description: 'Пользовательский (кастомный) блок',
      color: '#FF6680',
    },
  ];

  return { blocks };
}; 