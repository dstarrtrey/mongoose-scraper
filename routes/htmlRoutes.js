import path from 'path';

export default (app) => {
  app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '../public/index.html'));
  });
  app.get('/p:pageNum', (req, res) => {
    res.sendFile(path.join(__dirname, '../public/index.html'));
  });
};
