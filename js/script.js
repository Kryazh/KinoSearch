const searchForm = document.querySelector('#search-form');
const movie = document.querySelector('#movies');
const urlPoster = 'http://image.tmdb.org/t/p/w500';
function apiSearch(event) {
    event.preventDefault();
    const searchText = document.querySelector('.form-control').value;
    if(searchText.trim().length === 0){// trim убирает пробелы
        movie.innerHTML = '<h2 class="col-12 text-center text-danger">Поле поиска не должно быть пустым</h2>';
        return;
    }
    const server = 'https://api.themoviedb.org/3/search/multi?api_key=797193b6dc6621834944c35a7b47b47f&language=ru&query=' + searchText;
    movie.innerHTML = `<div class="spinner"></<div>`; // спиннер перед загрузкой

    fetch(server).then(function (value) {
        if(value.status !==200){
            return Promise.reject();
        }
        return value.json();
    }).then(function (output) {
        let inner = '';
       if(output.results.length === 0){
           inner = `<h2 class="col-12 text-center text-info">По вашему запросу ничего не найдено</h2>` // 2
       }
        let errorUrl = '';
        let stub = '';

        output.results.forEach(function (item) {
            let nameItem = item.name || item.title;
            if(item.poster_path != undefined){ // подстановна error.png на фильм без картинки
                stub = urlPoster + item.poster_path;
            }else{
                stub = './error.png';
            }
            let dataInfo = '';
            if(item.media_type !== 'person') dataInfo = `data-id="${item.id}" data-type = "${item.media_type}"`; // !!!
            inner += `<div class="col-12 col-md-4 col-xl-3 item" >
            <img src="${stub}" alt="${nameItem} "${dataInfo}> 
            ${nameItem}</div>`;
            console.log(item.poster_path);
        });
        movie.innerHTML = inner;
        addEventMedia ();
        const media = movie.querySelectorAll('img[data-id]');
        media.forEach(function(elem){
            elem.style.cursor = 'pointer';
            elem.addEventListener('click', showFullInfo);
        })
    })
    .catch(function (err) {
        movie.innerHTML = 'Что то не так!';

    });
}

searchForm.addEventListener('submit', apiSearch);

function addEventMedia (){ // Функция клика по картинке
    const media = movie.querySelectorAll('img[data-id]');
    media.forEach(function(elem){
        elem.style.cursor = 'pointer';
        elem.addEventListener('click', showFullInfo);
    })
}

function showFullInfo(){ // переход на страницу фильма
    console.log(this);
}

document.addEventListener('DOMContentLoaded', ()=>{ // Страница "Популярое за неделю"
    
    fetch('https://api.themoviedb.org/3/trending/all/week?api_key=797193b6dc6621834944c35a7b47b47f&language=ru').then(function (value) {
        if(value.status !==200){
            return Promise.reject();
        }
        return value.json();
    }).then(function (output) {
        let inner = `<h2 class="col-12 text-center text-info">Пополярные за неделю</h2>`;
       if(output.results.length === 0){
           inner = `<h2 class="col-12 text-center text-info">По вашему запросу ничего не найдено</h2>` // 2
       }
        let errorUrl = '';
        let stub = '';

        output.results.forEach(function (item) {
            let nameItem = item.name || item.title;
            if(item.poster_path != undefined){ // подстановна error.png на фильм без картинки
                stub = urlPoster + item.poster_path;
            }else{
                stub = './error.png';
            }
            dataInfo = `data-id="${item.id}" data-type = "${item.media_type}"`; // !!!
            inner += `<div class="col-12 col-md-4 col-xl-3 item" >
            <img src="${stub}" alt="${nameItem} "${dataInfo}> 
            ${nameItem}</div>`;
            console.log(item.poster_path);
        });
        movie.innerHTML = inner;
        addEventMedia ();
        const media = movie.querySelectorAll('img[data-id]');
        media.forEach(function(elem){
            elem.style.cursor = 'pointer';
            elem.addEventListener('click', showFullInfo);
        })
    })
    .catch(function (err) {
        movie.innerHTML = 'Что то не так!';

    });
});