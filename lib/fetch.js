import https from 'https';
import qs from 'qs';

export default function fetch(path, data) {
  const post = qs.stringify(data);

  return new Promise((resolve, reject) => {
    const req = https.request({
      hostname: 'api.telegram.org',
      method: data ? 'POST' : 'GET',
      path: '/bot' + path,
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
      }
    }, response => {
      return getBody(response).then(res => {
        try {
          let json = JSON.parse(res);
          resolve(json);
        } catch(e) {
          reject(e);
        }
      }).catch(reject);
    });

    if (post) {
      req.write(post);
    }
    req.end();
  }).catch(err => {
    console.error('Error sending request', err);
  });
}

export function getBody(stream) {
  let data = '';

  return new Promise((resolve, reject) => {
    stream.on('data', chunk => {
      data += chunk;
    });

    stream.on('end', () => {
      resolve(data);
    });

    stream.on('error', reject);
  });
}
