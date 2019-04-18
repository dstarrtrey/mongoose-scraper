import { get as axGet } from 'axios';
import { load } from 'cheerio';
import { Article } from '../models';

export default (app) => {
  app.get('/api/scrape', (req, res) => {
    axGet('http://www.infowars.com/category/world-news/').then((response) => {
      const $ = load(response.data);
      const newAdditions = [];
      $('div.article article').each((i, element) => {
        if (i >= 20) return;
        const title = $(element).find('h3').text();
        const description = $(element).find('h4').text();
        const link = $(element).find('a').attr('href');
        const newArticle = {
          title,
          description,
          link,
        };
        newAdditions.push(newArticle);
        if ($(element).find('img')) {
          newArticle.img = $(element).find('img').attr('src');
        }
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
          (err) => {
            if (err) {
              if (err.code === 11000) {
                // Another upsert occurred during the upsert, try again. You could omit the
                // upsert option here if you don't ever delete docs while this is running.
                Article.findOneAndUpdate(
                  {
                    title,
                  },
                  newArticle,
                  { upsert: true },
                );
              } else {
                console.trace(err);
              }
            }
          },
        );
      });
      Article.count({}, (err, count) => {
        const numPages = Math.ceil(count / 20);
        res.send({
          newAdditions,
          numPages,
        });
      });
    });
  });
  // Route for pagination
  app.get('/api/:pageNum', async (req, res) => {
    const { pageNum } = req.params;
    const count = await Article.count({});
    const numPages = Math.ceil(count / 20);
    const articles = await Article
      .find({})
      .sort({ _id: -1 })
      .skip((pageNum - 1) * 20)
      .limit(20);
    res.send({
      articles,
      numPages,
    });
  });
  app.get('/api/articles/id/:_id', async (req, res) => {
    const { _id } = req.params;
    const article = await Article.findOne({ _id });
    res.json({ article });
  });
  app.get('/api/articles/title/:title', async (req, res) => {
    const { title } = req.params;
    console.log('title:', title);
    const article = await Article.findOne({ title });
    res.json({ article });
  });
  // Post request for adding comments
  app.post('/api/newcomment', (req, res) => {
    //
  });
};
