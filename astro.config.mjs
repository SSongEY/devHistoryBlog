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
  // 한글 slug에서 GitHub Pages의 non-ASCII 리다이렉트 버그(301 Location mojibake→404)를
  // 피하려면 내부 링크가 항상 trailing slash를 갖게 해서 리다이렉트를 안 타게 한다.
  trailingSlash: 'always',
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
