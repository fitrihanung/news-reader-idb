var base_url = "https://aqueous-woodland-96253.herokuapp.com/";

//blok kode yang akan dipanggil jika fetch berhasil
function status(response) {
  if (response.status !== 200) {
    console.log("Error : " + response.status);
    //method reject() akan membuat block catch terpanggil
    return Promise.reject(new Error(response.statusText));
  } else {
    //mengubah suatu object menjadi Promise agar bisa di-then-kan
    return Promise.resolve(response);
  }
}

//block kode untuk memparsing json menjadi array javascript
function json(response) {
  return response.json();
}

//block kode untuk menghandle kesalahan di blcok catch
function error(error) {
  //parameter error berasal dari Promise.reject()
  console.log("Error : " + error);
}

function getArticles() {
  if ("caches" in window) {
    caches.match(base_url + "articles").then(function(response) {
      if (response) {
        response.json().then(function(data) {
          var articlesHTML = "";
          data.result.forEach(function(article) {
            articlesHTML += `
            <div class="card">
              <a href="./article.html?id=${article.id}">
                <div class="card-image waves-effect waves-block waves-light">
                  <img src="${article.thumbnail}" />
                </div>
              </a>
              <div class="card-content">
                <span class="card-title truncate">${article.title}</span>
                <p>${article.description}</p>
              </div>
            </div>
            `;
          });
          document.getElementById("articles").innerHTML = articlesHTML;
        });
      }
    });
  }

  fetch(base_url + "articles")
  .then(status)
  .then(json)
  .then(function(data) {
    //object jacascript dari response.json() masuk lewat variabel data

    //menyusun komponen card artikel secara dinamis
    var articlesHTML = "";
    data.result.forEach(function(article) {
      articlesHTML += `
      <div class="card">
      <a href="./article.html?id=${article.id}">
        <div class="card-image waves-effect waves-block waves-light">
          <img src="${article.thumbnail}" />
        </div>
        </a>
        <div class="card-content">
        <span class="card-title truncate">${article.title}</span>
        <p>${article.description}</p>
        </div>
      </div>
      `;
    });
        //sisipkan komponen card ke dalam elemen dengan id #content
    document.getElementById("articles").innerHTML = articlesHTML;
  })
  .catch(error);
}

//
function getArticleById() {
  return new Promise(function(resolve, reject) {
    var urlParams = new URLSearchParams(window.location.search);
    var idParam = urlParams.get("id");

    if("caches" in window) {
      caches.match(base_url + "article/" + idParam).then(function(response) {
        if (response) {
          response.json().then(function(data) {
            var articleHTML = `
            <div class="card">
              <div class="card-image waves-effect waves-block waves-light">
                <img src="${data.result.cover}" />
              </div>
              <div class="card-content">
              <span class="card-title">${data.result.post_title}</span>
              ${snarkdown(data.result.post_content)}
              </div>
            </div>
            `;
            document.getElementById("body-content").innerHTML = articleHTML;
            resolve(data);
          });
        }
      });
    }

    fetch(base_url + "article/" + idParam)
    .then(status)
    .then(json)
    .then(function(data) {
      //object jacascript dari response.json() masuk lewat variabel data
      console.log(data);
      //menyusun komponen card artikel secara dinamis
      var articleHTML = `
      <div class="card">
        <div class="card-image waves-effect waves-block waves-light">
          <img src="${data.result.cover}" />
        </div>
        <div class="card-content">
        <span class="card-title">${data.result.post_title}</span>
        ${snarkdown(data.result.post_content)}
        </div>
      </div>
      `;
      //sisipkan komponen card ke dalam elemen dengan id #content
      document.getElementById("body-content").innerHTML = articleHTML;
      resolve(data);
    });
  });
}
