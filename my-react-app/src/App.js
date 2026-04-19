import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Link} from 'react-router-dom';
import { signUp, login, logout } from "./auth.js";
import { db } from "./firebase";
import { collection, getDocs, addDoc} from "firebase/firestore";
import './App.css';
import './firebase.js';
import Home from './components/home/home.js';
import Courses from './components/courses/Courses';




const Register = () => <div style={{ padding: '20px' }}>
  <div className='register'>
    <h1>Реєстрація</h1>
  <p>Будь ласка, заповніть цю форму, щоб створити обліковий запис.</p>

  <label htmlFor="email">Email</label>
  <input className='registerInput' type="email" id="email" name="Електронна пошта" placeholder="Enter your email.." autocomplete="on"/>

  <label htmlFor="psw">Password</label>
  <input className='registerInput' type="password" id="psw" name="Пароль" placeholder="Enter your password.." autocomplete="on"/>


    <div className='btnCont'> 
      <div>
        <button className='btnR' onClick={signUp}>Зареєструватися</button>
      </div>
      <div>
        <Link to="/login"> <button className='btnR' >Вхід</button> </Link>
      </div>
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

  <div className='btnCont'> 
    <div>
    <button className='btnR' onClick={login}>Увійти</button>
  </div>
  <div>
    <Link to="/register"> <button className='btnR' >Зареєструватися</button> </Link>
  </div>
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







const Profile = ({ selectedCourses, setSelectedCourses }) => {

  const removeCourse = (id) => {
    setSelectedCourses(prev => prev.filter(course => course.id !== id));
  };

  return(

    <div style={{ padding: '20px' }}>

      <h2 className='myCoursHead'>Мої курси</h2>

      <nav>
        <Link className='smallLink' to="/profile/schedule">Мій розклад</Link>
      </nav>





    <div className="courses">
      {selectedCourses.length === 0 ? (
      <p className='notCourse'>Ви ще не обрали курс</p>
    ) : (
      selectedCourses.map(course => (
      <div key={course.id} className="myCourse">
        <img  src={course.photo} alt={course.title} className="myCourseImage" />
        <h3>{course.title}</h3>
          <p>Тривалість: {course.duration}</p>

          <Link className='btn' to="/profile/progress">Прогрес</Link>
          <button className='btn' onClick={() => removeCourse(course.id)} > Відмінити курс </button>
      </div>
      ))
      )}
    </div>

    
  </div>

  );
}





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
  const [isAuth, setIsAuth] = useState(false);
  const [selectedCourses, setSelectedCourses] = useState([]);

  async function getProtectedData() {
    const token = localStorage.getItem("token");

  if (!token) {
    alert("Please log in first.");
    return;
  }

  try {
    const response = await fetch(`https://anastasiiabryiovska-github-io.onrender.com/api/protected`, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });

    const data = await response.json();
    alert(JSON.stringify(data));
  } catch (error) {
    alert("Error: " + error.message);
  }
}
















// async function getProtectedData() {
//   const token = localStorage.getItem("token");

//   if (!token) {
//     alert("Please log in first.");
//     return;
//   }

//   try {
//     const response = await fetch("https://anastasiiabryiovska-github-io.onrender.com/api/protected", {
//       headers: {
//         Authorization: `Bearer ${token}`
//       }
//     });

//     const data = await response.json();
//     alert(JSON.stringify(data));
//   } catch (error) {
//     alert("Error: " + error.message);
//   }
// }

  // useEffect(() => {
  //   console.log("USER STATE:", user);
  // }, [user]);

  useEffect(() => {
    fetch("https://anastasiiabryiovska-github-io.onrender.com/api/message")
      .then(response => response.json())
      .then(data => {
        console.log("Повідомлення від сервера:", data.message);
      })
      .catch(err => console.error("Сервер не відповідає:", err));
  }, []);

  // useEffect(() => {

  //   const logOrOut = onAuthStateChanged(auth, (currentUser) => {
  //     setUser(currentUser); 
  //   });
  //   return () => logOrOut();
  // }, []);



  useEffect(() => {
  const token = localStorage.getItem("token");
  setIsAuth(!!token);
}, []);

  return (
    <Router>
      <div className="App">
        <header className="App-header">
          <nav>
            <div className='contain'> 
              {/* <h1 className ="headerr" >Навчальні курси</h1> */}
              <Link className ="headerr" to="/" >Навчальні курси</Link>
              <Link className='bigLink' to="/courses" >Курси</Link>
              <Link className='bigLink' to="/profile" >Профіль</Link>
              {/* <button className='btn btnE' onClick={getProtectedData}></button> */}
              {isAuth ? (
                <Link className='bigLink logOut' onClick={logout} >Вихід</Link>
              ) : (
                <Link  className="bigLink logOut"  to="/login" >Вхід</Link>
             )}


      
            </div>

          </nav>
        </header>

        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/courses" element={<Courses user={localStorage.getItem("token")} setSelectedCourses={setSelectedCourses} selectedCourses={selectedCourses} />} />
          <Route path="/profile" element={<Profile selectedCourses={selectedCourses} setSelectedCourses={setSelectedCourses} />} />
          <Route path="/profile/schedule" element={<Schedule />} />
          <Route path="/profile/progress" element={<Progress />} />
          <Route path="/register" element={<Register />} />
          <Route path="/login" element={<Login />} />
        </Routes>
      </div>
    </Router>
  );
}


export default App;