# DSH 处理状态

在 DeepSeek Harness 的输入框上方，显示一行安静的处理状态：

> 处理中 9s ｜ 整理一下衣角 ×

![处理状态预览](assets/preview.png)

不是卡片，没有头像和品牌，也不占用侧栏。它只是一行跟随主题的文字，陪用户度过等待时间。

## 功能

- **计时**：从这一轮开始处理时计时，处理结束后自动消失。
- **趣味提示**：8 条中文小提示，每 5 秒轮换一条，例如「整理一下衣角」。
- **开关**：DSH「设置 → 通用」中有独立的「趣味提示」开关，只控制提示，不影响状态和计时。
- **关闭**：鼠标移到行上会出现 `×`，点击后当前会话页签内不再显示；新会话会恢复。
- **主题**：只使用 DSH 主题变量，亮色和暗色都能正常显示。
- **本地**：没有网络请求，不读取 Host 数据，只使用浏览器 `localStorage` / `sessionStorage` 保存开关和关闭状态。

## 安装

### 前提

- 已安装 DeepSeek Harness Desktop，或正在使用 `dsh web`。
- 能在终端运行 `dsh` 命令。

### 方式一：直接从 GitHub 安装（推荐）

```sh
dsh plugin --profile desktop add github:OStarsO/dsh-processing-status
```

- DSH Desktop 的 profile 通常是 `desktop`。
- 如果是 `dsh web`，把 `desktop` 换成 `web`。
- 如果使用自定义 profile，换成对应名称。

安装完成后重启 DSH，或刷新 Web 页面。

### 方式二：克隆到本地后安装

```sh
git clone https://github.com/OStarsO/dsh-processing-status.git
dsh plugin --profile desktop add "C:\path\to\dsh-processing-status"
```

把 `C:\path\to\dsh-processing-status` 换成实际目录。这个插件是纯 ESM，不需要构建，也没有运行时依赖。

### 装好之后

1. 打开或重启 DSH。
2. 进入「设置 → 通用」，确认出现 **趣味提示** 一行。
3. 开始一次对话，输入框上方就会出现 `处理中 …`。

插件不会新增侧栏入口。它的位置就是输入框上方那一行。

## 使用

| 操作 | 结果 |
| --- | --- |
| 开始对话 | 显示 `处理中`、秒数和一条提示 |
| 等待 5 秒 | 自动换下一条提示 |
| 关闭「趣味提示」 | 只隐藏提示和分隔线，状态与计时保留 |
| 鼠标移到行上 | 右侧出现 `×` |
| 点击 `×` | 当前会话页签内整行隐藏；新会话恢复 |
| 处理结束 | 整行自动消失 |

## 自定义提示

提示列表在 [`client.js`](client.js) 顶部的 `TIPS` 数组里，默认 8 条：

```js
const TIPS = [
  '整理一下衣角',
  // ...
]
```

改完后重新安装本地目录，或重启 DSH。轮换间隔是 `StatusLine` 里的 `5000` 毫秒。

## 兼容性

在 DSH Desktop（Windows，当前版本）上测试通过。它依赖两个 Client Slot：

- `conversation.input.dock`：输入框上方的一行。
- `settings.general.item`：设置 → 通用中的开关行。

如果某个 DSH 版本没有这两个 Slot，对应区域不会出现。

## 文件

| 文件 | 作用 |
| --- | --- |
| `index.js` | Host 入口，只负责把 bundle 挂进 profile。 |
| `client.js` | Web Client：设置开关、计时、提示轮换、关闭状态、全部样式。 |
| `cordis.patch.yml` | 把 `processing-status` 插入当前 profile。 |
| `locale/zh.json`、`locale/en.json` | 包标题和描述。 |
| `icon.svg` | 包图标。 |
| `assets/preview.png` | README 预览图。 |

## 隐私

- 无网络请求。
- 无 Host RPC。
- 不收集、不上传任何对话内容。
- 仅保存：
  - `localStorage['dsh.processing-status.tips.v1']`：提示开关，`on` / `off`。
  - `sessionStorage['dsh.processing-status.closed.<sessionId>']`：当前会话页签是否已关闭状态行。

## 卸载

在 DSH 插件页找到 `dsh-processing-status`，选择卸载，然后重启 DSH。

## License

[MIT](LICENSE)
