const getPropertyName = (property, parents) => [...parents, property].join('.');
const stringify = (value) => {
  if (value === null) {
    return value;
  }

  if (typeof value === 'object') {
    return '[complex value]';
  }

  if (typeof value === 'string') {
    return `'${value}'`;
  }
  // Тип результата всегда должен быть строкой.
  return String(value);
};

// Строки находятся в одном месте. Сразу видна структура и результат.
// Нет попытки убрать дублирование полностью (например слово Property).
const mapping = {
  // если форматер построен на switch case, то везде будут возвращаться строки,
  // а в unchanged - null, как показатель отсутствия значения
  unchanged: () => [],
  root: ({ children }, path, iter) =>
    children.flatMap((node) => iter(node, path, iter)),
  nested: ({ key, children }, path, iter) =>
    children.flatMap((node) => iter(node, [...path, key])),
  added: (node, path) =>
    `Property '${getPropertyName(
      node.key,
      path,
    )}' was added with value: ${stringify(node.value)}`,
  deleted: (node, path) =>
    `Property '${getPropertyName(node.key, path)}' was removed`,
  changed: ({ key, value1, value2 }, path) => {
    const name = getPropertyName(key, path);
    return `Property '${name}' was updated. From ${stringify(
      value1,
    )} to ${stringify(value2)}`;
  },
};

// Функция должна выставлять только тот интерфейс, который ожидает клиент
// https://www.youtube.com/watch?v=2sgMdgOSCxg
const renderPlain = (ast) => {
  // Сборка строк через массив + join
  // Реализация может быть через switch
  const iter = (node, currentPath) =>
    mapping[node.type](node, currentPath, iter);
  return iter(ast, []).join('\n');
};

export default renderPlain;
