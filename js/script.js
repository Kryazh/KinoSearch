const searchForm = document.querySelector('#search-form');
const movie = document.querySelector('#movies');
const urlPoster = 'http://image.tmdb.org/t/p/w500';
function apiSearch(event) {
    event.preventDefault();
    const searchText = document.querySelector('.form-control').value;
    const server = 'https://api.themoviedb.org/3/search/multi?api_key=797193b6dc6621834944c35a7b47b47f&language=ru&query=' + searchText;
    movie.innerHTML = 'Загрузка';

    fetch(server).then(function (value) {
        if(value.status !==200){
            return Promise.reject();
        }
        return value.json();
    }).then(function (output) {
        let inner = '';
        let errorUrl = '';
        let stub = '';

        output.results.forEach(function (item, i, array) {
            let nameItem = item.name || item.title;
            if(item.poster_path != undefined){
                stub = urlPoster + item.poster_path;
            }else{
                stub = './error.png';
            }
            inner += `<div class="col-12 col-md-4 col-xl-3 item" >
            <img src="${stub}" alt="${nameItem}">
            ${nameItem}</div>`;
            console.log(item.poster_path);
        });
        movie.innerHTML = inner;
    })
    .catch(function (err) {
        movie.innerHTML = 'Что то не так!';

        console.log('error' + err.status);
        console.log(value.status);
    });
}

searchForm.addEventListener('submit', apiSearch);