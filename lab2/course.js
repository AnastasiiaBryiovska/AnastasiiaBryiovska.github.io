const dataInitials = document.getElementById('dataInitials');
const dataCourses = document.getElementById('dataCourses');
const dataProgress = document.getElementById('dataProgress');
const dataCertificates = document.getElementById('dataCertificates');

const currentUser = sessionStorage.getItem('currentUser');




const courses = [
    {
        title: "Веб-розробка для початківців",
        description: "На курсі ви вивчите HTML, CSS та основи JavaScript.",
        level: "Початковий",
        duration: "8 тижнів",
        instructor: "Іван Іванов"
    },
    {
        title: "Курс дизайну",
        description: "Основи композиції, кольору та робота з Figma.",
        level: "Початковий",
        duration: "6 тижнів",
        instructor: "Олена Петрова"
    },
    {
        title: "Курс маркетингу",
        description: "Як просувати продукти та працювати з аудиторією.",
        level: "Початковий",
        duration: "8 тижнів",
        instructor: "Марія Сидоренко"
    },
    {
        title: "Курс англійської",
        description: "Розвиток граматики, словникового запасу та speaking.",
        level: "Початковий",
        duration: "10 тижнів",
        instructor: "Анна Коваленко"
    },
    {
        title: "Основи Python",
        description: "Вивчення базового синтаксису Python та написання простих програм.",
        level: "Початковий",
        duration: "7 тижнів",
        instructor: "Олександр Бондар"
    },
    {
        title: "UI/UX дизайн",
        description: "Створення зручних інтерфейсів та прототипування мобільних і веб-додатків.",
        level: "Середній",
        duration: "8 тижнів",
        instructor: "Наталія Мельник"
    },
    {
        title: "Основи Data Science",
        description: "Робота з даними, базова статистика та аналіз даних у Python.",
        level: "Середній",
        duration: "9 тижнів",
        instructor: "Дмитро Савченко"
    },
    {
        title: "Курс фотографії",
        description: "Основи композиції, робота зі світлом та обробка фотографій.",
        level: "Початковий",
        duration: "5 тижнів",
        instructor: "Андрій Шевченко"
    }
];







let completedCourses = 0;  

const totalCourses = courses.length;
const progressBar = document.getElementById('progress-bar');
const percent = (completedCourses / totalCourses) * 100;

const list = document.getElementById("coursesList");

function updateProgress() {
    const percent = (completedCourses / totalCourses) * 100;
    progressBar.style.width = percent + '%';
    progressBar.textContent = Math.round(percent) + '%';
}

for(let i = 0; i < courses.length; i++){

    const courseDiv = document.createElement("div");
    courseDiv.className = "course";

    const title = document.createElement("h3");
    title.textContent = courses[i].title;

    const description = document.createElement("p");
    description.textContent = courses[i].description;

    const level = document.createElement("p");
    level.textContent = `Рівень: ${courses[i].level}`;

    const duration = document.createElement("p");
    duration.textContent = `Тривалість: ${courses[i].duration}`;

    const instructor = document.createElement("p");
    instructor.textContent = `Викладач: ${courses[i].instructor}`;

    description.style.display = "none";
    level.style.display = "none";
    duration.style.display = "none";
    instructor.style.display = "none";

    title.addEventListener("click", function(){
        if(description.style.display === "none"){
            description.style.display = "block";
            level.style.display = "block";
            duration.style.display = "block";
            instructor.style.display = "block";
        } else {
            description.style.display = "none";
            level.style.display = "none";
            duration.style.display = "none";
            instructor.style.display = "none";
        }
    });

    courseDiv.appendChild(title);
    courseDiv.appendChild(description);
    courseDiv.appendChild(level);
    courseDiv.appendChild(duration);
    courseDiv.appendChild(instructor);

    list.appendChild(courseDiv);

    if(currentUser){
        const btn = document.createElement("button");
        btn.className = "coutsesBtn btn";
        btn.textContent = "Розпочати курс";

        courseDiv.appendChild(btn);

        btn.addEventListener("click", function(){
            list.prepend(courseDiv);
        });

        const passedBtn = document.createElement("button");
        passedBtn.className = "coutsesBtn btn";
        passedBtn.textContent = "Пройти курс";

        courseDiv.appendChild(passedBtn);

        passedBtn.addEventListener("click", function(){
            courseDiv.style.backgroundColor = "#2fa76d";
            courseDiv.textContent = 'Пройдено!';

            completedCourses++;
            updateProgress();
        });
        
    }
}
