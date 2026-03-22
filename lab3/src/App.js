import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Link} from 'react-router-dom';
import './App.css';


const courses = [
    {
        title: "Веб-розробка для початківців",
        description: "На курсі ви вивчите HTML, CSS та основи JavaScript.",
        level: "Початковий",
        duration: 8,
        instructor: "Іван Іванов"
    },
    {
        title: "Курс дизайну",
        description: "Основи композиції, кольору та робота з Figma.",
        level: "Початковий",
        duration: 6,
        instructor: "Олена Петрова"
    },
    {
        title: "Курс маркетингу",
        description: "Як просувати продукти та працювати з аудиторією.",
        level: "Початковий",
        duration: 8,
        instructor: "Марія Сидоренко"
    },
    {
        title: "Курс англійської",
        description: "Розвиток граматики, словникового запасу та speaking.",
        level: "Початковий",
        duration: 10,
        instructor: "Анна Коваленко"
    },
    {
        title: "Основи Python",
        description: "Вивчення базового синтаксису Python та написання простих програм.",
        level: "Початковий",
        duration: 7,
        instructor: "Олександр Бондар"
    },
    {
        title: "UI/UX дизайн",
        description: "Створення зручних інтерфейсів та прототипування мобільних і веб-додатків.",
        level: "Середній",
        duration: 8,
        instructor: "Наталія Мельник"
    },
    {
        title: "Основи Data Science",
        description: "Робота з даними, базова статистика та аналіз даних у Python.",
        level: "Середній",
        duration: 9,
        instructor: "Дмитро Савченко"
    },
    {
        title: "Курс фотографії",
        description: "Основи композиції, робота зі світлом та обробка фотографій.",
        level: "Початковий",
        duration: 5,
        instructor: "Андрій Шевченко"
    }
];

const schedule = [
  { day: "Понеділок", time: "10:00", subject: "Веб-розробка для початківців" },
  { day: "Середа", time: "12:00", subject: "Курс дизайну" },
  { day: "П’ятниця", time: "14:00", subject: "Курс маркетингу" },
  { day: "Субота", time: "11:00", subject: "Курс англійської" }
];

const Register = () => <div style={{ padding: '20px' }}>
  <div className='register'>
    <h1>Реєстрація</h1>
  <p>Будь ласка, заповніть цю форму, щоб створити обліковий запис.</p>

  <label for="Name">Name</label>
  <input className='registerInput' type="text" id="name" name="Ім'я" placeholder="Enter your name.." autocomplete="on"/>

  <label for="email">Email</label>
  <input className='registerInput' type="email" id="email" name="Електронна пошта" placeholder="Enter your email.." autocomplete="on"/>

  <label for="psw">Password</label>
  <input className='registerInput' type="password" id="psw" name="Пароль" placeholder="Enter your password.." autocomplete="on"/>

  <div className='btn'>
    <button id="registerButton" type="button" className='btn btnR'>Зареєструватися</button>
  </div>
  </div>
</div>;

const Schedule = () => <div style={{ padding: '20px' }}>
  <ScheduleList schedule={schedule} />
</div>;


const Progress = () => <div style={{ padding: '20px' }}>
  <StudentProgress />
</div>;


const Home = () => 
<div style={{ padding: '20px' }}>
  <h2>Learn! Grow! Succeed!</h2>
  <h4>COURSES — це простір для навчання та зростання.</h4>
  <h4>Обирай напрям, проходь курси у зручному темпі та поступово підвищуй свій рівень знань.</h4>
  <h4>З нами ти зможеш досягти нових висот у своїй кар'єрі та особистому розвитку.</h4>  
  {<img className='colPhoto' src="col1.png" alt="Learning" />}
  {<img className='colPhoto' src="col5.png" alt="Learning" />}
  {<img className='colPhoto' src="col3.png" alt="Learning" />}
  {<img className='colPhoto' src="col4.png" alt="Learning" />}

</div>;


const Courses = () => {
  const [courseList, setCourseList] = useState(courses);
  const [selectedLevel, setSelectedLevel] = useState("Всі");

  const bubbleSortCourses = () => {
  const arr = [...courseList];
  
  for (let i = 0; i < arr.length; i++) {
    for (let j = 0; j < arr.length - 1; j++) {
      if (arr[j].duration > arr[j + 1].duration) {
        let temp = arr[j];
        arr[j] = arr[j + 1];
        arr[j + 1] = temp;
      }
    }
  }
  setCourseList(arr);
  };

  const bubbleSortCoursess = () => {
  const arr = [...courseList];
  
  for (let i = 0; i < arr.length; i++) {
    for (let j = 0; j < arr.length - 1; j++) {
      if (arr[j].duration < arr[j + 1].duration) {
        let temp = arr[j];
        arr[j] = arr[j + 1];
        arr[j + 1] = temp;
      }
    }
  }

  setCourseList(arr);
  };
  

  return (
    <div style={{ padding: '20px' }}>
      <nav>
        <Link className='smallLink' to="/courses/schedule" >Список занять у розкладі</Link>
        <Link className='smallLink' to="/courses/progress" >Прогрес</Link>
      </nav>
      
      <h2 className='h2'>Наші навчальні курси</h2>

      <select className='select' value={selectedLevel} onChange={(e) => setSelectedLevel(e.target.value)}>
        <option value="Всі">Всі</option>
        <option value="Початковий">Початковий</option>
        <option value="Середній">Середній</option>
      </select>
      
      <button className='btn' onClick={bubbleSortCourses}>
        Сортувати курси за тривалістю (від меншого до більшого)
      </button>
      <button className='btn' onClick={bubbleSortCoursess}>
        Сортувати курси за тривалістю (від більшого до меншого)
      </button>
      
      
      <div className='courses'>
        {courseList.filter(course => selectedLevel === "Всі" || course.level === selectedLevel)
        .map((course, index) => (
          <CourseCard key={index} course={course} />
          ))}    
      </div>

    </div>
  )
}

const Profile = () => <div style={{ padding: '20px' }}><h2>Мій профіль</h2></div>;


function CourseCard({ course }) {
  return (
    <div className='course'>
      <h3>{course.title}</h3>
      <p>{course.description}</p>
      <p><b>Рівень:</b> {course.level}</p>
      <p><b>Тривалість:</b> {course.duration} тижнів</p>
      <p><b>Викладач:</b> {course.instructor}</p>
    </div>
  );
}


function ScheduleList({ schedule }) {
  return (
    <div>
      <h2>Розклад занять</h2>

      <div className="scheduleList">
        {schedule.map((item, index) => (
        <div className="schedule" key={index}>
          <p>{item.day}</p>
          <p>{item.time}</p>
          <p>{item.subject}</p>
        </div>
      ))}
      </div>
    </div>
  );
}


function StudentProgress() {
  const [progress, setProgress] = useState(0);

  return (
    <div>
      <h2>Прогрес</h2>
      <p>Ваш прогрес: {progress}%</p>
      <button className='btn' onClick={() => progress < 100 && setProgress(progress + 10)}>Покращити прогрес</button>
    </div>
  )
}


function App() {
  return (
    <Router>
      <div className="App">
        <header className="App-header">
          <h1>Навчальні курси</h1>
          <nav>
            <Link className='bigLink' to="/" >Головна</Link>
            <Link className='bigLink' to="/courses" >Курси</Link>
            <Link className='bigLink' to="/profile" >Профіль</Link>
            <Link className='bigLink' to="/register" >Реєстрація</Link>
          </nav>
        </header>

        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/courses" element={<Courses />} />
          <Route path="/courses/schedule" element={<Schedule />} />
          <Route path="/courses/progress" element={<Progress />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/register" element={<Register />} />
        </Routes>
      </div>
    </Router>
  );
}


export default App;