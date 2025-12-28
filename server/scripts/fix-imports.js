import { readdir, readFile, writeFile, stat } from 'fs/promises';
import { join, dirname, relative, resolve } from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const distDir = resolve(__dirname, '../dist');

async function getAllFiles(dir) {
  const files = [];
  const entries = await readdir(dir, { withFileTypes: true });
  
  for (const entry of entries) {
    const fullPath = join(dir, entry.name);
    if (entry.isDirectory()) {
      files.push(...await getAllFiles(fullPath));
    } else if (entry.isFile() && entry.name.endsWith('.js')) {
      files.push(fullPath);
    }
  }
  
  return files;
}

async function fixImports(content, filePath) {
  // Match relative imports (./ or ../) that don't already have .js or .json extension
  const importRegex = /from\s+['"](\.\.?\/[^'"]*?)['"]/g;
  
  let result = content;
  const matches = [...content.matchAll(importRegex)];
  
  for (const match of matches) {
    const importPath = match[1];
    
    // Don't modify if it already has an extension (.js, .json, .mjs, etc.)
    if (/\.(js|json|mjs|cjs)$/.test(importPath)) {
      continue;
    }
    
    // Check if the import path points to a directory with an index.js
    const importDir = resolve(dirname(filePath), importPath);
    let newImportPath = importPath;
    
    try {
      const stats = await stat(importDir);
      if (stats.isDirectory()) {
        // It's a directory, check for index.js
        const indexPath = join(importDir, 'index.js');
        try {
          await stat(indexPath);
          newImportPath = importPath + '/index.js';
        } catch {
          // No index.js, just add .js to the path
          newImportPath = importPath + '.js';
        }
      } else {
        // It's a file, add .js extension
        newImportPath = importPath + '.js';
      }
    } catch {
      // Path doesn't exist, assume it's a file and add .js
      newImportPath = importPath + '.js';
    }
    
    result = result.replace(match[0], match[0].replace(importPath, newImportPath));
  }
  
  return result;
}

async function processFile(filePath) {
  const content = await readFile(filePath, 'utf-8');
  const fixed = await fixImports(content, filePath);
  
  if (content !== fixed) {
    await writeFile(filePath, fixed, 'utf-8');
    console.log(`Fixed imports in: ${relative(distDir, filePath)}`);
  }
}

async function main() {
  try {
    const files = await getAllFiles(distDir);
    await Promise.all(files.map(processFile));
    console.log('Import fixes complete!');
  } catch (error) {
    console.error('Error fixing imports:', error);
    process.exit(1);
  }
}

main();

