/**
 * content.js
 *
 * 作用：content.js 内容脚本是插入到网页中的脚本文件，用于与当前页面进行交互。
 * 使用场景：当您需要向页面注入特定的 JavaScript 或修改页面的样式时，可以使用 content.js。它通常用于在页面上执行操作、捕获事件，或者与页面的 DOM 元素进行交互。
 * 示例用途：根据所访问页面的内容，自动填充表单、操作 DOM 元素、监听页面事件等。
 *
 */
window.onload = function () {
    // var links = document.getElementsByTagName('a');
    // for(var i = 0; i < links.length; i++) {
    //   links[i].style.color = 'red';
    // }
    // document.querySelector("#mainContainer .wiki-tree-wrap").addEventListener("click", (event) => {
    //     console.log("元素：", event.target);
    // });
    console.log("height", $("#mainContainer").height());
    $("#mainContainer").click((e) => {
        const cutCls = e.target.className;
        console.log("e:", cutCls);
        const txt2 = $("<p></p>").text("添加测试文本-2。");
        if (cutCls === "tree-title-content") {
            $(e.target).append('asdsd');
        }
    });
};
