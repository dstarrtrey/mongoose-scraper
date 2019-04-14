import { get } from 'axios';
import { load } from 'cheerio';

// Main route (simple Hello World Message)
export default (app, db) => {
  app.get('/', (req, res) => {
    res.send('Hello world');
  });

  app.get('/all', (req, res) => {
    db.newsScraper.find({}, (err, data) => {
      res.json(data);
    });
  });

  app.get('/', (req, res) => {
    get('https://www.infowars.com/category/world-news/').then((response) => {
      const $ = load(response.data);
      $('div.article').each((i, element) => {
        const title = $(element).find('h3').text();
        const description = $(element).find('h4').text();
        const link = $(element).find('a').attr('href');
        const img = $(element).find('img').attr('src');
        const articles = db.newsScraper.find().sort({ index: -1 }).limit(10);
        const count = db.newsScraper.count();
        const numPages = Math.ceil(count / 10);
        db.scraper.update(
          {
            title,
          },
          {
            index: count + 1,
            title,
            description,
            link,
            img,
          },
          {
            upsert: true,
          },
        );
        res.send({
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
