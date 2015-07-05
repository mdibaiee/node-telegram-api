import restler from 'restler';

export default function fetch(path, data = {}) {
  return new Promise((resolve, reject) => {
    const method = Object.keys(data).length ? 'POST' : 'GET';
    const multipart = method === 'POST' ? true : false;

    restler.request('https://api.telegram.org/bot' + path, {
      data, method, multipart
    }).on('complete', response => {
      try {
        let json = JSON.parse(response);
        resolve(json);
      } catch(e) {
        reject(e);
      }
    });
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
