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
        console.error(err||err.status);
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
    let url = '';
    if(this.dataset.type === 'movie'){
        url = `https://api.themoviedb.org/3/movie/${this.dataset.id}?api_key=797193b6dc6621834944c35a7b47b47f&language=ru`;
    }else if(this.dataset.type === 'tv'){
        url = `https://api.themoviedb.org/3/tv/${this.dataset.id}?api_key=797193b6dc6621834944c35a7b47b47f&language=ru`;
    } else {
         movie.innerHTML = '<h2 class=" col-12 text-center text-danger">Произошла Ошибка</h2>';
    }

    fetch(url).then(function (value) {
        if(value.status !== 200){
            return Promise.reject(new Error(value.status));
        }
        return value.json();
    }).then(function (output) {// !!!
        console.log(output);
       movie.innerHTML = `<h4 class="col-12 text-center text-info">${output.name || output.title}</h4>
       <div class="col-4">
       <img src = '${urlPoster + output.poster_path}'>
       ${(output.homepage) ? `<p class="text-center"><a href="${output.homepage}" target="_blank">Официальная страница</a></p>` : ''}
       ${(output.homepage) ? `<p class="text-center"><a href="https://imdb.com/title/${output.imdb_id}" target="_blank">IMDB.COM</a></p>` : ''}
       </div>
       <div class="col-8">
       <p>Рейтинг: ${output.vote_average}/10 </p>
       <p>Статус: ${output.status} </p>
       <p>Премьера: ${output.first_air_date || output.release_date}</p>
       
       <p>${(output.last_episode_to_air) ? `<p>${output.number_of_seasons} Сезон 
       ${output.number_of_episodes} Серий</p> ` : ``}

       <p>Описание: ${output.overview}</p>
       </div>`; 
    })
    .catch(function (reason) {
        movie.innerHTML = 'Что то не так!';
        console.error(reason||reason.status);

    });
}

document.addEventListener('DOMContentLoaded', ()=>{ // Страница "Популярое за неделю"
    
    fetch('https://api.themoviedb.org/3/trending/all/week?api_key=797193b6dc6621834944c35a7b47b47f&language=ru')
    .then(function (value) {
        if(value.status !==200){
            return Promise.reject();
        }
        return value.json();
    }).then(function (output) {
        let inner = `<h2 class="col-12 text-center text-info">Пополярные за неделю</h2>`;
       if(output.results.length === 0){
        inner = `<h2 class="col-12 text-center text-info">По вашему запросу ничего не найденно</h2>`;
       }
        let errorUrl = '';
        let stub = '';

        output.results.forEach(function (item) {
            let nameItem = item.name || item.title;
            let mediaType = item.title ? 'movie' : 'tv';
            if(item.poster_path){ // подстановна error.png на фильм без картинки
                stub = urlPoster + item.poster_path;
            }else{
                stub = './error.png';
            }
            dataInfo = `data-id="${item.id}" data-type = "${mediaType}"`; // !!!
            inner += `<div class="col-12 col-md-4 col-xl-3 item" >
            <img src="${stub}" alt="${nameItem} "${dataInfo}> 
            ${nameItem}</div>`;
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