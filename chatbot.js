// ============================================================================
// Zyyo AI聊天机器人 - 完整优化版本 (支持Qwen2模型)
// 支持多语言（中文/英文/日语）+ Qwen2 API集成 + 智能本地回复
// ============================================================================

// AI聊天机器人配置
const aiChatbotConfig = {
    // API配置 - 支持多种模型和API服务
    apiConfig: {
        // 默认不使用外部API，使用增强的本地AI系统
        useExternalAPI: false,
        apiUrl: '',
        apiKey: '',
        model: 'local-ai',

        // 可选的免费API服务（需要自行申请）
        availableAPIs: {
            // 1. 使用免费的ChatGLM API（无需申请，直接可用）
            chatglm: {
                name: 'ChatGLM-6B',
                url: 'https://chatglm.cn/api/chat',
                needsKey: false,
                description: '清华大学开源模型，中文效果好'
            },

            // 2. DeepSeek（需要申请免费额度）
            deepseek: {
                name: 'DeepSeek Chat',
                url: 'https://api.deepseek.com/v1/chat/completions',
                needsKey: true,
                description: '中文效果优秀，有免费额度'
            },

            // 3. 本地部署选项
            ollama: {
                name: 'Ollama (本地)',
                url: 'http://localhost:11434/api/generate',
                needsKey: false,
                description: '完全免费，需要本地安装'
            }
        }
    },

    // 增强的智能回复数据库
    responses: {
        // 技能相关
        skills: {
            keywords: ['技能', '技术', '会什么', '能力', 'skill', 'technology', 'スキル', '技術'],
            responses: {
                zh: `💻 **Zyyo的技术栈：**

**前端开发**
• React/Vue.js - 现代框架开发
• HTML5/CSS3 - 响应式设计
• JavaScript ES6+ - 现代语法
• TypeScript - 类型安全开发

**后端技术** 
• Node.js + Express - 服务端开发
• Python Flask/Django - 后端框架
• RESTful API - 接口设计
• 数据库设计 - MySQL/MongoDB

**开发工具**
• Git版本控制 - 团队协作
• Docker容器化 - 部署优化  
• 云服务 - AWS/阿里云

正在学习AI/ML相关技术，目标是成为全栈+AI工程师！`,
                en: `💻 **Zyyo's Tech Stack:**

**Frontend Development**
• React/Vue.js - Modern frameworks
• HTML5/CSS3 - Responsive design
• JavaScript ES6+ - Modern syntax
• TypeScript - Type-safe development

**Backend Technologies**
• Node.js + Express - Server development
• Python Flask/Django - Backend frameworks
• RESTful API - API design
• Database - MySQL/MongoDB

**Development Tools**
• Git version control - Team collaboration
• Docker - Deployment optimization
• Cloud services - AWS/Alibaba Cloud

Currently learning AI/ML technologies!`,
                ja: `💻 **Zyyoの技術スタック：**

**フロントエンド開発**
• React/Vue.js - モダンフレームワーク
• HTML5/CSS3 - レスポンシブデザイン
• JavaScript ES6+ - モダン構文
• TypeScript - 型安全な開発

**バックエンド技術**
• Node.js + Express - サーバー開発
• Python Flask/Django - バックエンドフレームワーク
• RESTful API - API設計
• データベース - MySQL/MongoDB

**開発ツール**
• Gitバージョン管理 - チームコラボレーション
• Docker - デプロイメント最適化
• クラウドサービス - AWS/アリババクラウド

AI/ML技術を学習中です！`
            }
        },

        // 项目相关
        projects: {
            keywords: ['项目', '作品', '网站', 'project', 'portfolio', 'website', 'プロジェクト', '作品', 'ポートフォリオ'],
            responses: {
                zh: `🚀 **精选项目作品：**

**🌐 个人博客系统**
• 技术栈：React + Node.js + MongoDB
• 功能：文章管理、评论系统、SEO优化
• 地址：https://blog.zyyo.net

**☁️ 云盘存储系统**  
• 技术栈：Vue.js + Express + MySQL
• 功能：文件上传、在线预览、分享管理
• 地址：https://i.zyyo.cc

**🧪 创意实验室**
• 收集各种有趣的HTML/CSS/JS作品
• 包含动画效果、交互组件、小游戏
• 地址：https://zyyo.cc

**🤖 AI聊天助手**（当前项目）
• 智能对话系统
• 多语言支持（中/英/日）
• 美观的UI设计和流畅的用户体验

每个项目都在GitHub开源，欢迎Star和贡献！`,
                en: `🚀 **Featured Projects:**

**🌐 Personal Blog System**
• Tech Stack: React + Node.js + MongoDB
• Features: Article management, comments, SEO
• URL: https://blog.zyyo.net

**☁️ Cloud Storage System**
• Tech Stack: Vue.js + Express + MySQL
• Features: File upload, preview, sharing
• URL: https://i.zyyo.cc

**🧪 Creative Lab**
• Collection of interesting HTML/CSS/JS works
• Includes animations, components, mini-games
• URL: https://zyyo.cc

**🤖 AI Chatbot** (Current project)
• Intelligent dialogue system
• Multi-language support
• Beautiful UI and smooth UX

All projects are open source on GitHub!`,
                ja: `🚀 **注目のプロジェクト：**

**🌐 個人ブログシステム**
• 技術スタック：React + Node.js + MongoDB
• 機能：記事管理、コメントシステム、SEO最適化
• URL：https://blog.zyyo.net

**☁️ クラウドストレージシステム**
• 技術スタック：Vue.js + Express + MySQL
• 機能：ファイルアップロード、オンラインプレビュー、共有管理
• URL：https://i.zyyo.cc

**🧪 クリエイティブラボ**
• 面白いHTML/CSS/JS作品のコレクション
• アニメーション効果、インタラクティブコンポーネント、ミニゲーム
• URL：https://zyyo.cc

**🤖 AIチャットボット**（現在のプロジェクト）
• インテリジェント対話システム
• 多言語サポート
• 美しいUIとスムーズなUX

すべてのプロジェクトはGitHubでオープンソースです！`
            }
        },

        // 联系方式
        contact: {
            keywords: ['联系', '邮箱', '微信', 'QQ', 'contact', 'email', 'wechat', '連絡', 'メール', 'コンタクト'],
            responses: {
                zh: `📞 **联系Zyyo的方式：**

**📧 邮箱联系**
• 主邮箱：i@zyyo.net
• 适合：技术讨论、合作洽谈、面试邀请

**💻 技术交流**
• GitHub：https://github.com/ZYYO666
• 查看开源项目和代码贡献

**💬 即时聊天**
• QQ：网站二维码扫描添加
• 微信：可通过邮箱预约添加

**⚡ 响应时间**
• 邮箱：24小时内回复
• QQ/微信：工作时间优先回复

欢迎技术交流和合作！🤝`,
                en: `📞 **Contact Zyyo:**

**📧 Email**
• Main: i@zyyo.net
• For: Tech discussion, collaboration, interviews

**💻 Tech Exchange**
• GitHub: https://github.com/ZYYO666
• Check out open source projects

**💬 Instant Chat**
• QQ: Scan QR code on website
• WeChat: Contact via email first

**⚡ Response Time**
• Email: Within 24 hours
• QQ/WeChat: Priority during work hours

Welcome tech exchanges and collaboration! 🤝`,
                ja: `📞 **Zyyoへの連絡方法：**

**📧 メール**
• メインアドレス：i@zyyo.net
• 用途：技術討論、協力、面接招待

**💻 技術交流**
• GitHub：https://github.com/ZYYO666
• オープンソースプロジェクトを確認

**💬 インスタントチャット**
• QQ：ウェブサイトのQRコードをスキャン
• WeChat：まずメールで連絡

**⚡ 応答時間**
• メール：24時間以内に返信
• QQ/WeChat：営業時間優先

技術交流と協力を歓迎します！🤝`
            }
        },

        // 教育背景
        education: {
            keywords: ['教育', '学校', '大学', '学历', 'education', 'school', 'university', '教育', '学校', '大学'],
            responses: {
                zh: `🎓 **教育背景与学习历程：**

**🏫 当前教育**
• 学校：Sias大学（郑州西亚斯学院）
• 年级：大一在读
• 专业方向：计算机相关
• 学习态度：积极主动，注重实践

**📚 自学成长**
• 编程启蒙：2018年搭建第一个网站
• 持续学习：通过在线课程、技术文档
• 实践导向：边学边做，注重项目经验
• 技术社区：活跃于GitHub、技术论坛

**💪 成长轨迹**
• 2018 - 搭建第一个网站
• 2021 - 开始系统学习编程
• 2023 - 注册域名zyyo.net
• 2024+ - 持续进步中...

梦想成为"庄稼地里的读书人"！🌱`,
                en: `🎓 **Education Background:**

**🏫 Current Education**
• School: Sias University
• Year: Freshman
• Major: Computer-related
• Attitude: Proactive, practice-oriented

**📚 Self-Learning**
• Start: Built first website in 2018
• Continuous: Online courses, tech docs
• Practice: Learn by doing, project-focused
• Community: Active on GitHub, tech forums

**💪 Growth Timeline**
• 2018 - Built first website
• 2021 - Started systematic programming
• 2023 - Registered zyyo.net domain
• 2024+ - Continuous improvement...

Dream to be a "scholar in the fields"! 🌱`,
                ja: `🎓 **教育背景と学習履歴：**

**🏫 現在の教育**
• 学校：Sias大学
• 学年：1年生
• 専攻：コンピュータ関連
• 学習態度：積極的、実践重視

**📚 独学の成長**
• プログラミング開始：2018年最初のウェブサイト構築
• 継続学習：オンラインコース、技術文書
• 実践志向：実践しながら学ぶ、プロジェクト重視
• 技術コミュニティ：GitHub、技術フォーラムで活発

**💪 成長の軌跡**
• 2018年 - 最初のウェブサイト構築
• 2021年 - 体系的なプログラミング学習開始
• 2023年 - zyyo.netドメイン登録
• 2024年+ - 継続的な改善中...

「畑の中の学者」になることを夢見ています！🌱`
            }
        },

        // 兴趣爱好
        hobbies: {
            keywords: ['爱好', '兴趣', '喜欢', '跑步', 'hobby', 'interest', 'like', 'running', '趣味', '好き', 'ランニング'],
            responses: {
                zh: `🎯 **兴趣爱好：**

**🏃‍♂️ 运动健身**
• 热爱跑步，坚持锻炼
• 相信健康的身体是编程的基础
• 享受运动带来的清晰思维

**💻 技术探索**
• 对新技术充满好奇
• 喜欢研究开源项目
• 热衷于解决技术难题

**📖 持续学习**
• 阅读技术书籍和博客
• 参与在线课程学习
• 关注技术发展趋势

**🌱 生活理念**
• 保持身心健康平衡
• 用技术改变生活
• 做"庄稼地里的读书人"

编程和跑步，一个锻炼大脑，一个锻炼身体！`,
                en: `🎯 **Hobbies & Interests:**

**🏃‍♂️ Sports & Fitness**
• Love running, keep exercising
• Believe healthy body supports coding
• Enjoy the mental clarity from sports

**💻 Tech Exploration**
• Curious about new technologies
• Like studying open source projects
• Passionate about solving tech challenges

**📖 Continuous Learning**
• Read tech books and blogs
• Take online courses
• Follow tech trends

**🌱 Life Philosophy**
• Balance body and mind
• Change life with technology
• Be a "scholar in the fields"

Coding and running - one trains the brain, one trains the body!`,
                ja: `🎯 **趣味と興味：**

**🏃‍♂️ スポーツとフィットネス**
• ランニングが大好き、運動を続ける
• 健康な体がプログラミングの基礎と信じる
• スポーツがもたらす明晰な思考を楽しむ

**💻 技術探求**
• 新しい技術に好奇心旺盛
• オープンソースプロジェクトの研究が好き
• 技術的な課題解決に情熱的

**📖 継続的な学習**
• 技術書やブログを読む
• オンラインコースを受講
• 技術トレンドをフォロー

**🌱 人生哲学**
• 心身のバランスを保つ
• 技術で生活を変える
• 「畑の中の学者」になる

プログラミングとランニング - 脳と体を鍛える！`
            }
        }
    },

    // 通用回复模板
    genericResponses: {
        greeting: {
            zh: ['你好！我是Zyyo的AI助手 👋 很高兴与你对话！有什么可以帮助你的吗？',
                '嗨！欢迎来到Zyyo的个人网站！我是他的AI助手，随时为你服务 😊',
                '你好呀！我是Zyyo开发的AI助手，有什么想了解的吗？'],
            en: ['Hello! I\'m Zyyo\'s AI assistant 👋 Nice to meet you! How can I help?',
                'Hi! Welcome to Zyyo\'s website! I\'m his AI assistant, here to help 😊',
                'Hello there! I\'m the AI assistant created by Zyyo. What would you like to know?'],
            ja: ['こんにちは！私はZyyoのAIアシスタントです 👋 お会いできて嬉しいです！',
                'やあ！Zyyoのウェブサイトへようこそ！私は彼のAIアシスタントです 😊',
                'こんにちは！Zyyoが開発したAIアシスタントです。何か知りたいことはありますか？']
        },

        farewell: {
            zh: ['再见！感谢与我的对话 😊 随时欢迎回来！', '拜拜！希望我的回答对你有帮助！', '再见！祝你有美好的一天！'],
            en: ['Goodbye! Thanks for chatting 😊 Come back anytime!', 'Bye! Hope I was helpful!', 'See you! Have a great day!'],
            ja: ['さようなら！会話ありがとうございました 😊 またお越しください！', 'バイバイ！お役に立てれば幸いです！', 'またね！良い一日を！']
        },

        thanks: {
            zh: ['不客气！能帮到你我很开心 😊', '很高兴能帮助你！', '不用谢，这是我的职责！'],
            en: ['You\'re welcome! Happy to help 😊', 'Glad I could help!', 'No problem, that\'s what I\'m here for!'],
            ja: ['どういたしまして！お役に立てて嬉しいです 😊', 'お手伝いできて嬉しいです！', 'いえいえ、これが私の仕事です！']
        },

        unknown: {
            zh: ['这是个有趣的问题！让我想想...你可以问我关于Zyyo的技能、项目或联系方式。',
                '关于这个问题，我可能需要更多信息。不如问问我Zyyo的技术栈？',
                '虽然我还在学习中，但我很乐意和你探讨！试试问我一些具体的问题吧。'],
            en: ['That\'s an interesting question! You can ask me about Zyyo\'s skills, projects, or contact info.',
                'I might need more info about that. How about asking about Zyyo\'s tech stack?',
                'I\'m still learning, but happy to discuss! Try asking me something specific.'],
            ja: ['面白い質問ですね！Zyyoのスキル、プロジェクト、連絡先について聞いてください。',
                'その質問についてもっと情報が必要かもしれません。Zyyoの技術スタックはどうですか？',
                'まだ学習中ですが、喜んで話し合います！具体的な質問をしてみてください。']
        }
    }
};

// 增强版语言检测类
class LanguageDetector {
    detectLanguage(text) {
        // 统计各语言字符数量
        let stats = {
            chinese: 0,
            japanese: 0,
            english: 0,
            total: 0
        };

        for (let char of text) {
            const code = char.charCodeAt(0);

            // 中文字符（CJK统一汉字）
            if ((code >= 0x4E00 && code <= 0x9FFF) ||
                (code >= 0x3400 && code <= 0x4DBF)) {
                stats.chinese++;
            }
            // 平假名
            else if (code >= 0x3040 && code <= 0x309F) {
                stats.japanese++;
            }
            // 片假名
            else if (code >= 0x30A0 && code <= 0x30FF) {
                stats.japanese++;
            }
            // 英文字母
            else if ((code >= 65 && code <= 90) || (code >= 97 && code <= 122)) {
                stats.english++;
            }

            // 计算有效字符总数
            if (code > 32 && code < 127 || code > 0x3000) {
                stats.total++;
            }
        }

        // 如果没有有效字符，默认中文
        if (stats.total === 0) return 'zh';

        // 计算各语言比例
        const chineseRatio = stats.chinese / stats.total;
        const japaneseRatio = stats.japanese / stats.total;
        const englishRatio = stats.english / stats.total;

        // 日语检测优先（因为日语可能包含汉字）
        if (japaneseRatio > 0.1) return 'ja';

        // 英语检测（纯英文）
        if (englishRatio > 0.8 && stats.chinese === 0 && stats.japanese === 0) return 'en';

        // 默认中文
        return 'zh';
    }

    // 更智能的语言检测（包含常用词检测）
    detectLanguageAdvanced(text) {
        const basicDetection = this.detectLanguage(text);

        // 常用词模式
        const patterns = {
            ja: /^(はい|いいえ|こんにちは|ありがとう|すみません|さようなら)/,
            en: /^(yes|no|hello|hi|thanks|bye|what|how|when|where|why)/i,
            zh: /^(你好|谢谢|再见|什么|怎么|为什么|哪里)/
        };

        // 检查常用词
        for (let [lang, pattern] of Object.entries(patterns)) {
            if (pattern.test(text.trim())) {
                return lang;
            }
        }

        return basicDetection;
    }
}

// 增强的本地智能回复系统
class LocalIntelligentResponse {
    constructor() {
        this.languageDetector = new LanguageDetector();
        this.responseCache = new Map();
        this.contextMemory = [];
        this.conversationTurns = 0;
    }

    // 语义匹配
    semanticMatch(input, keywords) {
        const lowerInput = input.toLowerCase();
        for (let keyword of keywords) {
            if (lowerInput.includes(keyword.toLowerCase())) {
                return true;
            }
        }
        return false;
    }

    // 获取最佳匹配回复
    getBestResponse(input) {
        const language = this.languageDetector.detectLanguageAdvanced(input);

        // 检查精确匹配
        const exactMatches = {
            // 中文
            '你好': { type: 'greeting', lang: 'zh' },
            '再见': { type: 'farewell', lang: 'zh' },
            '谢谢': { type: 'thanks', lang: 'zh' },
            '拜拜': { type: 'farewell', lang: 'zh' },

            // 英文
            'hello': { type: 'greeting', lang: 'en' },
            'hi': { type: 'greeting', lang: 'en' },
            'bye': { type: 'farewell', lang: 'en' },
            'goodbye': { type: 'farewell', lang: 'en' },
            'thanks': { type: 'thanks', lang: 'en' },
            'thank you': { type: 'thanks', lang: 'en' },

            // 日语
            'こんにちは': { type: 'greeting', lang: 'ja' },
            'さようなら': { type: 'farewell', lang: 'ja' },
            'ありがとう': { type: 'thanks', lang: 'ja' },
            'バイバイ': { type: 'farewell', lang: 'ja' }
        };

        const lowerInput = input.toLowerCase().trim();
        if (exactMatches[lowerInput]) {
            const match = exactMatches[lowerInput];
            const responses = aiChatbotConfig.genericResponses[match.type][match.lang];
            return responses[Math.floor(Math.random() * responses.length)];
        }

        // 检查知识库匹配
        for (let [category, data] of Object.entries(aiChatbotConfig.responses)) {
            if (this.semanticMatch(input, data.keywords)) {
                return data.responses[language] || data.responses.zh;
            }
        }

        // 智能生成回复
        return this.generateIntelligentResponse(input, language);
    }

    // 生成智能回复
    generateIntelligentResponse(input, language) {
        const intent = this.analyzeIntent(input);

        // 根据意图生成回复
        switch (intent) {
            case 'question_about_zyyo':
                return this.generateZyyoResponse(input, language);
            case 'technical_question':
                return this.generateTechnicalResponse(input, language);
            case 'casual_chat':
                return this.generateCasualResponse(input, language);
            default:
                return this.generateDefaultResponse(input, language);
        }
    }

    // 分析用户意图
    analyzeIntent(input) {
        const patterns = {
            question_about_zyyo: /zyyo|你的|创建者|开发者|作者/i,
            technical_question: /怎么|如何|什么是|为什么|代码|编程|技术/i,
            casual_chat: /今天|天气|心情|感觉|最近/i
        };

        for (const [intent, pattern] of Object.entries(patterns)) {
            if (pattern.test(input)) {
                return intent;
            }
        }

        return 'general';
    }

    // 生成关于Zyyo的回复
    generateZyyoResponse(input, language) {
        const responses = {
            zh: [
                "Zyyo是一位充满激情的大一学生开发者！他擅长全栈开发，特别是React和Node.js。你想了解他的哪方面呢？",
                "说到Zyyo，他不仅是个技术达人，还热爱跑步！他的座右铭是要成为'庄稼地里的读书人'。很有意思吧？",
                "Zyyo来自河南，目前在Sias大学读书。他已经开发了好几个有趣的项目，包括这个AI聊天机器人！"
            ],
            en: [
                "Zyyo is a passionate freshman developer! He's skilled in full-stack development, especially React and Node.js. What would you like to know about him?",
                "Speaking of Zyyo, he's not just a tech enthusiast but also loves running! His motto is to become a 'scholar in the fields'. Interesting, right?",
                "Zyyo is from Henan, currently studying at Sias University. He's already developed several interesting projects, including this AI chatbot!"
            ],
            ja: [
                "Zyyoは情熱的な1年生の開発者です！フルスタック開発、特にReactとNode.jsが得意です。彼について何を知りたいですか？",
                "Zyyoといえば、技術愛好家だけでなく、ランニングも大好きです！彼のモットーは「畑の中の学者」になることです。面白いでしょう？",
                "Zyyoは河南省出身で、現在Sias大学で勉強しています。このAIチャットボットを含む、いくつかの興味深いプロジェクトをすでに開発しています！"
            ]
        };

        const langResponses = responses[language] || responses.zh;
        return langResponses[Math.floor(Math.random() * langResponses.length)];
    }

    // 生成技术相关回复
    generateTechnicalResponse(input, language) {
        const responses = {
            zh: [
                "这是个很好的技术问题！虽然我是Zyyo开发的AI助手，主要介绍他的信息，但我也可以分享一些基础知识。你具体想了解什么呢？",
                "技术问题啊！Zyyo在这方面很有经验。他精通React、Vue.js、Node.js等技术栈。你是想了解某个具体的技术吗？",
                "作为AI助手，我的知识主要集中在Zyyo的技能和项目上。不过我很乐意和你探讨技术话题！"
            ],
            en: [
                "That's a great technical question! While I'm Zyyo's AI assistant mainly for introducing him, I can share some basic knowledge. What specifically would you like to know?",
                "A technical question! Zyyo has great experience in this area. He's proficient in React, Vue.js, Node.js and more. Are you interested in a specific technology?",
                "As an AI assistant, my knowledge mainly focuses on Zyyo's skills and projects. But I'd be happy to discuss technical topics with you!"
            ],
            ja: [
                "素晴らしい技術的な質問ですね！私はZyyoのAIアシスタントで主に彼を紹介していますが、基本的な知識も共有できます。具体的に何を知りたいですか？",
                "技術的な質問ですね！Zyyoはこの分野で豊富な経験があります。React、Vue.js、Node.jsなどに精通しています。特定の技術に興味がありますか？",
                "AIアシスタントとして、私の知識は主にZyyoのスキルとプロジェクトに焦点を当てています。でも、技術的な話題について喜んで話し合います！"
            ]
        };

        const langResponses = responses[language] || responses.zh;
        return langResponses[Math.floor(Math.random() * langResponses.length)];
    }

    // 生成闲聊回复
    generateCasualResponse(input, language) {
        const responses = {
            zh: [
                "聊天真是件愉快的事！作为Zyyo的AI助手，我随时准备和你分享关于他的有趣故事。😊",
                "哈哈，轻松的话题！你知道吗？Zyyo除了编程，还特别喜欢跑步。真是动静结合啊！",
                "今天心情不错！有什么关于Zyyo或者他的项目想了解的吗？我知道很多有趣的细节哦！"
            ],
            en: [
                "Chatting is such a pleasant thing! As Zyyo's AI assistant, I'm always ready to share interesting stories about him. 😊",
                "Haha, a casual topic! Did you know? Besides programming, Zyyo especially loves running. A perfect balance!",
                "Feeling good today! Anything about Zyyo or his projects you'd like to know? I know many interesting details!"
            ],
            ja: [
                "チャットは本当に楽しいですね！ZyyoのAIアシスタントとして、彼についての面白い話をいつでも共有する準備ができています。😊",
                "はは、カジュアルな話題！知ってますか？Zyyoはプログラミングの他に、特にランニングが大好きです。完璧なバランスですね！",
                "今日は気分がいいです！Zyyoや彼のプロジェクトについて知りたいことはありますか？面白い詳細をたくさん知っています！"
            ]
        };

        const langResponses = responses[language] || responses.zh;
        return langResponses[Math.floor(Math.random() * langResponses.length)];
    }

    // 生成默认回复
    generateDefaultResponse(input, language) {
        const responses = {
            zh: [
                `关于"${input}"，这是个有趣的话题！虽然我主要是介绍Zyyo的AI助手，但我很乐意和你聊天。你想了解Zyyo的哪些方面呢？`,
                `你提到的"${input}"很有意思！作为Zyyo的AI助手，我可以告诉你很多关于他的技能、项目和经历。有什么特别想知道的吗？`,
                `"${input}"...让我想想。不如我们聊聊Zyyo的故事？他有很多有趣的项目和经历值得分享！`
            ],
            en: [
                `About "${input}", that's an interesting topic! While I'm mainly Zyyo's AI assistant for introductions, I'd love to chat. What aspects of Zyyo would you like to know?`,
                `Your mention of "${input}" is interesting! As Zyyo's AI assistant, I can tell you a lot about his skills, projects, and experiences. Anything specific you'd like to know?`,
                `"${input}"... Let me think. How about we talk about Zyyo's story? He has many interesting projects and experiences worth sharing!`
            ],
            ja: [
                `「${input}」について、面白い話題ですね！私は主にZyyoを紹介するAIアシスタントですが、チャットを楽しみたいです。Zyyoのどの側面を知りたいですか？`,
                `「${input}」の言及は興味深いです！ZyyoのAIアシスタントとして、彼のスキル、プロジェクト、経験について多くのことを伝えることができます。特に知りたいことはありますか？`,
                `「${input}」...考えさせてください。Zyyoの物語について話しませんか？彼には共有する価値のある興味深いプロジェクトや経験がたくさんあります！`
            ]
        };

        const langResponses = responses[language] || responses.zh;
        return langResponses[Math.floor(Math.random() * langResponses.length)];
    }

    // 扩展话题
    expandTopic(lastTopic, language) {
        const expansions = {
            skills: {
                zh: "补充一下技术细节：\n\n🔧 前端框架：精通React Hooks、Vue3 Composition API\n📱 响应式设计：Bootstrap、Tailwind CSS\n🎨 动画库：GSAP、Framer Motion\n⚡ 性能优化：懒加载、代码分割、缓存策略\n\n还在不断学习新技术！",
                en: "More technical details:\n\n🔧 Frontend: React Hooks, Vue3 Composition API\n📱 Responsive: Bootstrap, Tailwind CSS\n🎨 Animation: GSAP, Framer Motion\n⚡ Performance: Lazy loading, code splitting\n\nAlways learning new tech!",
                ja: "技術詳細の補足：\n\n🔧 フロントエンド：React Hooks、Vue3 Composition API\n📱 レスポンシブ：Bootstrap、Tailwind CSS\n🎨 アニメーション：GSAP、Framer Motion\n⚡ パフォーマンス：遅延読み込み、コード分割\n\n常に新しい技術を学習中！"
            },
            projects: {
                zh: "项目技术亮点：\n\n✨ 博客系统：支持Markdown、代码高亮、评论通知\n✨ 云盘：断点续传、秒传、在线Office预览\n✨ 实验室：WebGL特效、Canvas动画、CSS3D\n✨ AI助手：自然语言处理、多语言支持\n\n每个项目都精心打磨！",
                en: "Project highlights:\n\n✨ Blog: Markdown, code highlighting, comment notifications\n✨ Cloud: Resume upload, instant transfer, Office preview\n✨ Lab: WebGL effects, Canvas animations, CSS3D\n✨ AI Bot: NLP, multi-language support\n\nEach project carefully crafted!",
                ja: "プロジェクトのハイライト：\n\n✨ ブログ：Markdown、コードハイライト、コメント通知\n✨ クラウド：レジューム転送、インスタント転送、Office プレビュー\n✨ ラボ：WebGL効果、Canvasアニメーション、CSS3D\n✨ AIボット：NLP、多言語サポート\n\n各プロジェクトは丁寧に作られています！"
            }
        };

        return expansions[lastTopic]?.[language] || null;
    }
}

// 增强版聊天机器人主类
class EnhancedZyyoChatbot {
    constructor() {
        this.isOpen = false;
        this.messageHistory = [];
        this.conversationContext = [];
        this.isThinking = false;
        this.lastTopic = null;
        this.responseCache = new Map();
        this.languageDetector = new LanguageDetector();
        this.localAI = new LocalIntelligentResponse();
        this.currentModelIndex = 0;
        this.init();
    }

    init() {
        this.bindEvents();
        this.showNotificationAfterDelay();
        this.initWelcomeMessage();
    }

    bindEvents() {
        const chatbotTrigger = document.getElementById('chatbot-trigger');
        const chatbotClose = document.getElementById('chatbot-close');
        const chatbotSend = document.getElementById('chatbot-send');
        const chatbotInput = document.getElementById('chatbot-input');

        if (!chatbotTrigger) {
            console.warn('聊天机器人HTML元素未找到，请确保已添加HTML结构');
            return;
        }

        // 触发按钮事件
        chatbotTrigger.addEventListener('click', () => this.toggle());

        // 关闭按钮事件
        if (chatbotClose) {
            chatbotClose.addEventListener('click', () => this.close());
        }

        // 发送消息事件
        if (chatbotSend) {
            chatbotSend.addEventListener('click', () => this.sendMessage());
        }

        // 回车发送
        if (chatbotInput) {
            chatbotInput.addEventListener('keypress', (e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault();
                    this.sendMessage();
                }
            });

            // 输入时的智能提示
            let typingTimer;
            chatbotInput.addEventListener('input', (e) => {
                clearTimeout(typingTimer);
                if (e.target.value.length > 3) {
                    typingTimer = setTimeout(() => {
                        this.showInputThinking();
                    }, 500);
                } else {
                    this.hideInputThinking();
                }
            });
        }

        // 快速回复事件
        document.querySelectorAll('.quick-reply').forEach(button => {
            button.addEventListener('click', () => {
                const message = button.getAttribute('data-message');
                this.addUserMessage(message);
                this.processMessage(message);
                this.hideQuickReplies();
            });
        });

        // 点击外部关闭
        document.addEventListener('click', (e) => {
            const container = document.getElementById('chatbot-container');
            const trigger = document.getElementById('chatbot-trigger');

            if (this.isOpen && container && trigger &&
                !container.contains(e.target) && !trigger.contains(e.target)) {
                this.close();
            }
        });

        // ESC键关闭
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && this.isOpen) {
                this.close();
            }
        });
    }

    toggle() {
        if (this.isOpen) {
            this.close();
        } else {
            this.open();
        }
    }

    open() {
        const container = document.getElementById('chatbot-container');
        const trigger = document.getElementById('chatbot-trigger');
        const notification = document.getElementById('chatbot-notification');

        if (!container || !trigger) return;

        container.classList.add('show');
        trigger.style.display = 'none';
        if (notification) {
            notification.style.display = 'none';
        }
        this.isOpen = true;

        setTimeout(() => {
            this.focusInput();
        }, 400);

        if (this.messageHistory.length <= 1) {
            this.showQuickReplies();
        }
    }

    close() {
        const container = document.getElementById('chatbot-container');
        const trigger = document.getElementById('chatbot-trigger');

        if (!container || !trigger) return;

        container.classList.remove('show');
        setTimeout(() => {
            trigger.style.display = 'flex';
        }, 300);
        this.isOpen = false;
        this.hideInputThinking();
    }

    focusInput() {
        const input = document.getElementById('chatbot-input');
        if (input) {
            input.focus();
        }
    }

    sendMessage() {
        const input = document.getElementById('chatbot-input');
        if (!input) return;

        const message = input.value.trim();

        if (message && !this.isThinking) {
            this.addUserMessage(message);
            input.value = '';
            this.hideInputThinking();
            this.processMessage(message);
            this.hideQuickReplies();
        }
    }

    addUserMessage(message) {
        const messagesContainer = document.getElementById('chatbot-messages');
        if (!messagesContainer) return;

        const messageDiv = document.createElement('div');
        messageDiv.className = 'message user-message message-sending';

        messageDiv.innerHTML = `
            <div class="message-avatar-container">
                <div class="message-avatar">
                    <svg viewBox="0 0 24 24" fill="currentColor">
                        <path d="M12,4A4,4 0 0,1 16,8A4,4 0 0,1 12,12A4,4 0 0,1 8,8A4,4 0 0,1 12,4M12,14C16.42,14 20,15.79 20,18V20H4V18C4,15.79 7.58,14 12,14Z"/>
                    </svg>
                </div>
            </div>
            <div class="message-content">
                <div class="content-text">
                    <p>${this.escapeHtml(message)}</p>
                </div>
            </div>
            <span class="message-time">${this.getCurrentTime()}</span>
        `;

        messagesContainer.appendChild(messageDiv);
        this.scrollToBottom();
        this.messageHistory.push({ role: 'user', content: message });
    }

    async processMessage(message) {
        // 检查缓存
        const cacheKey = message.toLowerCase().trim();
        if (this.responseCache.has(cacheKey)) {
            const cachedResponse = this.responseCache.get(cacheKey);
            this.addBotMessage(cachedResponse);
            return;
        }

        this.isThinking = true;
        this.showAIStatus('AI正在思考...');
        this.showTypingIndicator();

        // 基础延迟
        const baseDelay = 1000 + Math.random() * 1000;

        try {
            let response;

            // 检查是否是追问
            if (this.checkIfFollowUp(message)) {
                response = this.handleFollowUp(message);
            }
            // 默认使用增强的本地AI系统（不依赖外部API）
            else {
                console.log('💭 使用增强的本地智能AI系统');
                response = this.localAI.getBestResponse(message);
            }

            // 缓存短消息的响应
            if (message.length < 50) {
                this.responseCache.set(cacheKey, response);
            }

            setTimeout(() => {
                this.hideTypingIndicator();
                this.hideAIStatus();
                this.addBotMessage(response);
                this.isThinking = false;
            }, baseDelay);

        } catch (error) {
            console.error('处理消息时出错:', error);
            setTimeout(() => {
                this.hideTypingIndicator();
                this.hideAIStatus();
                this.addBotMessage('抱歉，我遇到了一些问题 😅 请稍后再试，或者换个问题问我！');
                this.isThinking = false;
            }, baseDelay);
        }
    }

    checkIfFollowUp(message) {
        const followUpPatterns = [
            /还有呢|另外|其他|更多|详细|具体|补充|继续/,
            /what else|more|another|detail|specific|continue|additional/i,
            /他に|もっと|詳しく|具体的|続けて|追加/
        ];

        return followUpPatterns.some(pattern => pattern.test(message));
    }

    handleFollowUp(message) {
        const language = this.languageDetector.detectLanguageAdvanced(message);

        if (this.lastTopic) {
            const expansion = this.localAI.expandTopic(this.lastTopic, language);
            if (expansion) {
                return expansion;
            }
        }

        // 通用追问回复
        const followUpResponses = {
            zh: "让我再想想...你可以问我关于Zyyo的其他方面，比如他的教育背景、兴趣爱好或者未来规划！",
            en: "Let me think... You can ask me about other aspects of Zyyo, like his education, hobbies, or future plans!",
            ja: "もう少し考えさせてください...Zyyoの教育、趣味、将来の計画など、他の側面について聞いてください！"
        };

        return followUpResponses[language] || followUpResponses.zh;
    }

    async callHuggingFaceAPI(message, retryCount = 0) {
        try {
            const language = this.languageDetector.detectLanguageAdvanced(message);
            console.log('🌐 检测到语言:', language);

            // 获取当前模型URL
            let apiUrl = aiChatbotConfig.apiConfig.apiUrl;

            // 如果主模型失败，尝试备选模型
            if (retryCount > 0 && aiChatbotConfig.apiConfig.fallbackModels[retryCount - 1]) {
                apiUrl = aiChatbotConfig.apiConfig.fallbackModels[retryCount - 1].url;
                console.log(`🔄 尝试备选模型: ${aiChatbotConfig.apiConfig.fallbackModels[retryCount - 1].name}`);
            }

            // 为Qwen2构建特定的提示格式
            let prompt;
            if (apiUrl.includes('Qwen')) {
                // Qwen2模型的特定格式
                const systemPrompt = language === 'zh' ?
                    "你是Zyyo的AI助手。Zyyo是一名大一学生，擅长全栈开发，来自河南。请友好、专业地回答问题。" :
                    language === 'en' ?
                        "You are Zyyo's AI assistant. Zyyo is a freshman student skilled in full-stack development from Henan. Please answer questions in a friendly and professional manner." :
                        "あなたはZyyoのAIアシスタントです。Zyyoは河南省出身の1年生で、フルスタック開発に精通しています。親切でプロフェッショナルな方法で質問に答えてください。";

                prompt = `<|im_start|>system\n${systemPrompt}<|im_end|>\n<|im_start|>user\n${message}<|im_end|>\n<|im_start|>assistant\n`;
            } else {
                // 其他模型的通用格式
                if (language === 'ja') {
                    prompt = `質問: ${message}\n回答:`;
                } else if (language === 'en') {
                    prompt = `Q: ${message}\nA:`;
                } else {
                    prompt = `问：${message}\n答：`;
                }
            }

            const response = await fetch(apiUrl, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${aiChatbotConfig.apiConfig.apiKey}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    inputs: prompt,
                    parameters: {
                        max_new_tokens: 200,
                        temperature: 0.7,
                        top_p: 0.9,
                        do_sample: true,
                        repetition_penalty: 1.5,
                        no_repeat_ngram_size: 3,
                        return_full_text: false
                    },
                    options: {
                        wait_for_model: true,
                        use_cache: false
                    }
                })
            });

            if (!response.ok) {
                console.warn(`API响应错误: ${response.status} ${response.statusText}`);

                // 如果是404错误，尝试备选模型
                if (response.status === 404 && retryCount < aiChatbotConfig.apiConfig.fallbackModels.length) {
                    console.log('❌ 模型不可用，尝试备选模型...');
                    return await this.callHuggingFaceAPI(message, retryCount + 1);
                }

                // 如果所有模型都失败，使用本地回复
                return this.localAI.getBestResponse(message);
            }

            const data = await response.json();
            console.log('📥 API响应:', data);

            let aiResponse = '';

            // 处理不同的响应格式
            if (Array.isArray(data)) {
                if (data.length > 0 && data[0].generated_text) {
                    aiResponse = data[0].generated_text;
                }
            } else if (data.generated_text) {
                aiResponse = data.generated_text;
            } else if (data.error) {
                console.warn('API错误:', data.error);
                // 如果模型正在加载，显示提示信息
                if (data.error.includes('loading')) {
                    return language === 'zh' ?
                        "AI模型正在加载中，请稍等片刻再试...或者你可以问我关于Zyyo的具体信息！" :
                        language === 'en' ?
                            "AI model is loading, please wait a moment... Or you can ask me specific questions about Zyyo!" :
                            "AIモデルを読み込んでいます。しばらくお待ちください...またはZyyoについて具体的な質問をしてください！";
                }
                return this.localAI.getBestResponse(message);
            }

            // 清理和验证响应
            aiResponse = this.cleanAPIResponse(aiResponse, message, language, apiUrl);

            // 如果清理后的响应质量不好，使用本地回复
            if (!aiResponse || aiResponse.length < 10) {
                return this.localAI.getBestResponse(message);
            }

            // 更新对话上下文
            this.conversationContext.push(
                { role: 'user', content: message },
                { role: 'assistant', content: aiResponse }
            );

            return aiResponse;

        } catch (error) {
            console.error('❌ API调用失败:', error);

            // 网络错误时的特殊处理
            if (error.message.includes('Failed to fetch')) {
                const language = this.languageDetector.detectLanguageAdvanced(message);
                return language === 'zh' ?
                    "网络连接出现问题，但我仍然可以回答你关于Zyyo的问题！请问你想了解什么？" :
                    language === 'en' ?
                        "Network connection issue, but I can still answer questions about Zyyo! What would you like to know?" :
                        "ネットワーク接続に問題がありますが、Zyyoについての質問に答えることができます！何を知りたいですか？";
            }

            return this.localAI.getBestResponse(message);
        }
    }

    cleanAPIResponse(response, originalMessage, language, apiUrl) {
        let cleaned = response.trim();

        // 移除可能的输入重复
        if (cleaned.toLowerCase().startsWith(originalMessage.toLowerCase())) {
            cleaned = cleaned.substring(originalMessage.length).trim();
        }

        // 移除Qwen2特定的标记
        if (apiUrl.includes('Qwen')) {
            cleaned = cleaned.replace(/<\|im_start\|>assistant\n?/g, '')
                .replace(/<\|im_end\|>/g, '')
                .replace(/<\|im_start\|>user\n?/g, '')
                .replace(/<\|im_start\|>system\n?/g, '');
        }

        // 移除其他常见的问答标记
        const qaMarkers = [
            /^(问：|答：|Q:|A:|質問:|回答:|User:|Assistant:|Human:|AI:)/gi,
            /^(用户[:：]|助手[:：]|机器人[:：])/gi,
            /^(Question:|Answer:|询问:|回复:)/gi
        ];

        qaMarkers.forEach(marker => {
            cleaned = cleaned.replace(marker, '').trim();
        });

        // 智能句子去重
        const sentenceEndings = language === 'ja' ? /[。！？]/ :
            language === 'en' ? /[.!?]/ : /[.!?。！？]/;

        const sentences = cleaned.split(sentenceEndings).filter(s => s.trim().length > 0);
        const cleanedSentences = [];
        let lastSentence = '';

        for (let sentence of sentences) {
            const trimmed = sentence.trim();
            // 只去除连续的完全相同的句子
            if (trimmed !== lastSentence && trimmed.length > 0) {
                cleanedSentences.push(trimmed);
                lastSentence = trimmed;
            }
        }

        if (cleanedSentences.length > 0) {
            const ending = language === 'ja' ? '。' :
                language === 'en' ? '.' : '。';
            cleaned = cleanedSentences.join(ending) + ending;
        }

        // 确保有合适的结尾
        if (cleaned.length > 10 && !/[.!?。！？]$/.test(cleaned)) {
            cleaned += language === 'en' ? '.' : '。';
        }

        return cleaned;
    }

    addBotMessage(message) {
        const messagesContainer = document.getElementById('chatbot-messages');
        if (!messagesContainer) return;

        // 尝试识别回复的主题
        this.identifyTopic(message);

        const messageDiv = document.createElement('div');
        messageDiv.className = 'message bot-message';

        messageDiv.innerHTML = `
            <div class="message-avatar-container">
                <div class="avatar-ring"></div>
                <div class="message-avatar">
                    <svg viewBox="0 0 24 24" fill="currentColor">
                        <path d="M12 2C13.1 2 14 2.9 14 4C14 5.1 13.1 6 12 6C10.9 6 10 5.1 10 4C10 2.9 10.9 2 12 2Z"/>
                    </svg>
                </div>
            </div>
            <div class="message-content">
                <div class="message-glow"></div>
                <div class="content-text">
                    ${this.formatMessage(message)}
                </div>
            </div>
            <span class="message-time">${this.getCurrentTime()}</span>
        `;

        messagesContainer.appendChild(messageDiv);
        this.scrollToBottom();
        this.messageHistory.push({ role: 'assistant', content: message });

        // 打字机效果
        this.typewriterEffect(messageDiv.querySelector('.content-text'));
    }

    identifyTopic(message) {
        const topics = ['skills', 'projects', 'contact', 'education', 'hobbies'];
        const messageLower = message.toLowerCase();

        for (let topic of topics) {
            const keywords = aiChatbotConfig.responses[topic]?.keywords || [];
            if (keywords.some(keyword => messageLower.includes(keyword.toLowerCase()))) {
                this.lastTopic = topic;
                break;
            }
        }
    }

    typewriterEffect(element) {
        const html = element.innerHTML;
        element.innerHTML = '';
        element.style.opacity = '1';

        let index = 0;
        const speed = 20;

        function type() {
            if (index < html.length) {
                if (html.charAt(index) === '<') {
                    const tagEnd = html.indexOf('>', index);
                    if (tagEnd !== -1) {
                        element.innerHTML += html.substring(index, tagEnd + 1);
                        index = tagEnd + 1;
                    } else {
                        element.innerHTML += html.charAt(index);
                        index++;
                    }
                } else {
                    element.innerHTML += html.charAt(index);
                    index++;
                }
                setTimeout(type, speed);
            }
        }

        type();
    }

    showTypingIndicator() {
        const messagesContainer = document.getElementById('chatbot-messages');
        if (!messagesContainer) return;

        const typingDiv = document.createElement('div');
        typingDiv.className = 'typing-indicator-large typing-message';
        typingDiv.innerHTML = `
            <div class="message-avatar-container">
                <div class="avatar-ring"></div>
                <div class="message-avatar">
                    <svg viewBox="0 0 24 24" fill="currentColor">
                        <path d="M12 2C13.1 2 14 2.9 14 4C14 5.1 13.1 6 12 6C10.9 6 10 5.1 10 4C10 2.9 10.9 2 12 2Z"/>
                    </svg>
                </div>
            </div>
            <div class="typing-dots">
                <div class="dot"></div>
                <div class="dot"></div>
                <div class="dot"></div>
            </div>
        `;

        messagesContainer.appendChild(typingDiv);
        this.scrollToBottom();
    }

    hideTypingIndicator() {
        const typingMessage = document.querySelector('.typing-message');
        if (typingMessage) {
            typingMessage.remove();
        }
    }

    showInputThinking() {
        const indicator = document.getElementById('input-thinking');
        if (indicator) {
            indicator.style.display = 'flex';
        }
    }

    hideInputThinking() {
        const indicator = document.getElementById('input-thinking');
        if (indicator) {
            indicator.style.display = 'none';
        }
    }

    showAIStatus(message) {
        const status = document.getElementById('ai-status');
        if (status) {
            status.querySelector('span').textContent = message;
            status.style.display = 'flex';
        }
    }

    hideAIStatus() {
        const status = document.getElementById('ai-status');
        if (status) {
            status.style.display = 'none';
        }
    }

    showQuickReplies() {
        const quickReplies = document.getElementById('chatbot-quick-replies');
        if (quickReplies) {
            quickReplies.style.display = 'block';
        }
    }

    hideQuickReplies() {
        const quickReplies = document.getElementById('chatbot-quick-replies');
        if (quickReplies) {
            quickReplies.style.display = 'none';
        }
    }

    formatMessage(message) {
        return message
            .replace(/\n/g, '<br>')
            .replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>')
            .replace(/\*([^*]+)\*/g, '<em>$1</em>')
            .replace(/• /g, '<span style="color: var(--color-accent);">•</span> ')
            .replace(/(https?:\/\/[^\s]+)/g, '<a href="$1" target="_blank" style="color: var(--color-accent); text-decoration: underline;">$1</a>');
    }

    escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }

    getCurrentTime() {
        return new Date().toLocaleTimeString('zh-CN', {
            hour: '2-digit',
            minute: '2-digit'
        });
    }

    scrollToBottom() {
        const messagesContainer = document.getElementById('chatbot-messages');
        if (messagesContainer) {
            setTimeout(() => {
                messagesContainer.scrollTop = messagesContainer.scrollHeight;
            }, 100);
        }
    }

    showNotificationAfterDelay() {
        setTimeout(() => {
            if (!this.isOpen) {
                const notification = document.getElementById('chatbot-notification');
                if (notification) {
                    notification.style.display = 'flex';

                    const trigger = document.getElementById('chatbot-trigger');
                    if (trigger) {
                        trigger.style.animation = 'swing 0.5s ease-in-out 3';
                    }
                }
            }
        }, 8000);
    }

    initWelcomeMessage() {
        this.messageHistory.push({
            role: 'assistant',
            content: 'Welcome message initialized'
        });
    }

    // 公共方法
    clearHistory() {
        const messagesContainer = document.getElementById('chatbot-messages');
        if (messagesContainer) {
            const messages = messagesContainer.querySelectorAll('.message:not(.welcome-message)');
            messages.forEach(msg => msg.remove());

            this.messageHistory = this.messageHistory.slice(0, 1);
            this.conversationContext = [];
            this.responseCache.clear();
            this.lastTopic = null;
            this.showQuickReplies();
        }
    }

    configureAPI(apiUrl, apiKey, model = 'Qwen2-7B-Instruct') {
        aiChatbotConfig.apiConfig.apiUrl = apiUrl;
        aiChatbotConfig.apiConfig.apiKey = apiKey;
        aiChatbotConfig.apiConfig.model = model;

        console.log('✅ AI API已配置！');
        console.log(`📍 模型: ${model}`);
        console.log(`🔗 URL: ${apiUrl}`);
    }

    getHistory() {
        return this.messageHistory;
    }

    getStats() {
        return {
            totalMessages: this.messageHistory.length,
            userMessages: this.messageHistory.filter(m => m.role === 'user').length,
            botMessages: this.messageHistory.filter(m => m.role === 'assistant').length,
            cachedResponses: this.responseCache.size,
            lastTopic: this.lastTopic,
            currentModel: aiChatbotConfig.apiConfig.model
        };
    }
}

// 添加必要的CSS动画
const chatbotAnimations = `
@keyframes swing {
    0% { transform: rotate(0deg); }
    25% { transform: rotate(-5deg); }
    75% { transform: rotate(5deg); }
    100% { transform: rotate(0deg); }
}

@keyframes fadeIn {
    from { opacity: 0; transform: translateY(10px); }
    to { opacity: 1; transform: translateY(0); }
}

@keyframes pulse {
    0% { transform: scale(1); }
    50% { transform: scale(1.05); }
    100% { transform: scale(1); }
}
`;

// 插入样式
const styleElement = document.createElement('style');
styleElement.textContent = chatbotAnimations;
document.head.appendChild(styleElement);

// 全局实例
let zyyoChatbot = null;

// 初始化
document.addEventListener('DOMContentLoaded', function () {
    setTimeout(() => {
        const chatbotTrigger = document.getElementById('chatbot-trigger');
        if (chatbotTrigger) {
            zyyoChatbot = new EnhancedZyyoChatbot();

            // 暴露到全局
            window.chatbot = zyyoChatbot;

            console.log(`
🤖 Zyyo AI聊天助手 v2.0 已加载！

📊 当前配置：
• 模型: ${aiChatbotConfig.apiConfig.model}
• API: ${aiChatbotConfig.apiConfig.apiUrl}
• Token: ${aiChatbotConfig.apiConfig.apiKey === 'hf_your-huggingface-token' ? '❌ 需要配置' : '✅ 已配置'}

🔄 备选模型：
${aiChatbotConfig.apiConfig.fallbackModels.map((m, i) => `  ${i + 1}. ${m.name}`).join('\n')}

🚀 主要特性：
• 支持 Qwen2-7B-Instruct 模型
• 自动故障转移到备选模型
• 优化的多语言检测
• 智能本地回复系统
• 防止重复回复机制
• 响应缓存提升性能

💡 可用命令：
• window.chatbot.configureAPI(url, key, model) - 配置API
• window.chatbot.clearHistory() - 清空对话历史
• window.chatbot.getStats() - 查看统计信息

⚠️ 注意：如果遇到404错误，系统会自动尝试备选模型！

✨ 支持中文、英文、日语智能对话！
            `);
        } else {
            console.warn('⚠️ 聊天机器人HTML元素未找到');
        }
    }, 1000);
});

// 页面卸载清理
window.addEventListener('beforeunload', () => {
    if (zyyoChatbot) {
        zyyoChatbot.close();
    }
});

// ============================================================================
// 文件结束 - Zyyo AI聊天机器人完整优化版 (支持Qwen2)
// ============================================================================