(window.webpackJsonp=window.webpackJsonp||[]).push([[13],{"/3mp":function(e,t,a){},"1Jpo":function(e,t,a){"use strict";var n=a("dI71"),s=a("q1tI"),r=a.n(s),o=a("Wbzz"),c=a("wd/R"),l=a.n(c),i=(a("/3mp"),function(e){function t(){return e.apply(this,arguments)||this}return Object(n.a)(t,e),t.prototype.render=function(){var e=this.props.data.node.frontmatter,t=e.title,a=e.date,n=e.category,s=e.type,c=e.description,i=this.props.data.node.fields,m=i.slug,p=i.categorySlug;return r.a.createElement("div",{className:"post"},r.a.createElement("div",{className:"post__meta"},r.a.createElement("time",{className:"post__meta-time",dateTime:l()(a).format("MMMM D, YYYY")},l()(a).format("MMMM D YYYY")),r.a.createElement("span",{className:"post__meta-divider"}),r.a.createElement("span",{className:"post__meta-type"},s," / "),r.a.createElement("span",{className:"post__meta-category",key:p},r.a.createElement(o.Link,{to:p,className:"post__meta-category-link"},n))),r.a.createElement("h2",{className:"post__title"},r.a.createElement(o.Link,{className:"post__title-link",to:m},t)),r.a.createElement("p",{className:"post__description"},c),r.a.createElement(o.Link,{className:"post__readmore",to:m},"Read"))},t}(r.a.Component));t.a=i},CwNb:function(e,t,a){"use strict";a.r(t);var n=a("dI71"),s=a("q1tI"),r=a.n(s),o=a("TJpk"),c=a.n(o),l=a("ntAx"),i=a("1Jpo"),m=a("kfNp"),p=function(e){function t(){return e.apply(this,arguments)||this}return Object(n.a)(t,e),t.prototype.render=function(){var e=[],t=this.props.data.site.siteMetadata,a=t.title,n=t.subtitle;return this.props.data.allMarkdownRemark.edges.forEach((function(t){e.push(r.a.createElement(i.a,{data:t,key:t.node.fields.slug}))})),r.a.createElement(l.a,null,r.a.createElement("div",null,r.a.createElement(c.a,null,r.a.createElement("title",null,a),r.a.createElement("meta",{name:"description",content:n})),r.a.createElement(m.a,this.props),r.a.createElement("div",{className:"content"},r.a.createElement("div",{className:"content__inner"},e))))},t}(r.a.Component);t.default=p}}]);
//# sourceMappingURL=component---src-pages-gatsby-index-jsx-78a22b0e4a768aff1fca.js.map