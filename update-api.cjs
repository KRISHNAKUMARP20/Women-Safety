const fs = require('fs');
const path = require('path');

function walk(dir) {
  let results = [];
  const list = fs.readdirSync(dir);
  list.forEach(function(file) {
    file = path.join(dir, file);
    const stat = fs.statSync(file);
    if (stat && stat.isDirectory()) { 
      results = results.concat(walk(file));
    } else { 
      if (file.endsWith('.ts') || file.endsWith('.tsx')) results.push(file);
    }
  });
  return results;
}

const files = walk('./src');
files.forEach(file => {
  let content = fs.readFileSync(file, 'utf8');
  let original = content;
  
  content = content.replace(/fetch\(['"]\/(api\/.*?)['"]/g, 'fetch(`${import.meta.env.VITE_API_URL || \'\'}/$1`');
  content = content.replace(/EventSource\(['"]\/(api\/events)['"]\)/g, 'EventSource(`${import.meta.env.VITE_API_URL || \'\'}/$1`)');
  
  if (content !== original) {
    fs.writeFileSync(file, content);
    console.log('Updated ' + file);
  }
});
