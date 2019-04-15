import { get } from 'axios';
import { load } from 'cheerio';

// Main route (simple Hello World Message)
export default (app, db) => {
  app.get('/', (req, res) => {
    res.send('Hello world');
  });

  app.get('/all', (req, res) => {
    db.newsScraper.find({}, (err, data) => {
      if (err) {
        throw err;
      } else {
        res.json(data);
      }
    });
  });

  app.get('/import', (req, res) => {
    get('http://www.infowars.com/category/world-news/').then((response) => {
      const $ = load(response.data);
      const articles = db.newsScraper.find().sort({ index: -1 }).limit(10);
      const count = db.newsScraper.count();
      $('div.article').each((i, element) => {
        const title = $(element).find('h3').text();
        const description = $(element).find('h4').text();
        const link = $(element).find('a').attr('href');
        const img = $(element).find('img') ? $(element).find('img').attr('src') : 'n/a';
        const numPages = Math.ceil(count / 10);
        db.newsScraper.update(
          {
            title,
          },
          {
            title,
            description,
            link,
            img,
          },
          {
            upsert: true,
          },
        );
        res.json({
          articles,
          numPages,
        });
      });
    });
  });
  // Route for pagination
  app.get('/:pageNum', (req, res) => {
    const { pageNum } = req.params;
    const count = db.newsScraper.count();
    const numPages = Math.ceil(count / 10);
    const articles = db.newsScraper.find({ index: { $lt: count - (pageNum * 10) } }).limit(10);
    res.send({
      articles,
      numPages,
    });
  });
};
