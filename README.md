# 英语学习助手

一个不善于英语表达的人进行辅助的的 AI 应用程序

![Transify.ai 演示](transify.gif)

## 在线体验

[Transfiy.ai](https://transfiy-web.lionabc.com/)

## ✨设计思想
软件设计的目标群体为练习很久单词就是不会开口表达的 “哑巴英语” 们～

可以把日常想说的话作为输入， AI将会翻译为口语表达或写作表达， 只需要跟进软件输出的语法结构和句子坚持练习就会日渐累积脱口而出！

将来会增加词库功能，根据您累积的词汇进行表达练习。

软件也对需要写作英语的人群有一定的帮助。

## 技术栈

- React
- CSS3
- DeepSeek

## 快速开始

1. 克隆仓库
```bash
git clone https://github.com/zhangdszq/transify.ai.git
cd transify.ai


2. 安装依赖
```bash
cd transify.ai
npm install
 ```

3. 启动开发服务器
```bash
npm run dev
 ```

## 项目结构
```plaintext
transify.ai/
├── src/
│   ├── components/
│   │   ├── LeftSidebar.jsx    # 左侧菜单组件
│   │   ├── PracticeArea.jsx   # 练习区域组件
│   │   └── Sidebar.jsx        # 右侧语法分析边栏
│   ├── App.jsx                # 主应用组件
│   └── App.css                # 样式文件
└── package.json
 ```

## 本地开发
1. 确保已安装 Node.js (v14+)
2. 克隆仓库并安装依赖
3. 在 .env 文件中配置必要的环境变量
4. 使用 npm run dev 启动开发服务器
## 贡献指南
欢迎提交 Pull Requests 来改进这个项目。在提交之前，请确保：

1. 代码符合现有的代码风格
2. 添加了必要的测试
3. 更新了相关文档
## 许可证
MIT License

## 联系方式
如有问题或建议，欢迎提交 Issue 或 Pull Request。