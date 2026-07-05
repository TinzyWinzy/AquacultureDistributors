const fs = require('fs');
const path = require('path');

const dir = path.join(__dirname, 'src', 'components', 'customer');
const files = fs.readdirSync(dir).filter(f => f.endsWith('.tsx'));

const replacements = [
  { from: /text-white/g, to: 'text-brand-navy' },
  { from: /text-slate-200/g, to: 'text-slate-700' },
  { from: /text-slate-300/g, to: 'text-slate-600' },
  { from: /text-slate-400/g, to: 'text-slate-500' },
  { from: /text-slate-500/g, to: 'text-slate-400' },
  { from: /bg-white\/5/g, to: 'bg-white' },
  { from: /bg-white\/10/g, to: 'bg-slate-50' },
  { from: /border-white\/10/g, to: 'border-slate-200' },
  { from: /border-white\/20/g, to: 'border-brand-gold/30' },
  { from: /bg-brand-aqua\/20/g, to: 'bg-brand-gold/20' },
  { from: /text-brand-aqua/g, to: 'text-brand-gold' },
  { from: /border-brand-aqua\/50/g, to: 'border-brand-gold/50' },
];

for (const file of files) {
  // Skip LandingPage as it was already manually done
  if (file === 'LandingPage.tsx') continue;
  
  const filePath = path.join(dir, file);
  let content = fs.readFileSync(filePath, 'utf8');
  
  let original = content;
  for (const rep of replacements) {
    content = content.replace(rep.from, rep.to);
  }
  
  if (content !== original) {
    fs.writeFileSync(filePath, content);
    console.log(`Updated ${file}`);
  }
}
