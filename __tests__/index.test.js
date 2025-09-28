import { describe, it, expect } from 'vitest'
import { fileURLToPath } from 'url'
import { dirname, join } from 'path'
import genDiff from '../src/index.js'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

describe('genDiff', () => {
  describe('Nested structure comparison', () => {
    it('should compare nested JSON files', () => {
      const file1 = join(__dirname, '../__fixtures__/nested1.json')
      const file2 = join(__dirname, '../__fixtures__/nested2.json')

      const result = genDiff(file1, file2)
      expect(result).toContain('common: {')
      expect(result).toContain('+ follow: false')
      expect(result).toContain('- setting2: 200')
      expect(result).toContain('+ setting3: null')
      expect(result).toContain('group1: {')
      expect(result).toContain('group2: {')
      expect(result).toContain('group3: {')
    })

    it('should compare nested YAML files', () => {
      const file1 = join(__dirname, '../__fixtures__/nested1.yml')
      const file2 = join(__dirname, '../__fixtures__/nested2.yml')

      const result = genDiff(file1, file2)
      expect(result).toContain('common: {')
      expect(result).toContain('+ follow: false')
      expect(result).toContain('- setting2: 200')
      expect(result).toContain('+ setting3: null')
      expect(result).toContain('group1: {')
      expect(result).toContain('group2: {')
      expect(result).toContain('group3: {')
    })

    it('should handle identical nested files', () => {
      const file1 = join(__dirname, '../__fixtures__/nested1.json')
      const file2 = join(__dirname, '../__fixtures__/nested1.json')

      const result = genDiff(file1, file2)
      expect(result).toContain('common: {')
      expect(result).toContain('setting1: Value 1')
      expect(result).not.toContain('+')
      expect(result).not.toContain('-')
    })
  })

  describe('Format support', () => {
    it('should support stylish format (default) with nested structures', () => {
      const file1 = join(__dirname, '../__fixtures__/nested1.json')
      const file2 = join(__dirname, '../__fixtures__/nested2.json')

      const result = genDiff(file1, file2)
      expect(result).toContain('common: {')
      expect(result).toContain('+ follow: false')
      expect(result).toContain('- setting2: 200')
      expect(result).toContain('{')
      expect(result).toContain('}')
    })

    it('should support plain format with nested objects', () => {
      const file1 = join(__dirname, '../__fixtures__/nested1.json')
      const file2 = join(__dirname, '../__fixtures__/nested2.json')

      const result = genDiff(file1, file2, 'plain')
      expect(result).toContain(
        'Property \'common.follow\' was added with value: false',
      )
      expect(result).toContain('Property \'common.setting2\' was removed')
      expect(result).toContain(
        'Property \'common.setting3\' was updated. From true to null',
      )
      expect(result).toContain(
        'Property \'common.setting4\' was added with value: \'blah blah\'',
      )
      expect(result).toContain(
        'Property \'group1.baz\' was updated. From \'bas\' to \'bars\'',
      )
      expect(result).toContain('Property \'group2\' was removed')
      expect(result).toContain(
        'Property \'group3\' was added with value: [complex value]',
      )
    })

    it('should support JSON format with nested structures', () => {
      const file1 = join(__dirname, '../__fixtures__/nested1.json')
      const file2 = join(__dirname, '../__fixtures__/nested2.json')

      const result = genDiff(file1, file2, 'json')
      const parsed = JSON.parse(result)

      expect(parsed).toHaveProperty('type', 'root')
      expect(parsed).toHaveProperty('children')
      expect(parsed.children.length).toBeGreaterThan(0)

      const addedNode = parsed.children.find(node => node.type === 'added')
      expect(addedNode).toBeDefined()
      expect(addedNode.type).toBe('added')

      const deletedNodes = parsed.children.filter(
        node => node.type === 'deleted',
      )
      expect(deletedNodes.length).toBeGreaterThan(0)
    })

    it('should throw error for unknown format', () => {
      const file1 = join(__dirname, '../__fixtures__/nested1.json')
      const file2 = join(__dirname, '../__fixtures__/nested2.json')

      expect(() => genDiff(file1, file2, 'unknown')).toThrow(
        'Unknown format \'unknown\'',
      )
    })
  })

  describe('Formatter architecture', () => {
    it('should use formatters from separate modules with nested structures', () => {
      const file1 = join(__dirname, '../__fixtures__/nested1.json')
      const file2 = join(__dirname, '../__fixtures__/nested2.json')

      // Test that all formatters work independently
      const stylish = genDiff(file1, file2, 'stylish')
      const plain = genDiff(file1, file2, 'plain')
      const json = genDiff(file1, file2, 'json')

      expect(stylish).toContain('common: {')
      expect(plain).toContain('Property \'common.follow\' was added')
      expect(json).toContain('"type":"added"')
    })

    it('should handle format selection correctly with nested structures', () => {
      const file1 = join(__dirname, '../__fixtures__/nested1.json')
      const file2 = join(__dirname, '../__fixtures__/nested2.json')

      // Test default format (stylish)
      const defaultResult = genDiff(file1, file2)
      expect(defaultResult).toContain('common: {')

      // Test explicit format selection
      const explicitStylish = genDiff(file1, file2, 'stylish')
      const explicitPlain = genDiff(file1, file2, 'plain')
      const explicitJson = genDiff(file1, file2, 'json')

      expect(defaultResult).toBe(explicitStylish)
      expect(explicitPlain).toContain('Property \'common.follow\' was added')
      expect(explicitJson).toContain('"type":"added"')
    })
  })

  describe('Edge cases', () => {
    it('should handle empty objects', () => {
      const file1 = join(__dirname, '../__fixtures__/empty1.json')
      const file2 = join(__dirname, '../__fixtures__/empty2.json')

      const result = genDiff(file1, file2, 'stylish')
      expect(result.trim()).toBe('{\n\n}')
    })
  })
})
