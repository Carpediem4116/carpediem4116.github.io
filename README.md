# Aaron — Personal portfolio & Robot Lab

静态个人网站，部署于 GitHub Pages。默认英文，右上角可切换中文。

## 首页与 Robot Lab

首页原有概念草图已替换为真实 ZERO ARM 三维模型，默认开启连杆分色并使用更近的预览视角，可拖动旋转、右键平移、滚轮缩放。点击 Robot Lab / 机械臂入口进入 `/robot/` 完整查看器。

- 仅展示用户指定的 `ZERO_ARM_urdf_online_verified.zip`，不提供上传或切换其他 ZIP 的入口。
- 模型包括 7 个连杆、6 个旋转关节、7 个 STL 网格。
- 六轴滑块与角度数值输入、姿态复位、透视/正视/侧视/顶视、适应视图和全屏。
- 网格、关节坐标系与连杆分色；只保留展示和关节调节所需的控件。
- 界面不提供 ZIP 下载、图片保存或姿态导出；不显示线框选项、连杆位置读数或模型结构面板。
- 首页采用同一查看器的 `?embed=1` 精简模式，与首页同步中英文。
- 首页标注 `ZERO ARM / 6 DOF`。模型有六个独立旋转关节。
- 模型区域取消右键的默认鼠标事件，保留 OrbitControls 的平移处理；也可用 Shift＋左键拖动平移。

这是 URDF 运动学查看器，不包含动力学、碰撞检测或硬件控制。原模型的关节限位和质量参数仍为占位值。

CV 仍在准备中，完成后再加入公开版 PDF 和真实履历。

## 项目轮播、背景与联系入口

- 轮播只包含机械臂和 Coming soon 两张卡片；CAD、STM32 与 URDF 都属于同一个机械臂项目，详情可在轮播下方展开。
- 每 5.5 秒自动切换，首尾循环；支持前后按钮、圆点、方向键和触屏滑动。鼠标悬停、键盘焦点、页面不可见时暂停，也可手动暂停。
- `effects.js` 绘制原创 WebGL 流动光影，浅色页面背景与深色底部联系区各一层；无视频、远程素材或额外运行依赖。不可见区域不绘制；系统减少动态效果时默认暂停，可手动播放或暂停。不支持 WebGL 时使用静态配色。
- 底部提供邮箱、WhatsApp、GitHub 和用户确认的 LinkedIn 链接，不包括 YouTube 或 Discord。悬停或键盘聚焦显示对应联系提示。
- `assets/zero-arm-preview.png` 为网站自身 ZERO ARM 模型画布的截图，不含其他机器人模型。

## 模型完整性

`robot/assets/zero-arm.zip` 是用户提供 ZIP 的逐字节副本，URDF 和 STL 未被修改。SHA-256：

`f844060ff956fc015280e3a5d2c703834101f855215073186a96b0ef188e9c46`

只打包这一份模型。依赖在 `robot/viewer.js` 中本地打包，运行时不依赖第三方 CDN。

## 本地预览与更新

在网站根目录运行 `python -m http.server 4173 --bind 127.0.0.1`，访问 `http://127.0.0.1:4173/`。三维查看器需要支持 WebGL 的浏览器和 HTTP 服务。

首页源码：`index.html`、`styles.css`、`app.js`、`effects.js`。查看器源码：`robot/index.html`、`robot/viewer.css`、`robot/viewer-source.js`、`robot/archive.js`。

修改查看器 JavaScript 后运行 `npm ci`、`npm run build`，提交源码与生成的 `robot/viewer.js`、`robot/viewer.js.LEGAL.txt`。Pages 直接发布仓库根目录，无需在云端构建。修改 CSS / JS 后更新 HTML 中的版本查询参数，避免使用旧缓存。

输入拦截源码位于 `robot/viewer-input.js`。依赖版本固定于 `package-lock.json`；许可证位于 `robot/THIRD_PARTY_NOTICES.md` 与 `robot/licenses/`。

## 验证

- ZIP CRC、8 个文件与全部网格引用；复制前后 SHA-256 一致。
- 独立 Python URDF 正运动学与浏览器读数对照：零姿态、6 个单轴 +10.8° 姿态和组合姿态 `[23, -15, 35, 15, -25, 90]°` 均一致；取两位小数后的显示误差小于 0.01 mm。
- ZIP 目录/大小、相对路径、外部资源拒绝、缺失/歧义资源与无效归档检查通过。
- 数值框即时更新、键盘调节滑块、姿态复位、首页三维嵌入与双语同步已检查；被移除的下载/导出等控件在页面 DOM 中数量为零。
- 输入事件检查：右键默认事件被取消，OrbitControls 的指针处理仍会运行；左键输入不被拦截，释放指针或窗口失焦后清除右键状态。用户确认 Codex 内置浏览器正常、Edge 会触发原生鼠标手势；需在 Edge 手势设置中为本站添加排除，或使用 Shift＋左键平移。

以上验证浏览器内的模型与运动学计算，不代表硬件精度或安全限位。
