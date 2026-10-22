import fs from 'fs';
import path from 'path';
import { ANDROID_KOTLIN_PROJECT } from '../src/data/androidKotlinProject.js';

console.log('Writing Android Kotlin project files to root filesystem...');

ANDROID_KOTLIN_PROJECT.forEach((file) => {
  const targetPath = path.resolve(file.path);
  const dir = path.dirname(targetPath);
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
  fs.writeFileSync(targetPath, file.content, 'utf8');
  console.log(`Wrote: ${file.path}`);
});

// Create basic gradlew executable script
const gradlewContent = `#!/bin/sh
exec gradle "$@"
`;
fs.writeFileSync(path.resolve('gradlew'), gradlewContent, { mode: 0o755 });
console.log('Wrote: gradlew');

console.log('All Android project and build files successfully written to filesystem.');
