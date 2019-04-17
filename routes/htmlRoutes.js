import { get as axGet } from 'axios';
import { load } from 'cheerio';
import { Article } from '../models';

export default (app) => {
  // app.get('/', (req, res) => {
  //   axGet('http://www.infowars.com/category/world-news/').then((response) => {
  //     const $ = load(response.data);

  //     $('div.article').each((i, element) => {
  //       const title = $(element).find('h3').text().trim();
  //       const description = $(element).find('h4').text().trim();
  //       const link = $(element).find('a').attr('href').trim();
  //       const img = $(element).find('img').attr('src').trim();

  //       Article.findOneAndUpdate(
  //         {
  //           title,
  //         },
  //         new Article({
  //           title,
  //           description,
  //           link,
  //           img,
  //         }),
  //         {
  //           upsert: true,
  //         },
  //       );
  //     }).then(() => {
  //       res.send('Scrape complete');
  //     });
  //   });
  //   res.send('Hello world');
  // });

  app.get('/all', (req, res) => {
    Article.find({}, (err, data) => {
      if (err) {
        // eslint-disable-next-line no-console
        console.log(err);
      } else {
        res.json(data);
      }
    });
  });

  app.get('/import', (req, res) => {
    axGet('http://www.infowars.com/category/world-news/').then((response) => {
      const $ = load(response.data);

      $('div.article').each((i, element) => {
        const title = $(element).find('h3').text();
        const description = $(element).find('h4').text();
        const link = $(element).find('a').attr('href');

        const newArticle = {
          title,
          description,
          link,
        };
        if ($(element).find('img')) newArticle.img = $(element).find('img').attr('src');

        Article.findOneAndUpdate(
          {
            title,
          },
          newArticle,
          {
            upsert: true,
            new: true,
            runValidators: true,
          },
          (err, data) => {
            if (err) console.log(err);
            else console.log(data);
          },
        );
      });
      res.send('Scrape complete');
    });
  });
  // Route for pagination
  // app.get('/:pageNum', (req, res) => {
  //   const { pageNum } = req.params;
  //   const count = Article.count();
  //   const numPages = Math.ceil(count / 10);
  //   const articles = Article.find({ index: { $lt: count - (pageNum * 10) } }).limit(10);
  //   res.send({
  //     articles,
  //     numPages,
  //   });
  // });
};
