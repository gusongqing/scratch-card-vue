# 刮刮乐识别系统 PWA

快速识别刮刮乐彩票中奖金额的PWA应用。

## 功能特性

- ✅ 支持体彩/福彩识别
- ✅ 不区分大小写
- ✅ 不区分字母顺序
- ✅ 本地存储查询历史
- ✅ 支持添加到手机桌面

## 开发

```bash
# 安装依赖
npm install

# 本地开发
npm run dev

# 构建生产版本
npm run build

# 预览生产版本
npm run preview
```

## 部署为PWA

### 1. 生成图标

```bash
# 在浏览器中打开
open generate-icons.html

# 下载图标后放入 public/icons/ 目录
```

### 2. 构建项目

```bash
npm run build
```

### 3. 部署到服务器

需要 **HTTPS** 才能正常使用PWA功能。

#### 部署选项：

**选项A：Vercel（推荐）**
```bash
npm i -g vercel
vercel
```

**选项B：Netlify**
```bash
npm i -g netlify-cli
netlify deploy --prod
```

**选项C：GitHub Pages**
1. 推送代码到 GitHub
2. Settings → Pages → 选择分支
3. 自动部署

### 4. 添加到手机桌面

#### iOS (iPhone/iPad)
1. 在 Safari 中打开网站
2. 点击分享按钮 📤
3. 选择"添加到主屏幕"
4. 点击"添加"

#### Android
1. 在 Chrome 中打开网站
2. 点击菜单 ⋮
3. 选择"添加到主屏幕"或"安装应用"
4. 确认安装

## 项目结构

```
scratch-card-vue/
├── public/
│   ├── manifest.json    # PWA配置
│   ├── sw.js           # Service Worker
│   └── icons/          # 应用图标
├── src/
│   ├── components/
│   │   ├── ScratchCardInput.vue
│   │   └── ResultDisplay.vue
│   ├── utils/
│   │   ├── lottery.js          # 中奖逻辑
│   │   └── lottery-prizes.json # 奖项配置
│   ├── App.vue
│   └── main.js
├── index.html
└── package.json
```

## 自定义中奖规则

编辑 `src/utils/lottery-prizes.json`：

```json
{
  "sports": {
    "name": "体彩",
    "prizes": {
      "EMZ": 4000,
      "BLT": 3000,
      "KMT": 2000
    }
  },
  "welfare": {
    "name": "福彩",
    "prizes": {
      "BTV": 2000,
      "EJO": 1500
    }
  }
}
```

## 技术栈

- Vue 3 + Vite
- PWA (Service Worker + Manifest)
- LocalStorage
