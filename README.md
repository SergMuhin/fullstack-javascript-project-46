[![Actions Status](https://github.com/SergMuhin/gendiff/workflows/hexlet-check/badge.svg)](https://github.com/SergMuhin/gendiff/actions)

### Tests and linter status:
[![Actions Status](https://github.com/SergMuhin/gendiff/actions/workflows/hexlet-check.yml/badge.svg)](https://github.com/SergMuhin/gendiff/actions)

## Description

**gendiff** - a utility for comparing configuration files and showing differences.

Supports:
- JSON and YAML file formats
- Three output formats: stylish (default), plain, and JSON
- Nested object comparison
- Command line interface and library usage

## Installation

```bash
npm install -g gendiff
```

## Usage

### CLI

```bash
gendiff [options] <filepath1> <filepath2>

Options:
  -V, --version        output the version number
  -f, --format <type>  output format (default: "stylish")
  -h, --help           display help for command
```

### Library

```javascript
import genDiff from 'gendiff';

const diff = genDiff('file1.json', 'file2.json', 'stylish');
console.log(diff);
```

## Examples

### Stylish format (default)

```bash
$ gendiff file1.json file2.json
{
  - follow: false
    host: hexlet.io
  - proxy: 123.234.53.22
  - timeout: 50
  + timeout: 20
  + verbose: true
}
```

### Plain format

```bash
$ gendiff file1.json file2.json -f plain
Property 'follow' was removed
Property 'proxy' was removed
Property 'timeout' was updated. From 50 to 20
Property 'verbose' was added with value: true
```

### JSON format

```bash
$ gendiff file1.json file2.json -f json
{"type":"root","children":[{"key":"follow","type":"deleted","value":false},{"key":"host","type":"unchanged","value":"hexlet.io"},{"key":"proxy","type":"deleted","value":"123.234.53.22"},{"key":"timeout","type":"changed","value1":50,"value2":20},{"key":"verbose","type":"added","value":true}]}
```

## ASCII Art Example

```
    ╭─────────────────────────────────────╮
    │                                     │
    │  📁 file1.json    📁 file2.json    │
    │  ┌─────────────┐  ┌─────────────┐  │
    │  │ host: ...   │  │ host: ...   │  │
    │  │ timeout: 50 │  │ timeout: 20 │  │
    │  │ proxy: ...  │  │ verbose: ✓  │  │
    │  │ follow: ✗   │  │             │  │
    │  └─────────────┘  └─────────────┘  │
    │           │              │         │
    │           └──────┬───────┘         │
    │                  ▼                 │
    │         🔍 gendiff analysis        │
    │                                     │
    │  {                                  │
    │    - follow: false                  │
    │      host: hexlet.io                │
    │    - proxy: 123.234.53.22          │
    │    - timeout: 50                   │
    │    + timeout: 20                   │
    │    + verbose: true                 │
    │  }                                  │
    │                                     │
    ╰─────────────────────────────────────╯
```

## Development

```bash
# Install dependencies
npm install

# Run tests
npm test

# Run linter
npm run lint

# Run tests with coverage
npm run test:coverage
```