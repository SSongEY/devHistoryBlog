(window.webpackJsonp=window.webpackJsonp||[]).push([[25],{JX7q:function(e,t,n){"use strict";function a(e){if(void 0===e)throw new ReferenceError("this hasn't been initialised - super() hasn't been called");return e}n.d(t,"a",(function(){return a}))},RPjP:function(e,t,n){"use strict";e.exports=n("SLms")},SLms:function(e,t,n){"use strict";Object.defineProperty(t,"__esModule",{value:!0});var a=Object.assign||function(e){for(var t=1;t<arguments.length;t++){var n=arguments[t];for(var a in n)Object.prototype.hasOwnProperty.call(n,a)&&(e[a]=n[a])}return e},r=function(){function e(e,t){for(var n=0;n<t.length;n++){var a=t[n];a.enumerable=a.enumerable||!1,a.configurable=!0,"value"in a&&(a.writable=!0),Object.defineProperty(e,a.key,a)}}return function(t,n,a){return n&&e(t.prototype,n),a&&e(t,a),t}}(),i=s(n("q1tI")),o=s(n("17x9"));function s(e){return e&&e.__esModule?e:{default:e}}function l(e,t){if(!(e instanceof t))throw new TypeError("Cannot call a class as a function")}function u(e,t){if(!e)throw new ReferenceError("this hasn't been initialised - super() hasn't been called");return!t||"object"!=typeof t&&"function"!=typeof t?e:t}var c=["shortname","identifier","title","url","category_id","onNewComment","language"],p=!1;function d(e,t){var n=t.onNewComment,a=t.language,r=function(e,t){var n={};for(var a in e)t.indexOf(a)>=0||Object.prototype.hasOwnProperty.call(e,a)&&(n[a]=e[a]);return n}(t,["onNewComment","language"]);for(var i in r)e.page[i]=r[i];e.language=a,n&&(e.callbacks={onNewComment:[n]})}var f=function(e){function t(){return l(this,t),u(this,(t.__proto__||Object.getPrototypeOf(t)).apply(this,arguments))}return function(e,t){if("function"!=typeof t&&null!==t)throw new TypeError("Super expression must either be null or a function, not "+typeof t);e.prototype=Object.create(t&&t.prototype,{constructor:{value:e,enumerable:!1,writable:!0,configurable:!0}}),t&&(Object.setPrototypeOf?Object.setPrototypeOf(e,t):e.__proto__=t)}(t,e),r(t,[{key:"componentDidMount",value:function(){this.loadDisqus()}},{key:"componentDidUpdate",value:function(){this.loadDisqus()}},{key:"shouldComponentUpdate",value:function(e,t){return e.identifier!==this.props.identifier}},{key:"render",value:function(){var e=this,t=Object.keys(this.props).reduce((function(t,n){return c.some((function(e){return e===n}))?t:a({},t,function(e,t,n){return t in e?Object.defineProperty(e,t,{value:n,enumerable:!0,configurable:!0,writable:!0}):e[t]=n,e}({},n,e.props[n]))}),{});return i.default.createElement("div",t,i.default.createElement("div",{id:"disqus_thread"}))}},{key:"addDisqusScript",value:function(){if(!p){var e=this.disqus=document.createElement("script"),t=document.getElementsByTagName("head")[0]||document.getElementsByTagName("body")[0];e.async=!0,e.type="text/javascript",e.src="//"+this.props.shortname+".disqus.com/embed.js",t.appendChild(e),p=!0}}},{key:"loadDisqus",value:function(){var e=this,t={};c.forEach((function(n){"shortname"!==n&&e.props[n]&&(t[n]=e.props[n])})),"undefined"!=typeof DISQUS?DISQUS.reset({reload:!0,config:function(){d(this,t),this.page.url=this.page.url.replace(/#/,"")+"#!newthread"}}):(window.disqus_config=function(){d(this,t)},this.addDisqusScript())}}]),t}(i.default.Component);f.displayName="DisqusThread",f.propTypes={id:o.default.string,shortname:o.default.string.isRequired,identifier:o.default.string,title:o.default.string,url:o.default.string,category_id:o.default.string,onNewComment:o.default.func,language:o.default.string},f.defaultProps={url:"undefined"==typeof window?null:window.location.href},t.default=f},WAk8:function(e,t,n){},reCm:function(e,t,n){"use strict";n.r(t);var a=n("dI71"),r=n("q1tI"),i=n.n(r),o=n("TJpk"),s=n.n(o),l=n("ntAx"),u=n("Wbzz"),c=n("wd/R"),p=n.n(c),d=n("JX7q"),f=n("RPjP"),m=n.n(f),h=function(e){function t(t){var n;return(n=e.call(this,t)||this).state={toasts:[]},n.notifyAboutComment=n.notifyAboutComment.bind(Object(d.a)(n)),n.onSnackbarDismiss=n.onSnackbarDismiss.bind(Object(d.a)(n)),n}Object(a.a)(t,e);var n=t.prototype;return n.onSnackbarDismiss=function(){var e=this.state.toasts.slice(1);this.setState({toasts:e})},n.notifyAboutComment=function(){var e=this.state.toasts.slice();e.push({text:"New comment available!!"}),this.setState({toasts:e})},n.render=function(){var e=this.props,t=e.postNode,n=e.siteMetadata;if(!n.disqusShortname)return null;var a=t.frontmatter,r=n.url+t.fields.slug;return i.a.createElement(m.a,{shortname:n.disqusShortname,identifier:a.title,title:a.title,url:r,category_id:a.category_id,onNewComment:this.notifyAboutComment})},t}(r.Component),g=(n("WAk8"),function(e){function t(){return e.apply(this,arguments)||this}return Object(a.a)(t,e),t.prototype.render=function(){var e=this.props.data.site.siteMetadata,t=e.subtitle,n=(e.author,this.props.data.markdownRemark),a=n.fields.tagSlugs,r=(u.Link,i.a.createElement("div",{className:"post-single__tags"},i.a.createElement("ul",{className:"post-single__tags-list"},a&&a.map((function(e,t){return i.a.createElement("li",{className:"post-single__tags-list-item",key:e},i.a.createElement(u.Link,{to:e,className:"post-single__tags-list-item-link"},n.frontmatter.tags[t]))}))))),o=i.a.createElement("div",null,i.a.createElement(h,{postNode:n,siteMetadata:this.props.data.site.siteMetadata}));return i.a.createElement("div",null,i.a.createElement("div",{className:"post-single"},i.a.createElement("div",{className:"post-single__inner"},i.a.createElement("h1",{className:"post-single__title"},n.frontmatter.title),i.a.createElement("div",{className:"post-single__date"},p()(n.frontmatter.date).format(" MMMM DD, YYYY").toUpperCase()),i.a.createElement("div",{className:"post-single__body",dangerouslySetInnerHTML:{__html:n.html}})),i.a.createElement("div",{className:"post-single__footer"},r,i.a.createElement("hr",null),i.a.createElement("p",{className:"post-single__footer-text"},t),o)))},t}(i.a.Component)),y=function(e){function t(){return e.apply(this,arguments)||this}return Object(a.a)(t,e),t.prototype.render=function(){var e=this.props.data.site.siteMetadata,t=e.title,n=e.subtitle,a=this.props.data.markdownRemark.frontmatter,r=a.title,o=a.description,u=null!==o?o:n;return i.a.createElement(l.a,null,i.a.createElement("div",null,i.a.createElement(s.a,null,i.a.createElement("title",null,r+" - "+t),i.a.createElement("meta",{name:"description",content:u})),i.a.createElement(g,this.props)))},t}(i.a.Component);t.default=y}}]);
//# sourceMappingURL=component---src-templates-post-template-jsx-2fe69c6e5bee11aca8f3.js.map