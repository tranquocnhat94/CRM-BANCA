

const app = function () {
  // https://script.google.com/macros/s/AKfycbwzFYIniU3IOaIBW6e54UQmxe3pkBQOpXI8idwn_jipA-hU01k/exec
  const NEW_LEAD_API = "https://script.googleusercontent.com/macros/echo?user_content_key=gMz_KDGC9zW677swvW-s1D9czqw-udn0gm4YNuzTR628msRoDH0gmgsDmolCvR8_xKqCrozC4WvBf8SbbvSfXIk28MeUpfteOJmA1Yb3SEsKFZqtv3DaNYcMrmhZHmUMWojr9NvTBuBLhyHCd5hHa_hzT0k81Aza-mwz0jqtYMAtYx_V3dWXX697SjRl8MY65bN3QSDrBKSnEBs1XujqOaKlGRCZuSE2K4210zkRCFSdR2eYUU4Dpg1XrW-QxtgtDFVRKL6vOAj2FgEMyTVmRw&lib=M9IfXFM0YKTpVfJ6qA8CxbbIs2nCFLnrS";
  const API_BASE = 'https://script.google.com/macros/s/AKfycbw3VjGCatvBNC6Htb6i_jkLDpiS5_BqmeBmfN8HRRI/dev';
  const API_KEY = 'abc';
  const CATEGORIES = ['general', 'financial', 'technology'];

  const state = {activePage: 1, activeCategory: null};
  const page = {};

  function init () {
    // page.notice = document.getElementById('notice');
    // page.filter = document.getElementById('filter');
    // page.container = document.getElementById('container');

    // _buildFilter();
    _getNewPosts();
  }

  function _getNewPosts () {
    // page.container.innerHTML = '';
    _getPosts();
  }

  function _getPosts () {
    // _setNotice('Loading posts');

    fetch(NEW_LEAD_API)
      .then((response) => response.json())
      .then((json) => {
        if (json.status !== 'success') {
          // _setNotice(json.message);
          alert(json.message);
        }

        _renderPosts(json.data);
        _renderPostsPagination(json.pages);
      })
      .catch((error) => {
        // _setNotice('Unexpected error loading posts');
      })
  }

  function _buildFilter () {
      page.filter.appendChild(_buildFilterLink('no filter', true));

      CATEGORIES.forEach(function (category) {
        page.filter.appendChild(_buildFilterLink(category, false));
      });
  }

  function _buildFilterLink (label, isSelected) {
    const link = document.createElement('button');
      link.innerHTML = _capitalize(label);
      link.classList = isSelected ? 'selected' : '';
      link.onclick = function (event) {
        let category = label === 'no filter' ? null : label.toLowerCase();

      _resetActivePage();
        _setActiveCategory(category);
        _getNewPosts();
      };

      return link;
  }

  function _buildApiUrl (page, category) {
    let url = API_BASE;
    url += '?key=' + API_KEY;
    url += '&page=' + page;
    url += category !== null ? '&category=' + category : '';

    return url;
  }

  function _setNotice (label) {
    // page.notice.innerHTML = label;
  }

  function _renderPosts (posts) {
    posts.forEach(function (post) {
      const article = document.createElement('article');
      article.innerHTML = `
        <h2>${post.title}</h2>
        <div class="article-details">
          <div>By ${post.author} on ${_formatDate(post.timestamp)}</div>
          <div>Posted in ${post.category}</div>
        </div>
        ${_formatContent(post.content)}
      `;
      page.container.appendChild(article);
    });
  }

  function _renderPostsPagination (pages) {
    if (pages.next) {
      const link = document.createElement('button');
      link.innerHTML = 'Load more posts';
      link.onclick = function (event) {
        _incrementActivePage();
        _getPosts();
      };

      page.notice.innerHTML = '';
      page.notice.appendChild(link);
    } else {
      _setNotice('No more posts to display');
    }
  }

  function _formatDate (string) {
    return new Date(string).toLocaleDateString('en-GB');
  }

  function _formatContent (string) {
    return string.split('\n')
      .filter((str) => str !== '')
      .map((str) => `<p>${str}</p>`)
      .join('');
  }

  function _capitalize (label) {
    return label.slice(0, 1).toUpperCase() + label.slice(1).toLowerCase();
  }

  function _resetActivePage () {
    state.activePage = 1;
  }

  function _incrementActivePage () {
    state.activePage += 1;
  }

  function _setActiveCategory (category) {
    state.activeCategory = category;
    
    const label = category === null ? 'no filter' : category;
    Array.from(page.filter.children).forEach(function (element) {
        element.classList = label === element.innerHTML.toLowerCase() ? 'selected' : '';
      });
  }

  return {
    init: init
  };
}();
