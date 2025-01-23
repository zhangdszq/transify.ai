
// const API_URL = 'https://public-oneapi.vipkid.com/v1/chat/completions';
// const API_KEY = 'sk-KxqlizeYzsPYbKuS502dE546B08e4808Ab14516dC89a6727';
// const MODEL = "gpt-4o"

const API_URL = 'https://api.deepseek.com/v1/chat/completions';
const API_KEY = 'Bearer sk-2ee3ceadef444e0ca75dbfcf8153f93a';
const MODEL = "deepseek-chat"

const makeRequest = async (messages) => {
  const response = await fetch(API_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': API_KEY
    },
    body: JSON.stringify({
      frequency_penalty: 1.0,
      max_tokens: 2048,
      messages,
      model: MODEL,
      n: 1,
      presence_penalty: 1.0,
      stream: false,
      temperature: 1.0,
      top_p: 0.6,
      user: "65e9710a1b8a68677dc6711d"
    })
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
    return await makeRequest(messages);
  } catch (error) {
    console.error('翻译出错:', error);
    throw new Error('翻译服务暂时不可用，请稍后再试');
  }
};

export const analyzeEnglishGrammar = async (sentence) => {
  try {
    const messages = [
      {
        content: "你是一个英语语法专家，请详细分析下面这个英语句子的语法结构。分析应包含以下部分：\n\n1. 主要句子成分分析：\n- 主语部分：指出主语及其修饰语，说明各个词的词性\n- 谓语部分：说明谓语动词的形式、时态、语气等\n- 宾语/表语部分：指出宾语或表语及其修饰语\n\n2. 从句分析（如果有）：\n- 从句类型\n- 从句引导词\n- 从句的完整结构分析\n\n3. 句子结构总结：\n- 主句结构概述\n- 从句与主句的关系\n- 各成分之间的关系\n\n请用中文回答，按照上述结构清晰地组织分析内容。每个部分都要详细说明词性和语法功能。注意要返回简体中文！",
        role: "system"
      },
      {
        content: sentence,
        role: "user"
      }
    ];
    return await makeRequest(messages);
  } catch (error) {
    console.error('语法分析出错:', error);
    throw new Error('语法分析服务暂时不可用，请稍后再试');
  }
};

export const analyzeChineseGrammar = async (text) => {
  try {

    const gptPromptTemplate = `
请逐层分解以下中文句子的语法结构，从整体到细节，明确每个部分的角色（如主语、谓语、宾语、定语、状语等），并输出清晰的分层结果。
全部以简体中文输出， 并且不需要问我问题，最后给出英文示例

`;


    const messages = [
      {
        content: gptPromptTemplate,
        role: "system"
      },
      {
        content: text,
        role: "user"
      }
    ];
    return await makeRequest(messages);
  } catch (error) {
    console.error('分析出错:', error);
    throw new Error('分析服务暂时不可用，请稍后再试');
  }
};