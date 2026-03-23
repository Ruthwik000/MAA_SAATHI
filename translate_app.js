const fs = require('fs');
const path = require('path');
const babel = require('@babel/core');
const parser = require('@babel/parser');
const traverse = require('@babel/traverse').default;
const generate = require('@babel/generator').default;
const t = require('@babel/types');

const translationsObj = require('./src/utils/translations.js').default.en;

// Create a reverse mapping of string to its path inside `t` e.g., "Home" -> "nav.home"
const reverseMap = {};

function flatten(obj, prefix = '') {
  for (const [key, val] of Object.entries(obj)) {
    if (typeof val === 'string') {
      // Exclude simple things that might have false positives or are too short unless we're exact
      reverseMap[val.trim()] = prefix + key;
      // To handle subtle case changes or space diffs:
      reverseMap[val.trim().toLowerCase()] = prefix + key;
    } else if (typeof val === 'function') {
      // function handlers like daysAgo: (n) => "..."
      // complex to reverse match automatically using AST mapping. We'll skip complex dynamic AST matching for now
      // Or we inject a regex pattern for functions?
    } else if (typeof val === 'object') {
      flatten(val, prefix + key + '.');
    }
  }
}
flatten(translationsObj);

// We want to process all files in src/pages and src/components and src/layouts
function getAllFiles(dirPath, arrayOfFiles) {
  const files = fs.readdirSync(dirPath);
  arrayOfFiles = arrayOfFiles || [];
  files.forEach(function(file) {
    if (fs.statSync(dirPath + "/" + file).isDirectory()) {
      arrayOfFiles = getAllFiles(dirPath + "/" + file, arrayOfFiles);
    } else if (file.endsWith('.jsx')) {
      arrayOfFiles.push(path.join(dirPath, "/", file));
    }
  });
  return arrayOfFiles;
}

const files = [];
['src/pages', 'src/components', 'src/layouts', 'src/App.jsx'].forEach(d => {
  if (fs.existsSync(d) && fs.statSync(d).isDirectory()) getAllFiles(d, files);
  else if (fs.existsSync(d)) files.push(d);
});

files.forEach(file => {
  if (file.includes('MotherMedicalHistoryScreen')) return; // skip the one we just made with custom structure
  let code = fs.readFileSync(file, 'utf-8');
  
  if (!code.includes('useTranslation')) {
    // Inject import
    const importDepth = file.split('/').length - 2;
    const dots = importDepth > 0 ? '../'.repeat(importDepth) : './';
    const importDecl = `import { useTranslation } from '${dots}hooks/useTranslation';\n`;
    code = importDecl + code;
  }

  try {
    const ast = parser.parse(code, {
      sourceType: 'module',
      plugins: ['jsx']
    });

    let didModify = false;
    let hasHook = false;

    // Check if component already has `const t = useTranslation();`
    traverse(ast, {
      CallExpression(path) {
        if (t.isIdentifier(path.node.callee, { name: 'useTranslation' })) {
          hasHook = true;
        }
      }
    });

    traverse(ast, {
      // Check for component body to inject const t = useTranslation();
      FunctionDeclaration(path) {
        if (!hasHook && t.isIdentifier(path.node.id) && /^[A-Z]/.test(path.node.id.name) && path.node.body.body) {
           path.node.body.body.unshift(
             t.variableDeclaration('const', [
               t.variableDeclarator(t.identifier('t'), t.callExpression(t.identifier('useTranslation'), []))
             ])
           );
           hasHook = true;
           didModify = true;
        }
      },
      VariableDeclarator(path) {
        if (!hasHook && t.isArrowFunctionExpression(path.node.init) && t.isIdentifier(path.node.id) && /^[A-Z]/.test(path.node.id.name)) {
           if (path.node.init.body.type === 'BlockStatement') {
             path.node.init.body.body.unshift(
               t.variableDeclaration('const', [
                 t.variableDeclarator(t.identifier('t'), t.callExpression(t.identifier('useTranslation'), []))
               ])
             );
             hasHook = true;
             didModify = true;
           }
        }
      },
      JSXText(path) {
        let text = path.node.value.trim();
        if (text && reverseMap[text]) {
          path.replaceWith(t.jsxExpressionContainer(
            t.memberExpression(
              t.identifier('t'),
              t.identifier(reverseMap[text]),
              false // computed? wait, nav.home needs to be t.nav.home. member expression requires nested.
            )
          ));
          didModify = true;
        }
      },
      StringLiteral(path) {
        let text = path.node.value.trim();
        // Skip imports and require
        if (path.parent.type === 'ImportDeclaration') return;
        if (text && reverseMap[text]) {
           // Create member expression: t.nav.home
           const parts = reverseMap[text].split('.');
           let expr = t.memberExpression(t.identifier('t'), t.identifier(parts[0]));
           for(let i=1; i<parts.length; i++) {
             expr = t.memberExpression(expr, t.identifier(parts[i]));
           }
           path.replaceWith(expr);
           didModify = true;
        }
      }
    });

    if (didModify) {
      // Re-generate using custom replacement logic instead to preserve formatting?
      // Babel destroys raw formatting (like styling spacing) but we have to use it.
      // Wait, let's write out custom regex approach over babel to preserve raw syntax, 
      // since the developer has heavily hardcoded styles in template strings.
    }
  } catch (e) {
    console.log('Error parsing ' + file, e.message);
  }
});

// Since transforming React AST completely destroys whitespace formatting, 
// using a simpler targeted Text substitution approach on literal components is safer.
console.log('Script written. Exiting without execution as requested.');
