const fs = require('fs');
const path = require('path');

const files = [
    'src/app/layout.tsx',
    'src/app/page.tsx',
    'src/app/products/page.tsx',
    'src/app/products/[id]/page.tsx',
    'src/components/Navbar.tsx',
    'src/components/ProductCard.tsx',
    'src/app/cart/page.tsx',
    'src/app/login/page.tsx',
    'src/app/register/page.tsx',
    'src/app/profile/page.tsx',
    'src/app/profile/LogoutButton.tsx',
    'src/app/products/[id]/AddToCartButton.tsx'
];

let globalCssAppends = '\n/* Component Styles */\n';

for (const file of files) {
    const filePath = path.join(__dirname, file);
    if (!fs.existsSync(filePath)) continue;

    let content = fs.readFileSync(filePath, 'utf-8');

    // Exclude style jsx from globals.css
    const styleRegex = /<style jsx>\{`([\s\S]*?)`\}<\/style>/g;
    let match;

    while ((match = styleRegex.exec(content)) !== null) {
        globalCssAppends += match[1] + '\n';
    }

    // Remove the style block from the file
    const newContent = content.replace(/<style jsx>\{`[\s\S]*?`\}<\/style>/g, '');
    if (content !== newContent) {
        fs.writeFileSync(filePath, newContent, 'utf-8');
        console.log(`Removed styled-jsx from ${file}`);
    }
}

const globalsPath = path.join(__dirname, 'src/app/globals.css');
fs.appendFileSync(globalsPath, globalCssAppends, 'utf-8');
console.log('Appended to globals.css');
