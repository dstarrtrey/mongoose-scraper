/* eslint-disable func-names */
/* eslint-disable no-undef */
$(document).ready(() => {
  const showArticles = (arr) => {
    $('#articles').empty();
    console.log(arr);
    arr.forEach((article) => {
      const container = $('<article>');
      const link = $('<a>').text(article.title).attr('href', article.link);
      $('<h2>')
        .addClass('article-link')
        .append(link)
        .appendTo(container);
      $('<p>')
        .text(article.description)
        .appendTo(container);
      $('<small>')
        .data('article', 'ayyyy')
        .text('View Comments')
        .addClass('view-comment-btn')
        .appendTo(container);
      $('#articles').append(container);
    });
  };
  const showPageNums = (numPages, pageNum) => {
    for (let x = 1; x <= numPages; x += 1) {
      if (x === pageNum) {
        $('<a>')
          .text(x)
          .attr('href', '#')
          .addClass('current-page')
          .appendTo('#page-links');
      } else {
        let url;
        if (x === 1) url = '/';
        else url = `/p${x}`;
        $('<a>')
          .text(x)
          .attr('href', url)
          .appendTo('#page-links');
      }
    }
  };
  if (window.location.pathname !== '/') {
    const pageNum = parseInt(window.location.pathname.slice(2), 10);
    console.log('page:', pageNum);
    $.get(`/api/${pageNum}`, (data) => {
      console.log(data);
      showArticles(data.articles);
      showPageNums(data.numPages, pageNum);
    });
  } else if (window.location.pathname === '/') {
    const pageNum = 1;
    $.get('/api/scrape', (data) => {
      console.log(data);
      showArticles(data.newAdditions);
      showPageNums(data.numPages, pageNum);
    });
  }
  $(document).on('click', '.view-comment-btn', function () {
    const title = $(this).parent().find('a').text();
    const url = `/api/articles/title/${title}`;
    console.log(title);
    console.log(url);
    $.get(url, (data) => {
      const commentDiv = $('<div>');
      const commentArr = data.article.comments;
      console.log(data.article.comments);
      const addComment = $('<form>').attr('id', 'add-comment-form');
      $('<input>')
        .attr('type', 'text')
        .attr('id', 'new-comment-text')
        .appendTo(addComment);
      $('<input>')
        .attr('type', 'submit')
        .appendTo(addComment);
    });

    //   commentDiv.append(addComment);
  });
});
