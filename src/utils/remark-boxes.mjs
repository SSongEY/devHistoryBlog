import { visit } from 'unist-util-visit';

// 순수 .md 안에서 커스텀 박스를 쓰기 위한 디렉티브 → HTML 변환.
// 사용 예:
//   :::callout{type="think" title="왜 하필 Beta?"}
//   본문 **마크다운** 그대로 …
//   :::
//   :::formula{big}
//   Beta(<span class="var">α</span>, <span class="var">β</span>)
//   :::
//   :::analogy   / :::card
//
// (MDX import 없이 .md만으로 기존 디자인 컴포넌트와 동일한 결과)

const MAP = {
  callout: (attrs) => {
    const type = attrs.type && attrs.type !== 'default' ? ` ${attrs.type}` : '';
    return { className: `callout${type}`, title: attrs.title };
  },
  formula: (attrs) => ({ className: attrs.big !== undefined ? 'formula big' : 'formula' }),
  analogy: () => ({ className: 'analogy' }),
  card: () => ({ className: 'card' }),
};

export function remarkBoxes() {
  return (tree) => {
    visit(tree, (node) => {
      if (node.type !== 'containerDirective') return;
      const build = MAP[node.name];
      if (!build) return;

      const attrs = node.attributes || {};
      const cfg = build(attrs);
      const data = node.data || (node.data = {});
      data.hName = 'div';
      data.hProperties = { className: cfg.className };

      // title 이 있으면 <div class="k">…</div> 를 맨 앞에 삽입
      if (cfg.title) {
        node.children.unshift({
          type: 'paragraph',
          data: { hName: 'div', hProperties: { className: 'k' } },
          children: [{ type: 'text', value: cfg.title }],
        });
      }
    });
  };
}
