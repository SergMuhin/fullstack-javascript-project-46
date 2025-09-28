import fs from 'fs'
import path from 'path'
// Функция выбора форматера в formatters/index.js. Это фасад.
import format from './formatters/index.js'
// Парсинг выделяем в отдельный модуль
import parse from './parsers.js'
// Построение внутреннего представления в отдельный модуль
import buildTree from './treeBuilder.js'

const buildFullPath = filepath => path.resolve(process.cwd(), filepath)
// Формат данных берём на основе расширения файла, отрезая точку от строки.
const extractFormat = filepath => path.extname(filepath).slice(1)
// Работаем с фабрикой парсеров
const getData = filepath =>
  parse(fs.readFileSync(filepath, 'utf-8'), extractFormat(filepath))

const genDiff = (path1, path2, formatName = 'stylish') => {
  // Основной процесс
  // => Читаем файлы и формат
  // => Парсим данные
  // => Строим внутреннее дерево => Возвращаем форматированные данные
  // Больше здесь ничего быть не может. Сама обработка строится в виде пайплайна.
  // https://ru.hexlet.io/blog/posts/sovershennyy-kod-nishodyaschee-i-voshodyaschee-proektirovanie

  const data1 = getData(buildFullPath(path1))
  const data2 = getData(buildFullPath(path2))

  const internalTree = buildTree(data1, data2)
  // Работаем с фабрикой форматеров
  return format(internalTree, formatName)
}

export default genDiff
