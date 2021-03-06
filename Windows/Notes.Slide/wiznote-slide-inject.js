function initReveal() {
    Reveal.initialize({
        controls: true,
        progress: true,
        history: true,
        center: true,

        theme: Reveal.getQueryHash().theme, // available themes are in /css/theme
        transition: Reveal.getQueryHash().transition || 'default', // default/cube/page/concave/zoom/linear/fade/none

        // Parallax scrolling
        // parallaxBackgroundImage: 'https://s3.amazonaws.com/hakim-static/reveal-js/reveal-parallax-1.jpg',
        // parallaxBackgroundSize: '2100px 900px',

        // Optional libraries used to extend on reveal.js
        // dependencies: [
        //     { src: 'lib/js/classList.js', condition: function() { return !document.body.classList; } },
        //     { src: 'plugin/markdown/marked.js', condition: function() { return !!document.querySelector( '[data-markdown]' ); } },
        //     { src: 'plugin/markdown/markdown.js', condition: function() { return !!document.querySelector( '[data-markdown]' ); } },
        //     { src: 'plugin/highlight/highlight.js', async: true, callback: function() { hljs.initHighlightingOnLoad(); } },
        //     { src: 'plugin/zoom-js/zoom.js', async: true, condition: function() { return !!document.body.classList; } },
        //     { src: 'plugin/notes/notes.js', async: true, condition: function() { return !!document.body.classList; } }
        // ]
    });
}
function initSlideContent() {

    // // //字符串处理section标签
    // var html = document.body.innerHTML;
    // // for(var i = 0; i < ) {

    // // }
    // //处理带有div或者p的标签
    // var section = {
    //     start: /(<(div|p)>)*\[section\](<\/(div|p)>)*/g,
    //     end: /(<(div|p)>)*\[\/section\](<\/(div|p)>)*/g
    // };

    // //处理不带div和p的标签
    // // var sectionNoTag = {
    // //     start: /\[section\]/g,
    // //     end: /\[\/section\]/g
    // // };
    // html = html.replace(section.start, '<section>');
    // html = html.replace(section.end, '</section>');
    // // html = html.replace(sectionNoTag.start, '<section>');
    // // html = html.replace(sectionNoTag.end, '</section>');

    // document.body.innerHTML = html;
    //增加slides节点
    $('body').children().wrapAll('<div class="reveal"><div class="slides"></div></div>');
    //解析section节点
    initReveal();
}

function initSlide() {
    if (jQuery) {
        initSlideContent();
        document.body.setAttribute("wiz_reveal_inited", "true");
    } else {
        setTimeout(initSlide, 100);
    }
}
initSlide();