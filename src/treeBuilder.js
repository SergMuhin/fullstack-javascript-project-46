import _ from 'lodash'

// Правильный способ проверять ключ в объекте _.has() (Object.hasOwn())
// Дерево не знает ничего про вывод и не может готовить данные для него
// Дерево описывает собой разницу между объектами (не визуально)

// Правильный способ строить дерево – находить объединение ключей и выполнять один проход
// https://www.youtube.com/watch?v=vkUTX1hruF8
// У каждой ноды должен быть тип. Всего их 5 (по количеству разных вариантов поведения).
const buildDiff = (data1, data2) => {
  // Принципиально что здесь используется union (и выполняется сортировка)
  // https://www.youtube.com/watch?v=vkUTX1hruF8
  const keys = _.union(Object.keys(data1), Object.keys(data2))
  // Избегаем мутаций с помощью sortBy
  const sortedKeys = _.sortBy(keys)
  const diff = sortedKeys.map((key) => {
    if (!_.has(data1, key)) {
      // тип ноды может иметь любое другое имя
      // ключ со значением может называться value1/value2
      return { key, type: 'added', value: data2[key] }
    }

    if (!_.has(data2, key)) {
      return { key, type: 'deleted', value: data1[key] }
    }

    // Дети есть только тогда, когда оба значения объекты, но не массивы
    // @see https://lodash.com/docs/#isPlainObject
    if (_.isPlainObject(data1[key]) && _.isPlainObject(data2[key])) {
      // Важно что тут children, а не value
      // children часть структуры, value – просто данные
      return {
        key,
        type: 'nested',
        children: buildDiff(data1[key], data2[key]),
      }
    }
    // при простом сравнении массивы будут сравниваться некорректно, поэтому isEqual.
    if (!_.isEqual(data1[key], data2[key])) {
      return {
        key,
        type: 'changed',
        value1: data1[key],
        value2: data2[key],
      }
    }

    return { key, type: 'unchanged', value: data2[key] }
    // утилита работает с двумя разными файлами, а не с одним в разных состояниях
    // поэтому тут не может быть "статусов", "предыдущих" или "новых" значений
  })

  return diff
}

// дерево может быть представлено массивом с массивами или объектом:
export default (data1, data2) => ({
  type: 'root',
  children: buildDiff(data1, data2),
})
