# Aaron — Personal portfolio & Robot Lab

静态个人网站，部署于 GitHub Pages。默认英文，右上角可切换中文。

## 首页与 Robot Lab

首页原有概念草图已替换为真实 ZERO ARM 三维模型，默认开启连杆分色并使用更近的预览视角，可拖动旋转、右键平移、滚轮缩放。点击 Robot Lab / 机械臂入口进入 `/robot/` 完整查看器。

- 仅展示用户指定的 `ZERO_ARM_urdf_online_verified.zip`，不提供上传或切换其他 ZIP 的入口。
- 模型包括 7 个连杆、6 个旋转关节、7 个 STL 网格。
- 六轴滑块与角度数值输入、姿态复位、透视/正视/侧视/顶视、适应视图和全屏。
- 网格、关节坐标系、线框和连杆分色；所选连杆坐标系相对于 URDF 基座的位置（毫米），并非经过标定的工具尖端 TCP。
- 保存三维视图图片，导出关节姿态 JSON（角度单位为弧度）。
- 首页采用同一查看器的 `?embed=1` 精简模式，与首页同步中英文。

这是 URDF 运动学查看器，不包含动力学、碰撞检测或硬件控制。原模型的关节限位和质量参数仍为占位值。

CV 仍在准备中，完成后再加入公开版 PDF 和真实履历。

## 模型完整性

`robot/assets/zero-arm.zip` 是用户提供 ZIP 的逐字节副本，URDF 和 STL 未被修改。SHA-256：

`f844060ff956fc015280e3a5d2c703834101f855215073186a96b0ef188e9c46`

只打包这一份模型。依赖在 `robot/viewer.js` 中本地打包，运行时不依赖第三方 CDN。

## 本地预览与更新

在网站根目录运行 `python -m http.server 4173 --bind 127.0.0.1`，访问 `http://127.0.0.1:4173/`。三维查看器需要支持 WebGL 的浏览器和 HTTP 服务。

首页源码：`index.html`、`styles.css`、`app.js`。查看器源码：`robot/index.html`、`robot/viewer.css`、`robot/viewer-source.js`、`robot/archive.js`。

修改查看器 JavaScript 后运行 `npm ci`、`npm run build`，提交源码与生成的 `robot/viewer.js`、`robot/viewer.js.LEGAL.txt`。Pages 直接发布仓库根目录，无需在云端构建。修改 CSS / JS 后更新 HTML 中的版本查询参数，避免使用旧缓存。

依赖版本固定于 `package-lock.json`；许可证位于 `robot/THIRD_PARTY_NOTICES.md` 与 `robot/licenses/`。

## 验证

- ZIP CRC、8 个文件与全部网格引用；复制前后 SHA-256 一致。
- 独立 Python URDF 正运动学与浏览器读数对照：零姿态、6 个单轴 +10.8° 姿态和组合姿态 `[23, -15, 35, 15, -25, 90]°` 均一致；取两位小数后的显示误差小于 0.01 mm。
- ZIP 目录/大小、相对路径、外部资源拒绝、缺失/歧义资源与无效归档检查通过。
- 数值框即时更新、键盘调节滑块、姿态 JSON 导出、首页三维嵌入与双语同步已检查。

以上验证浏览器内的模型与运动学计算，不代表硬件精度或安全限位。
