import { buildFullUrl } from './httpClient';
export function generateCode(method, url, params, headers, body, lang) {
    const fullUrl = buildFullUrl(url, params);
    const activeHeaders = headers.filter((h) => h && h.enabled && h.key);
    if (lang === 'curl') {
        let curl = `curl -X ${method} "${fullUrl}"`;
        activeHeaders.forEach((h) => {
            curl += ` \\\n  -H "${h.key}: ${h.value}"`;
        });
        if (['POST', 'PUT', 'PATCH'].includes(method) && body) {
            curl += ` \\\n  -d '${body.replace(/\n/g, '')}'`;
        }
        return curl;
    }
    if (lang === 'javascript') {
        const headerObj = {};
        activeHeaders.forEach((h) => (headerObj[h.key] = h.value));
        let js = `fetch("${fullUrl}", {\n  method: "${method}",\n`;
        if (Object.keys(headerObj).length > 0) {
            js += `  headers: ${JSON.stringify(headerObj, null, 4)},\n`;
        }
        if (['POST', 'PUT', 'PATCH'].includes(method) && body) {
            js += `  body: JSON.stringify(${body}),\n`;
        }
        js += `})\n  .then(res => res.json())\n  .then(data => console.log(data))\n  .catch(err => console.error(err));`;
        return js;
    }
    if (lang === 'python') {
        let py = `import requests\n\nurl = "${fullUrl}"\n`;
        if (activeHeaders.length > 0) {
            const headerObj = {};
            activeHeaders.forEach((h) => (headerObj[h.key] = h.value));
            py += `headers = ${JSON.stringify(headerObj, null, 4)}\n`;
        }
        if (['POST', 'PUT', 'PATCH'].includes(method) && body) {
            py += `payload = ${body}\n`;
            py += `response = requests.${method.toLowerCase()}(url, json=payload${activeHeaders.length ? ', headers=headers' : ''})\n`;
        }
        else {
            py += `response = requests.${method.toLowerCase()}(url${activeHeaders.length ? ', headers=headers' : ''})\n`;
        }
        py += `print(response.json())`;
        return py;
    }
    return '';
}
export default generateCode;