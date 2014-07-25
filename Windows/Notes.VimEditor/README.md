## Vim-Markdown-Editor

[Vim-Markdown-Editor]() is a vim-binding Markdown editor plugin for Wiz powered by [CodeMirror](https://github.com/marijnh/codemirror).

- New `.md` file and select vim-editor to edit;
- Type some Markdown text in the left window;
- Press `Ctrl-P` to toggle preview window;
- Command `:w` to save document;
- Close edit window and then Markdown file is rendered by Wiz Markdown plugin.

## Features

- Markdown syntax highlighting;
- live preview (with Mathjax $\alpha \beta \gamma$);
- vim key-binding;
    > `ESC` is handled by Wiz, so please use `Ctrl-[` to quit insert mode.
    
- code folding;
- sync scroll;

## Todo

- Insert local images;
- Change themes;
- ...

## Changes in CodeMirror
- Map `<C-q>` to visual mode;
    ```
    229: { keys: ['<C-q>'], type: 'action', action: 'toggleVisualMode',
           actionArgs: { blockwise: true }},
    ```
- Handle Chinese characters;
    ```
    4476: function onKeyEventTargetKeyDown(e) {
            if (e.keyCode == 229)
            return;
            ...}
    ```

