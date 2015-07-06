import unirest from 'unirest';

export default function fetch(path, data = {}) {
  return new Promise((resolve, reject) => {
    const files = {};

    for (let key of Object.keys(data)) {
      if (data[key].file) {
        files[key] = data[key].file;
        delete data[key];
      }
    }

    unirest.post('https://api.telegram.org/bot' + path)
    .field(data)
    .attach(files)
    .end(response => {
      if (response.statusType === 4 || response.statusType === 5) {
        reject(response);
      } else {
        resolve(response.body);
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
