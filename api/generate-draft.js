module.exports = async (req, res) => {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  try {
    const { profile, direction } = req.body || {};
    if (!profile || !direction) {
      return res.status(400).json({ error: 'Missing profile or direction' });
    }

    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      return res.status(500).json({ error: 'GEMINI_API_KEY is not configured' });
    }

    const prompt = [
      '你是一个资深生涯规划顾问。',
      `用户简介: ${profile}`,
      `目标方向: ${direction}`,
      '请生成“初稿计划”，输出格式必须包含：',
      '1) 目标拆解（3个阶段）',
      '2) 30天行动清单（按周）',
      '3) 风险与应对（至少4条）',
      '4) 每周复盘模板（可直接填写）',
      '内容请务实、可执行、中文输出。',
    ].join('\n');

    const resp = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{ parts: [{ text: prompt }] }],
          generationConfig: {
            temperature: 0.7,
            topP: 0.9,
            maxOutputTokens: 1400,
          },
        }),
      }
    );

    if (!resp.ok) {
      const detail = await resp.text();
      return res.status(502).json({ error: 'Gemini API request failed', detail });
    }

    const data = await resp.json();
    const text =
      data?.candidates?.[0]?.content?.parts?.map((p) => p.text).join('\n').trim() || '';

    if (!text) {
      return res.status(502).json({ error: 'Empty draft from Gemini' });
    }

    return res.status(200).json({ draft: text });
  } catch (err) {
    return res.status(500).json({ error: err.message || 'Unexpected server error' });
  }
};
