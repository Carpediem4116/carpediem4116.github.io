# Aaron — Personal portfolio

全新静态个人网站，面向 GitHub Pages。无需 Hexo、构建工具或第三方服务。

## 内容

- 默认英文；右上角切换中文；浏览器记住上次选择。
- 机械臂项目介绍：根据公开仓库 `Carpediem4116/Robotic-Arm` 的英文说明编写，保留进行中状态。
- 可操作的机械臂概念草图；不是实际项目 CAD 或动力学仿真。
- 关于、GitHub 联系入口与 CV 准备中区域。尚无 PDF，没有虚构履历或下载链接。
- 手机布局、键盘焦点、跳转正文、减少动画偏好支持。

## 本地预览

在此文件夹运行 `python -m http.server 4173 --bind 127.0.0.1`，打开 http://127.0.0.1:4173 。也可以直接打开 index.html。

## GitHub Pages

部署文件是 `index.html`、`styles.css`、`app.js`、`favicon.svg` 和 `.nojekyll`。放在 `carpediem4116.github.io` 仓库发布分支的根目录即可；源码路径均为相对路径，也支持项目子路径。

## 后续更新

`index.html` 管理结构；`styles.css` 管理布局；`app.js` 中的 `translations.en` 与 `translations.zh` 管理双语文本。修改文案时同步两种语言，并同步 HTML 的英文初始文本，保证无 JavaScript 时仍能阅读。

CV 完成后，将公开版 PDF 加入站点，在 CV 区域加入真实下载链接并更新中英文案。姓名、个人介绍及首批项目范围仍可按用户提供的资料调整。
