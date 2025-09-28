import _ from 'lodash';

// отступ формируем согласно заданию: 4 пробела по умолчанию
// не учитывая маркер 2 знака ('+ ', '- ', '  ')
const indent = (depth, spacesCount = 4) => ' '.repeat(depth * spacesCount - 2);

// Важно правильное выделение этой функции
// https://ru.hexlet.io/challenges/js_trees_stringify_exercise
const stringify = (data, depth, mapping) => {
  // guard expression
  if (!_.isObject(data)) {
    // Тип результата всегда должен быть строкой.
    return String(data);
  }

  const output = Object.entries(data).map(([key, value]) =>
    mapping.unchanged({ key, value }, depth + 1),
  );

  return `{\n${output.join('\n')}\n${indent(depth)}  }`;
};

// Обход дерева всегда в глубину на один уровень (+1)
// Не может быть -1, +4, или погружение на 4 пробела '    '

const mapping = {
  root: ({ children }, depth, iter) => {
    const output = children.flatMap((node) =>
      mapping[node.type](node, depth + 1, iter),
    );
    return `{\n${output.join('\n')}\n}`;
  },
  nested: ({ key, children }, depth, iter) => {
    const output = children.flatMap((node) =>
      mapping[node.type](node, depth + 1, iter),
    );
    return `${indent(depth)}  ${key}: {\n${output.join('\n')}\n${indent(
      depth,
    )}  }`;
  },
  added: (node, depth) =>
    `${indent(depth)}+ ${node.key}: ${stringify(node.value, depth, mapping)}`,
  deleted: (node, depth) =>
    `${indent(depth)}- ${node.key}: ${stringify(node.value, depth, mapping)}`,
  unchanged: (node, depth) =>
    `${indent(depth)}  ${node.key}: ${stringify(node.value, depth, mapping)}`,
  changed: (node, depth) => {
    const { key, value1, value2 } = node;

    const data1 = `${indent(depth)}- ${key}: ${stringify(
      value1,
      depth,
      mapping,
    )}`;
    const data2 = `${indent(depth)}+ ${key}: ${stringify(
      value2,
      depth,
      mapping,
    )}`;

    return [data1, data2];
  },
};

// Функция должна выставлять только тот интерфейс, который ожидает клиент
// https://www.youtube.com/watch?v=2sgMdgOSCxg
const renderTree = (ast) => {
  // 1. Глубина дерева первична, отступы строятся на ее основе
  // 2. Логика целиком и полностью определяется типом.
  // На верхнем уровне проверка по типу, все остальные ифы внутри.
  // Реализация может быть тут через диспетчеризацию по ключам объекта, либо через обычный switch
  // Принципиально что не должно быть особых нод,
  // обрабатываемых не так как все остальные (вне switch например).
  const iter = (node, depth) => mapping[node.type](node, depth, iter);
  return iter(ast, 0);
};

export default renderTree;
