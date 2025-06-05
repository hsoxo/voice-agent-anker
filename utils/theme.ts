import resolveConfig from 'tailwindcss/resolveConfig';
import tailwindConfig from './tailwind'; // 路径根据你的项目结构调整

const fullConfig = resolveConfig(tailwindConfig);

export const theme = fullConfig.theme;
