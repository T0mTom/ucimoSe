exports.handler = async (event) => {
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, body: 'Method Not Allowed' };
  }

  const key = process.env.AZURE_TTS_KEY;
  const region = process.env.AZURE_TTS_REGION;
  const endpoint = process.env.AZURE_TTS_ENDPOINT;
  const voice = process.env.AZURE_TTS_VOICE || 'sl-SI-PetraNeural';

  if (!key || (!region && !endpoint)) {
    const missing = [];
    if (!key) missing.push('AZURE_TTS_KEY');
    if (!region && !endpoint) missing.push('AZURE_TTS_REGION or AZURE_TTS_ENDPOINT');
    return {
      statusCode: 503,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        error: 'Azure TTS is not configured.',
        missing,
      }),
    };
  }

  try {
    const payload = JSON.parse(event.body || '{}');
    const text = String(payload.text || '').trim();
    const rate = Number(payload.rate ?? 0.88);

    if (!text) {
      return { statusCode: 400, body: 'Missing text.' };
    }

    // Map 0.5..1.5 -> -50..+50%
    const ratePercent = Math.max(-50, Math.min(50, Math.round((rate - 1) * 100)));
    const escapedText = text
      .replaceAll('&', '&amp;')
      .replaceAll('<', '&lt;')
      .replaceAll('>', '&gt;')
      .replaceAll('"', '&quot;')
      .replaceAll("'", '&apos;');

    const ssml = `
<speak version="1.0" xml:lang="sl-SI">
  <voice xml:lang="sl-SI" name="${voice}">
    <prosody rate="${ratePercent >= 0 ? '+' : ''}${ratePercent}%">${escapedText}</prosody>
  </voice>
</speak>`.trim();

    const requestOptions = {
      method: 'POST',
      headers: {
        'Ocp-Apim-Subscription-Key': key,
        'Content-Type': 'application/ssml+xml',
        'X-Microsoft-OutputFormat': 'audio-24khz-48kbitrate-mono-mp3',
        'User-Agent': 'ucenje-slovenscina',
      },
      body: ssml,
    };

    const urlsToTry = [];
    if (endpoint) urlsToTry.push(`${endpoint.replace(/\/+$/, '')}/cognitiveservices/v1`);
    if (region) urlsToTry.push(`https://${region}.tts.speech.microsoft.com/cognitiveservices/v1`);

    let azureResp = null;
    let lastErrorText = '';

    for (const url of urlsToTry) {
      azureResp = await fetch(url, requestOptions);
      if (azureResp.ok) break;
      lastErrorText = await azureResp.text();
      // 404 is often wrong host/resource for TTS path; try next candidate.
      if (azureResp.status !== 404) break;
    }

    if (!azureResp.ok) {
      return { statusCode: azureResp.status, body: `Azure TTS error: ${lastErrorText}` };
    }

    const audioBuffer = Buffer.from(await azureResp.arrayBuffer());
    return {
      statusCode: 200,
      isBase64Encoded: true,
      headers: {
        'Content-Type': 'audio/mpeg',
        'Cache-Control': 'no-store',
      },
      body: audioBuffer.toString('base64'),
    };
  } catch (err) {
    return {
      statusCode: 500,
      body: `TTS server error: ${err?.message || 'Unknown error'}`,
    };
  }
};
