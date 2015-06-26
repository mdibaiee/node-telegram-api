import https from 'https';
import qs from 'qs';

export default function(path, data) {
  const post = qs.stringify(data);

  return new Promise((resolve, reject) => {
    let res = '';

    const req = https.request({
      hostname: 'api.telegram.org',
      method: data ? 'POST' : 'GET',
      path: '/bot' + path,
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
      }
    }, response => {
      response.on('data', chunk => {
        res += chunk;
      });

      response.on('end', () => {
        try {
          let json = JSON.parse(res);
          resolve(json);
        } catch(e) {
          reject(e);
        }
      });
    }).on('error', reject);

    if (post) {
      req.write(post);
    }
    req.end();
  });
}
