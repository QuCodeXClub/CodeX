const fs = require('fs');
const path = require('path');

function findReactComponents(dir, fileList = []) {
  const files = fs.readdirSync(dir);

  files.forEach(file => {
    const filePath = path.join(dir, file);
    const stat = fs.statSync(filePath);

    if (stat.isDirectory()) {
      if (file !== 'node_modules' && file !== 'dist') {
        findReactComponents(filePath, fileList);
      }
    } else if (file.endsWith('.jsx') || file.endsWith('.tsx')) {
      const content = fs.readFileSync(filePath, 'utf8');
      // Look for function components or arrow function components
      // const MyComponent = () =>
      // function MyComponent()
      // export const MyComponent = () =>
      // export function MyComponent()
      
      const componentRegex = /(?:export\s+(?:default\s+)?)?(?:const|function|let|var)\s+([A-Z][a-zA-Z0-9]*)\s*(?:=|=>|\()/g;
      
      let match;
      const components = new Set();
      while ((match = componentRegex.exec(content)) !== null) {
        components.add(match[1]);
      }

      if (components.size > 1) {
        fileList.push({
          file: filePath,
          components: Array.from(components)
        });
      }
    }
  });

  return fileList;
}

const results = findReactComponents(path.join(__dirname, 'src'));
console.log(JSON.stringify(results, null, 2));
