
const textFont = document.querySelectorAll('p')

for(let i=0; i < textFont.length; i++){
    textFont[i].style.fontFamily = 'Roboto';
    textFont[i].style.fontWeight = 'bold';
}

for(let i=0; i < textFont.length; i++){
    if(i >=3 && i <= 5){
        textFont[i].style.fontStyle = 'normal';
    } else {
        textFont[i].style.fontStyle = 'italic';
        textFont[i].style.fontWeight = 'normal';
    }
}




const detail = document.getElementById('detail');
const buttonDetail = document.getElementById('ButtonDetail');

buttonDetail.addEventListener('click', () => {

    if(detail.classList.contains('hide')){
        detail.classList.remove('hide');
        detail.classList.add('normalDetail');
    } else {
        detail.classList.remove('normalDetail');
        detail.classList.add('hide');
    }

})



const coursesBtn = document.querySelectorAll('.btnC');
const info = document.getElementById('info');

for(let i=0; i < coursesBtn.length; i++){
    coursesBtn[i].addEventListener("click", function(){
        if(this.id === 'programming'){
            info.innerHTML = `
            <strong>На курсі ви дізнаєтесь:</strong>
            <ul>
                <li>основи програмування</li>
                <li>як працює HTML, CSS та JavaScript</li>
                <li>як створювати власні вебсторінки</li>
            </ul>`;
            info.style.fontStyle = 'roboto';
        } else if(this.id === 'design'){
            info.innerHTML = `
            <strong>На курсі ви дізнаєтесь:</strong>
            <ul>
                <li>основи дизайну</li>
                <li>як працює композиція та колірна теорія</li>
                <li>як створювати візуально привабливі та ефективні дизайни</li>
            </ul>`;
            info.style.fontStyle = 'roboto';
        } else if(this.id === 'business'){
            info.innerHTML = `
            <strong>На курсі ви дізнаєтесь:</strong>
            <ul>
                <li>основи бізнесу</li>
                <li>як працювати з клієнтами</li>
                <li>як розробляти ефективні маркетингові кампанії</li>
            </ul>`;
            info.style.fontStyle = 'roboto';
        } else if(this.id === 'languages'){
            info.innerHTML = `
            <strong>На курсі ви дізнаєтесь:</strong>
            <ul>
                <li>основи вивчення нових мов</li>
                <li>як працювати з граматикою та лексикою</li>
                <li>як розуміти культурні особливості</li>
            </ul>`;
            info.style.fontStyle = 'roboto';
        }
    });
}

const profileContainer = document.getElementById('profileContainer');
const currentUser = sessionStorage.getItem('currentUser');

if(currentUser && profileContainer){
    profileContainer.innerHTML = `
        <a class="btn" href="profile.html">
            <span>Профіль</span>
        </a>
    `;

    
}



const schedules = [
    [
        "Пн/Ср: 09:00 11:00 13:00 15:00 17:00 19:00",
        "Вт/Чт: 09:00 11:00 13:00 15:00 17:00 19:00"
    ],
    [
        "Пн/Ср: 10:00 12:00 14:00 16:00 18:00",
        "Вт/Чт: 10:00 12:00 14:00 16:00 18:00"
    ],
    [
        "Пн/Ср: 08:00 10:00 12:00 14:00 16:00",
        "Вт/Чт: 08:00 10:00 12:00 14:00 16:00"
    ]
];

let index = 0;

function updateSchedule() {

    const scheduleList = document.querySelector(".schedule");
    scheduleList.innerHTML = "";

    let i = 0;

    do {
        const li = document.createElement("li");
        li.textContent = schedules[index][i];
        scheduleList.appendChild(li);

        i++;

    } while (i < schedules[index].length);

    index++;

    if(index >= schedules.length){
        index = 0;
    }
}

// оновлення кожні 8 секунд
setInterval(updateSchedule, 4000);