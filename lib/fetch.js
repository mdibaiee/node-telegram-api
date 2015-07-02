import FormData from 'form-data';

export default function fetch(path, data = {}) {
  const form = new FormData();
  const keys = Object.keys(data);

  for (let key of keys) {
    form.append(key, data[key]);
  }


  return new Promise((resolve, reject) => {
    form.getLength((err, length) => {
      if (err) {
        return reject(err);
      }

      form.submit({
        protocol: 'https:',
        host: 'api.telegram.org',
        path: '/bot' + path,
        headers: {
          'Content-Length': length
        }
      }, (error, response) => {
        if (error) {
          return reject(error);
        }

        return getBody(response).then(body => {
          try {
            let json = JSON.parse(body);
            resolve(json);
          } catch(e) {
            reject(e);
          }
        }).catch(reject);
      });
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
