import { join } from 'path';
import { promises as fs } from 'fs';
import { icons } from 'feather-icons';
import _ from 'lodash';

const template = (contents, name) => {
  return `
export const ${name} = forwardRef<HTMLSpanElement, IconProps>((props, ref) => {
  return <Icon {...props}>${contents}</Icon>;
});`;
};

const pascalCase = (str) => _.upperFirst(_.camelCase(str));

const base = `import React, { forwardRef } from 'react';\nimport {Icon,IconProps} from './Icon';`;

(async () => {
  let components = [];

  for (let key in icons) {
    let icon = icons[key];
    let component = template(icon.contents, pascalCase(icon.name));
    components.push(component.trim());
  }

  let fileContent = [base, ...components].join('\n\n') + '\n';
  await fs.writeFile(join(process.cwd(), './src/Icons.tsx'), fileContent);
})();
