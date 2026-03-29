import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Link} from 'react-router-dom';
import { auth,  } from "./firebase";
import { getAuth, onAuthStateChanged} from "firebase/auth";
import { signUp, login, logout } from "./auth.js";
import { db } from "./firebase";
import { collection, getDocs} from "firebase/firestore";
import './App.css';
import './firebase.js';




const Register = () => <div style={{ padding: '20px' }}>
  <div className='register'>
    <h1>Реєстрація</h1>
  <p>Будь ласка, заповніть цю форму, щоб створити обліковий запис.</p>

  <label htmlFor="email">Email</label>
  <input className='registerInput' type="email" id="email" name="Електронна пошта" placeholder="Enter your email.." autocomplete="on"/>

  <label htmlFor="psw">Password</label>
  <input className='registerInput' type="password" id="psw" name="Пароль" placeholder="Enter your password.." autocomplete="on"/>

  <div className='btn'>
    <button onClick={signUp}>Зареєструватися</button>
    {/* <button id="registerButton" type="button" className='btn btnR' onClick={signUp}>Зареєструватися</button> */}
  </div>
  </div>
</div>;

const Login = () => <div style={{ padding: '20px' }}>
  <div className='register'>
    <h1>Вхід</h1>
  <p>Будь ласка, заповніть цю форму, щоб увійти до облікового запису.</p>

  <label htmlFor="email">Email</label>
  <input className='registerInput' type="email" id="Lemail" name="Електронна пошта" placeholder="Enter your email.." autocomplete="on"/>

  <label for="psw">Password</label>
  <input className='registerInput' type="password" id="Lpsw" name="Пароль" placeholder="Enter your password.." autocomplete="on"/>

  <div className='btn'>
    <button onClick={login}>Увійти</button>
    {/* <button id="registerButton" type="button" className='btn btnR' onClick={signUp}>Зареєструватися</button> */}
  </div>
  <div className='btn'>
    <Link to="/register"> <button>Зареєструватися</button> </Link>
  </div>
  </div>
</div>;


const Schedule = () =>{
  const [scheduleList, setScheduleList] = useState([]);

  useEffect(() => {
    const fetchSchedule = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, "schedule"));

        const ScheduleData = querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));

        setScheduleList(ScheduleData);
      } catch (error) {
        console.error("Помилка Firestore:", error);
      }
    };
    

    fetchSchedule();
    

  }, []);
  return (
    <div style={{ padding: '20px' }}>

      <div className="courses">
        {scheduleList.map((schedule) => (
          <div className='course' key={schedule.id}>
            <h3>{schedule.day}</h3>
            <p>{schedule.subject}</p>
            <p>{schedule.time}</p>
          </div>
        ))}
      </div>
    </div>
  );
}


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




const Courses = ({ user }) => {
  const [courseList, setCourseList] = useState([]);
  const [selectedLevel, setSelectedLevel] = useState("Всі");

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, "course"));

        const coursesData = querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));

        setCourseList(coursesData);
      } catch (error) {
        console.error("Помилка Firestore:", error);
      }
    };


    fetchCourses();
    

  }, []);


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

      <h2>Наші навчальні курси</h2>

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




      <div className="courses">
        {courseList.filter(course => selectedLevel === "Всі" || course.level === selectedLevel).map((course) => (
          <div className='course' key={course.id}>
            <h3>{course.title}</h3>
            <p>Рівень: {course.level}</p>
            <p>Тривалість: {course.duration} тижнів</p>
            <p>Викладач: {course.instructor}</p>
            {user && <p>{course.description}</p>}
            {!user && <p>Увійдіть, щоб побачити деталі</p>}
            {user && (<div className="review"> 
              <textarea placeholder="Напишіть ваш відгук..." />
              <button className="btn">Надіслати відгук</button></div>)}



            {user ? ( 
              <Link to="/profile"> <button className='btn'>Обрати курс</button> </Link>
            ) : (
            <Link to="/login"> <button className='btn'>Увійдіть</button></Link>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};



const Profile = () => <div style={{ padding: '20px' }}><h2>профіль</h2></div>;


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
  const [user, setUser] = useState(null);

  useEffect(() => {

    const logOrOut = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser); 
    });
    return () => logOrOut();
  }, []);
  return (
    <Router>
      <div className="App">
        <header className="App-header">
          <h1>Навчальні курси</h1>
          <nav>
            <Link className='bigLink' to="/" >Головна</Link>
            <Link className='bigLink' to="/courses" >Курси</Link>
            <Link className='bigLink' to="/profile" >Профіль</Link>
            {/* <Link className='bigLink' to="/register" >Реєстрація</Link> */}
            {user ? (
              <Link className='bigLink' onClick={logout} >Вихід</Link>
            ) : (
              <Link className='bigLink' to="/login" >Вхід</Link>
            )}

          </nav>
        </header>

        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/courses" element={<Courses user={user} />} />
          <Route path="/courses/schedule" element={<Schedule />} />
          <Route path="/courses/progress" element={<Progress />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/register" element={<Register />} />
          <Route path="/login" element={<Login />} />
        </Routes>
      </div>
    </Router>
  );
}


export default App;