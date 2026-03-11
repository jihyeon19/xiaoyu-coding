# 给电脑小白的超详细步骤（LG 电脑）

你这次只做一个目标：**把网站在你自己电脑上打开**（不公开给别人）。

---

## A. 先判断你的 LG 电脑是什么系统

- 如果你看到“开始菜单 / PowerShell / cmd”，通常是 **Windows**（大多数 LG 笔记本是这个）。
- 如果你看到“终端 Terminal + Apple 风格界面”，那是 macOS（较少见）。

下面先按 **Windows** 讲（你最可能用这个）。

---

## B. Windows 一步一步运行（推荐）

### 第 1 步：安装 Python（只需要一次）
1. 打开浏览器，访问：<https://www.python.org/downloads/windows/>
2. 下载最新 Python。
3. 安装时一定勾选：**Add Python to PATH**。
4. 安装完成后关闭安装器。

### 第 2 步：打开项目文件夹
1. 找到你的项目目录 `xiaoyu-coding`。
2. 在文件夹空白处按住 `Shift` + 右键。
3. 选择“在此处打开 PowerShell 窗口”或“在终端中打开”。

### 第 3 步：启动网站（私密模式）
在终端里输入：

```powershell
run_local_windows.bat
```

如果你想换端口（例如 8010）：

```powershell
run_local_windows.bat 8010
```

### 第 4 步：打开网址
复制到浏览器地址栏（推荐第一个）：
- http://127.0.0.1:8000/preview.html
- http://127.0.0.1:8000/
- http://127.0.0.1:8000/preview/

> 如果你用了 `8010`，把 8000 改成 8010。

### 第 5 步：如何停止
回到终端窗口，按：

`Ctrl + C`

---

## C. 常见报错（你可以直接对照）

最常见原因只有 2 个：
1) **服务器没启动成功**（Python 没装好或没加 PATH）
2) **你开的网址和端口不一致**（比如启动的是 8010，却访问 8000）

### 报错 1：`python 不是内部或外部命令`
说明 Python 没装好，或者没勾选 PATH。重新安装 Python 并勾选 `Add Python to PATH`。

### 报错 2：`Address already in use`
说明 8000 端口被占用。改端口启动：

```powershell
run_local_windows.bat 8010
```

### 报错 3：页面还是打不开
请按顺序试：
1) `http://127.0.0.1:8000/preview.html`
2) `http://127.0.0.1:8000/`
3) `http://127.0.0.1:8000/preview/`

并确认终端里显示了 `Serving on http://127.0.0.1:8000`。

---

## D. 隐私说明（你最关心）

- 现在是本地运行，绑定 `127.0.0.1`，默认只有你这台电脑能访问。
- 你的个人资料保存在你浏览器本地（localStorage）。
- 在你确认前，**不要部署到公网**（Vercel/Netlify）。

---

如果你愿意，下一步我可以继续给你做“只需双击图标就自动打开浏览器”的版本。
