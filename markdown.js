//mermaid
const mermaidChart = (code) => {
  try {
    mermaid.parse(code)
    return `<div class="mermaid">${code}</div>`
  } catch ({ str, hash }) {
    return `<pre>${str}</pre>`
  }
}

const MermaidPlugin = (md, opts) => {
  md.mermaid = mermaid
  opts = opts || {
    theme: 'default'
  }
  mermaid.initialize(opts)

  const temp = md.renderer.rules.fence.bind(md.renderer.rules)
  md.renderer.rules.fence = (tokens, idx, options, env, slf) => {
    const token = tokens[idx]
    const code = token.content.trim()
    if (token.info === 'mermaid') {
      return mermaidChart(code)
    }
    const firstLine = code.split(/\n/)[0].trim()
    if (firstLine === 'gantt' || firstLine === 'sequenceDiagram' || firstLine.match(/^graph (?:TB|BT|RL|LR|TD);?$/)) {
      return mermaidChart(code)
    }
    return temp(tokens, idx, options, env, slf)
  }
}
//fileinit
var markdown_path = getQueryVariable('f');
if(window.location.pathname.endsWith('.md')){
  markdown_path = window.location.pathname;
}
var markdown_filename = markdown_path.split('/').slice(-1);
document.title = decodeURI(markdown_filename);

//markdownit init
var md = window.markdownit({
  html: true, //可以识别html
  linkify: true,//自动检测像链接的文本
  breaks: true,//回车换行
  typographer: true,//优化排版，标点
  //代码高亮
  highlight: function (str, lang) {
      if (lang && hljs.getLanguage(lang)) {
          try {
              return '<pre class="hljs"><code>' +
                  hljs.highlight(str,{language:lang, ignoreIllegals:true}).value +

                  '</code></pre>';
          } catch (__) {}
      }
      return '<pre class="hljs"><code>' + md.utils.escapeHtml(str) + '</code></pre>';
  }
})
.use(window.markdownitEmoji)
.use(window.markdownitDeflist)
.use(window.markdownitTaskLists)
.use(window.markdownitMark)
.use(MermaidPlugin)
.use(window.markdownitFootnote)
.use(window.markdownItAnchor, {
  permalink: false,
  permalinkBefore: false,
  permalinkSymbol: '#'
})
.use(window.markdownItTocDoneRight, {
  containerClass: 'toc',
  containerId: 'toc',
  listType: 'ul',
  listClass: 'mdlistClass',
  itemClass: 'mditemClass',
  linkClass: 'mdlinkClass',
  level:2,
  callback: function (html, ast) {
  //把目录单独列出来
      mdtoc.innerHTML = html;
      var tocsize = $("#toc a")
      for(var i = 0;i<tocsize.length;i++){
         mds.push(encodeURIComponent(tocsize[i].innerText.toLowerCase().replace(new RegExp(' ',"gm"),'-'))); 
      }
      len_mds = mds.length;
  }
})
.use(texmath, { engine: katex,
  delimiters: 'dollars',
  katexOptions: { macros: {"\\RR": "\\mathbb{R}"} } } )

.use(window.markdownitContainer, 'warning', {
  validate: function(params) {
    return params.trim() === 'warning'
  },
  render: (tokens, idx) => {
    if (tokens[idx].nesting === 1) {
      const icon = `<i class="markdown-it-vue-alert-icon markdown-it-vue-alert-icon-warning"><svg viewBox="64 64 896 896" data-icon="exclamation-circle" width="1em" height="1em" fill="currentColor" aria-hidden="true" class=""><path d="M512 64C264.6 64 64 264.6 64 512s200.6 448 448 448 448-200.6 448-448S759.4 64 512 64zm-32 232c0-4.4 3.6-8 8-8h48c4.4 0 8 3.6 8 8v272c0 4.4-3.6 8-8 8h-48c-4.4 0-8-3.6-8-8V296zm32 440a48.01 48.01 0 0 1 0-96 48.01 48.01 0 0 1 0 96z"></path></svg></i>`
      return `<div class="markdown-it-vue-alter markdown-it-vue-alter-warning">${icon}`
    } else {
      return '</div>'
    }
  }
})
.use(window.markdownitContainer, 'info', {
  validate: function(params) {
    return params.trim() === 'info'
  },
  render: (tokens, idx) => {
    if (tokens[idx].nesting === 1) {
      const icon = `<i class="markdown-it-vue-alert-icon markdown-it-vue-alert-icon-info"><svg viewBox="64 64 896 896" data-icon="info-circle" width="1em" height="1em" fill="currentColor" aria-hidden="true" class=""><path d="M512 64C264.6 64 64 264.6 64 512s200.6 448 448 448 448-200.6 448-448S759.4 64 512 64zm32 664c0 4.4-3.6 8-8 8h-48c-4.4 0-8-3.6-8-8V456c0-4.4 3.6-8 8-8h48c4.4 0 8 3.6 8 8v272zm-32-344a48.01 48.01 0 0 1 0-96 48.01 48.01 0 0 1 0 96z"></path></svg></i>`
      return `<div class="markdown-it-vue-alter markdown-it-vue-alter-info">${icon}`
    } else {
      return '</div>'
    }
  }
})
.use(window.markdownitContainer, 'success', {
  validate: function(params) {
    return params.trim() === 'success'
  },
  render: (tokens, idx) => {
    if (tokens[idx].nesting === 1) {
      const icon = `<i class="markdown-it-vue-alert-icon markdown-it-vue-alert-icon-success"><svg viewBox="64 64 896 896" data-icon="check-circle" width="1em" height="1em" fill="currentColor" aria-hidden="true" class=""><path d="M512 64C264.6 64 64 264.6 64 512s200.6 448 448 448 448-200.6 448-448S759.4 64 512 64zm193.5 301.7l-210.6 292a31.8 31.8 0 0 1-51.7 0L318.5 484.9c-3.8-5.3 0-12.7 6.5-12.7h46.9c10.2 0 19.9 4.9 25.9 13.3l71.2 98.8 157.2-218c6-8.3 15.6-13.3 25.9-13.3H699c6.5 0 10.3 7.4 6.5 12.7z"></path></svg></i>`
      return `<div class="markdown-it-vue-alter markdown-it-vue-alter-success">${icon}`
    } else {
      return '</div>'
    }
  }
})
.use(window.markdownitContainer, 'error', {
  validate: function(params) {
    return params.trim() === 'error'
  },
  render: (tokens, idx) => {
    if (tokens[idx].nesting === 1) {
      const icon = `<i class="markdown-it-vue-alert-icon markdown-it-vue-alert-icon-error"><svg viewBox="64 64 896 896" data-icon="close-circle" width="1em" height="1em" fill="currentColor" aria-hidden="true" class=""><path d="M512 64C264.6 64 64 264.6 64 512s200.6 448 448 448 448-200.6 448-448S759.4 64 512 64zm165.4 618.2l-66-.3L512 563.4l-99.3 118.4-66.1.3c-4.4 0-8-3.5-8-8 0-1.9.7-3.7 1.9-5.2l130.1-155L340.5 359a8.32 8.32 0 0 1-1.9-5.2c0-4.4 3.6-8 8-8l66.1.3L512 464.6l99.3-118.4 66-.3c4.4 0 8 3.5 8 8 0 1.9-.7 3.7-1.9 5.2L553.5 514l130 155c1.2 1.5 1.9 3.3 1.9 5.2 0 4.4-3.6 8-8 8z"></path></svg></i>`
      return `<div class="markdown-it-vue-alter markdown-it-vue-alter-error">${icon}`
    } else {
      return '</div>'
    }
  }
})
;

//getfile
$.get( markdown_path, function( data ) {
    var res = md.render(data);    
    //绑定滚动事件
    $(window).bind('scroll',update);
    document.getElementById("article").innerHTML = res;
    
    mermaid.init(undefined,document.querySelectorAll('.mermaid'))
    var hash = decodeURI(window.location.hash);
    if(hash){
        window.setTimeout(function(){window.location.href=hash} ,500);
    }
});


//highlight current title
//
var mds = [
]
var len_mds;
function update(){
  var scrollH = $(window).scrollTop();
  var j = 0;
  for(var i = 0;i<len_mds;i++){

    var mdHeight = document.getElementById(mds[i]).offsetTop;
    
    if(mdHeight < scrollH){
      j = i;
    }
  }

  navon(mds[j]);
}
 
//高亮导航菜单
function navon(id){
	$('.mditemClass').removeClass('navActive');
	$(".mditemClass [href='#"+id+"']").parent().addClass('navActive');

}
 
