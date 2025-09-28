import formatPlain from './plain.js';
import formatStylish from './stylish.js';

const formatters = {
  plain: formatPlain,
  stylish: formatStylish,
  // Нужно догадаться (с помощью подсказок) что наше внутреннее дерево
  // это лучшее представление для машинной обработки
  json: JSON.stringify,
};

// Наружу надо выставлять функции, а не структуры данных (formatters)
export default (ast, type) => {
  const format = formatters[type];
  if (!format) {
    // Обработка ошибок необязательна
    throw new Error(`Unknown format '${type}'`);
  }
  return format(ast);
};
