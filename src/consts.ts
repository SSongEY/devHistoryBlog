export const SITE_TITLE = 'EunYoung 작업 기록 블로그';
export const SITE_DESCRIPTION = '업무·학습·트러블슈팅 기록';

/**
 * base 경로(/devHistoryBlog/)를 붙여 내부 링크를 만든다.
 * Astro는 임의의 <a href>에 base를 자동으로 붙이지 않으므로 내부 링크엔 항상 이 헬퍼를 쓴다.
 */
export function href(path = ''): string {
  const b = import.meta.env.BASE_URL.replace(/\/$/, '');
  if (!path || path === '/') return b + '/';
  const clean = (path.startsWith('/') ? path : '/' + path).replace(/\/$/, '');
  // 항상 trailing slash (GitHub Pages 한글 경로 리다이렉트 버그 회피)
  return b + clean + '/';
}

/** 게시글 slug → 상세 URL */
export function postUrl(slug: string): string {
  return href(`/posts/${slug}`);
}

/** 태그명 → 태그 페이지 URL */
export function tagUrl(tag: string): string {
  return href(`/tags/${encodeURIComponent(tag)}`);
}
