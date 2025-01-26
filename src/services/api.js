const API_URL = 'https://api.deepseek.com/v1/chat/completions';
const API_KEY = 'Bearer sk-2ee3ceadef444e0ca75dbfcf8153f93a';
const MODEL = "deepseek-chat"

const makeRequest = async (messages, needJsonResponse = false) => {
  const requestBody = {
    frequency_penalty: 1.0,
    max_tokens: 8192,
    messages,
    model: MODEL,
    n: 1,
    presence_penalty: 1.0,
    stream: false,
    temperature: 1.0,
    top_p: 0.6,
    user: "65e9710a1b8a68677dc6711d"
  };

  if (needJsonResponse) {
    requestBody.response_format = { type: 'json_object' };
  }

  const response = await fetch(API_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': API_KEY
    },
    body: JSON.stringify(requestBody)
  });

  if (!response.ok) {
    throw new Error(`请求失败: ${response.status}`);
  }

  const data = await response.json();
  return data.choices[0].message.content;
};

export const translateText = async (text, mode = 'writing') => {
  try {
    const systemPrompt = mode === 'speaking' ?
      "你是一个英语翻译专家，请将内容翻译成英文。注意使用日常口语表达，要自然流畅，符合母语者的表达习惯。可以适当使用缩写形式（如I'm、don't等），语气要更加轻松自然。每句话都用英文句号结尾。" :
      "你是一个英语翻译专家，请将内容翻译成英文。使用正式的书面语表达，选择准确的词汇，注意语法规范。避免使用缩写形式，保持文字的严谨性和正式性。每句话都用英文句号结尾。";

    const messages = [
      {
        content: systemPrompt,
        role: "system"
      },
      {
        content: text,
        role: "user"
      }
    ];
    return await makeRequest(messages, false);
  } catch (error) {
    console.error('翻译出错:', error);
    throw new Error('翻译服务暂时不可用，请稍后再试');
  }
};

export const analyzeEnglishGrammar = async (sentence) => {
  try {
    const messages = [
      {
        content: "你是一个英语语法专家，请分析下面这个英语句子中每个单词的词性和语法功能。要求：\n1. 对每个单词标注词性（名词、动词、形容词、副词、介词等）\n2. 说明每个单词在句子中的语法功能\n3. 分析句子的整体结构\n\n请用简洁的中文回答，重点标注每个单词的词性。注意要返回简体中文！",
        role: "system"
      },
      {
        content: sentence,
        role: "user"
      }
    ];
    return await makeRequest(messages, false);
  } catch (error) {
    console.error('语法分析出错:', error);
    throw new Error('语法分析服务暂时不可用，请稍后再试');
  }
};

export const analyzeWordTypes = async (chineseText, englishText) => {
  try {
    const messages = [
      {
        content: `你是一个语言分析专家，请分析以下中英文句子中的动词名词或词组。

中文：${chineseText}
英文：${englishText}

要求：
1. 返回JSON格式的数据，包含句子的词或词组：
   - chinese: 中文词
   - english: 英文词

示例格式：
{
  "segments": [
    {
      "chinese": "喜欢",
      "english": "love"
    }
  ]
}

注意：
1. 确保中英文对应关系准确
2. 确保json格式正确性
3. 确保只要动名词`,
        role: "system"
      },
      {
        content: "我给你的是完全对应的中英翻译内容，请只分析分析上述中英文句子的重点词汇",
        role: "user"
      }
    ];
    const response = await makeRequest(messages, true);
    return JSON.parse(response);
  } catch (error) {
    console.error('词性分析出错:', error);
    throw new Error('词性分析服务暂时不可用，请稍后再试');
  }
};

export const analyzeChineseContent = async (text) => {
  try {
    const messages = [
      {
        content: `你是一个中文文本分析专家，请分析以下中文文本的重点内容。

要求：
1. 返回JSON格式的数据
2. 标注重点词汇和关键句子
3. 分析文本的主要含义

示例格式：
{
  "keywords": ["重点词1", "重点词2"],
  "keySentences": ["关键句子1", "关键句子2"],
  "mainIdea": "文本主要含义"
}

注意：
1. 确保json格式正确
2. 重点词汇和关键句子要准确反映文本重点
3. 主要含义要简明扼要`,
        role: "system"
      },
      {
        content: text,
        role: "user"
      }
    ];
    const response = await makeRequest(messages, true);
    return JSON.parse(response);
  } catch (error) {
    console.error('内容分析出错:', error);
    throw new Error('内容分析服务暂时不可用，请稍后再试');
  }
};

export const getRandomChineseArticle = async () => {
  try {
    const gptPromptTemplate = `
你是一个中文写作专家，请生成一篇简短的中文文章（100-200字左右）。
文章要求：
1. 主题可以是生活感悟、故事、描写等
2. 语言要优美流畅
3. 内容要积极向上
4. 适合用作英语学习的翻译材料

请直接返回文章内容，不需要添加标题或其他说明。
`;

    const messages = [
      {
        content: gptPromptTemplate,
        role: "system"
      },
      {
        content: "请生成一篇短文",
        role: "user"
      }
    ];
    return await makeRequest(messages, false);
  } catch (error) {
    console.error('获取随机文章失败:', error);
    throw new Error('获取随机文章服务暂时不可用，请稍后再试');
  }
};