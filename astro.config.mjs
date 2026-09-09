// @ts-check
import { defineConfig } from 'astro/config';
import mdx from '@astrojs/mdx';
import pagefind from 'astro-pagefind';
import remarkDirective from 'remark-directive';
import { remarkBoxes } from './src/utils/remark-boxes.mjs';

// 프로젝트 페이지: https://SSongEY.github.io/devHistoryBlog/
// (user page가 아니라 repo명이 devHistoryBlog 이므로 base 경로가 필요)
export default defineConfig({
  site: 'https://SSongEY.github.io',
  base: '/devHistoryBlog',
  trailingSlash: 'ignore',
  integrations: [mdx(), pagefind()],
  markdown: {
    // remarkDirective 가 `:::callout` 구문을 파싱하고, remarkBoxes 가 스타일 div로 변환.
    // → 순수 .md 에서 커스텀 박스 사용 가능 (MDX import 불필요)
    remarkPlugins: [remarkDirective, remarkBoxes],
    shikiConfig: {
      theme: 'one-dark-pro',
      wrap: true,
    },
  },
});
