# 林默之 · 求职作品集网站

## 📁 文件结构

```
portfolio/
├── index.html              # 主页面（单页应用，8个版块）
├── css/
│   └── style.css           # 样式（CSS变量管理颜色/字体）
├── js/
│   └── main.js             # 交互逻辑（模块化，注释清晰）
├── images/
│   ├── profile.jpg         # 肖像照 ← 请替换
│   ├── wechat-qr.png       # 微信二维码 ← 请替换
│   └── photography/        # 摄影作品（15张JPG）
│       ├── 摄影_城市孤独者_01_等车的女人.jpg
│       ├── 摄影_城市孤独者_02_地铁末班车.jpg
│       ├── ... (共15张)
├── content/                # 文字素材（Markdown）
├── assets/
│   ├── resume.pdf          # 简历PDF ← 请替换
│   ├── novel-1.pdf         # 小说1全文
│   ├── novel-2.pdf         # 小说2全文
│   └── novel-3.pdf         # 小说3全文
└── README.md
```

## 🚀 部署方式

### GitHub Pages
1. 将 `portfolio/` 目录推送到 GitHub 仓库
2. Settings → Pages → Source 选择 `main` 分支
3. 访问 `https://你的用户名.github.io/仓库名/`

### Netlify
1. 将 `portfolio/` 目录拖拽到 [app.netlify.com/drop](https://app.netlify.com/drop)
2. 自动部署完成

### 本地预览
直接用浏览器打开 `index.html` 即可，无需本地服务器。

## 🎨 自定义指南

### 调整配色
编辑 `css/style.css` 顶部的 CSS 变量：
```css
:root {
  --color-accent: #A16207;      /* 赭石色 - 可改为墨绿 #2D5A27 或暗红 #8B1A1A */
  --color-bg: #FAFAF8;         /* 页面背景 */
  --color-text: #171717;       /* 主文字色 */
}
```

### 替换文字内容
直接在 `index.html` 中搜索以下关键词替换：
- 搜索 `林 默 之` → 替换为你的名字
- 搜索 `writer@example.com` → 替换为你的邮箱
- 搜索 `linmozhi` → 替换为你的微信ID

### 添加真实图片
将你的摄影作品放入 `images/photography/` 目录，文件命名需与 HTML 中的 `src` 属性一致。

## 📄 页面结构

| 版块 | ID | 说明 |
|------|-----|------|
| 首页 | `#hero` | 全屏名称+Slogan，打字机加载动画 |
| 关于 | `#about` | 个人简介+肖像+联系方式 |
| 作品导航 | `#works-nav` | 杂志目录式4入口 |
| 摄影 | `#photography` | 瀑布流画廊+系列筛选+Lightbox |
| 剧本 | `#scripts` | 左目录右内容，梗概→对白→手记 |
| 诗歌 | `#poetry` | 单首全屏+左右翻页+深/浅切换 |
| 小说 | `#fiction` | 3卡片网格，hover翻转显示梗概 |
| 联系 | `#contact` | 邮箱+微信+简历下载 |

## 🔧 技术特点

- 纯前端实现，无需后端
- CSS变量管理配色与字体
- 模块化JavaScript
- 图片懒加载（原生 `loading="lazy"` + Intersection Observer 回退）
- Open Graph / Twitter Card / WeChat 分享标签
- 响应式适配（桌面→平板→手机三级断点）
- 深色/浅色阅读模式切换
- 打字机效果加载动画
- 隐藏彩蛋（Footer点击触发微小说）
