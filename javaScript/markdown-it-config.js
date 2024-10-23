const MarkdownIt = require('markdown-it');  
const markdownItContainer = require('markdown-it-container');  

module.exports = function(hexo) {  
  hexo.extend.filter.register('before_generate', () => {  
    const md = new MarkdownIt({  
      html: true,  
      linkify: true,  
      typographer: true,  
    });  

    // 定义note容器  
    md.use(markdownItContainer, 'note', {  
      validate: function(params) {  
        return params.trim().match(/^note\s+(.*)$/);  
      },  
      render: function(tokens, idx) {  
        const m = tokens[idx].info.trim().match(/^note\s+(.*)$/);  
        if (tokens[idx].nesting === 1) {  
          return `<div class="note"><strong>${md.utils.escapeHtml(m[1])}</strong>\n`;  
        } else {  
          return '</div>\n';  
        }  
      },  
    });  

    // 定义一般容器处理  
    md.use(markdownItContainer, 'note', {  
      validate: function(params) {  
        return params.trim().match(/^!!!\s+(note)$/);  
      },  
      render: function(tokens, idx) {  
        if (tokens[idx].nesting === 1) {  
          return '<div class="note"><strong>注意事项:</strong>\n';  
        } else {  
          return '</div>\n';  
        }  
      },  
    });  

    // 注册markdown-it  
    hexo.extend.renderer.register('md', 'html', function(data) {  
      return md.render(data.text);  
    });  
  });  
};