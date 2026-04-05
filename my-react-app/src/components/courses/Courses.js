import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { db } from "../../firebase";
import { collection, getDocs, addDoc } from "firebase/firestore";
import './Courses.css';

const API_URL = "https://anastasiiabryiovska-github-io.onrender.com";








const Courses = ({ user, setSelectedCourses, selectedCourses  }) => {
  const [courseList, setCourseList] = useState([]);
  const [selectedLevel, setSelectedLevel] = useState("Всі");
  const [openCourseId, setOpenCourseId] = useState(null);
  const [reviewText, setReviewText] = useState("");

  const [reviews, setReviews] = useState([]);
  const [openReviewsId, setOpenReviewsId] = useState(null);
  

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
        console.error("Помилка Firestore");
      }
    };


    fetchCourses();
    

  }, []);


const sendReview = async (courseId) => {
  if (!reviewText) return;

  try {
    const token = await user.getIdToken(true); // Отримуємо токен для авторизації

    const response = await fetch(`${API_URL}/api/reviews`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        courseId: courseId,
        userId: user.uid,
        message: reviewText
      }),
    });

    if (!response.ok) throw new Error("Не вдалося додати відгук");

    setReviewText("");
    alert("Відгук збережено!");
    await getReviews(courseId);
  } catch (error) {
    console.error("Помилка:", error);
    alert("Помилка при додаванні відгуку");
  }
};


const getReviews = async (courseId) => {
  try {
    const response = await fetch(`${API_URL}/api/reviews/${courseId}`);
    const data = await response.json();

    setReviews(data);
    setOpenReviewsId(courseId);
  } catch (error) {
    console.error("Помилка при отриманні відгуків з сервера:", error);
  }
};



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

  const toggleReviews = (courseId) => {
  if (openReviewsId === courseId) {
    setOpenReviewsId(null);
    return;
  }

  getReviews(courseId);
};

  return (
    <div style={{ padding: '20px' }}>


      <select className='select' value={selectedLevel} onChange={(e) => setSelectedLevel(e.target.value)}>
        <option value="Всі">Всі</option>
        <option value="Початковий">Початковий</option>
        <option value="Середній">Середній</option>
      </select>

      <button className='btn btnC' onClick={bubbleSortCourses}>
        Сортувати курси за тривалістю (від меншого до більшого)
      </button>
      <button className='btn btnC' onClick={bubbleSortCoursess}>
        Сортувати курси за тривалістю (від більшого до меншого)
      </button>


      <div className="courses">
        {courseList.filter(course => selectedLevel === "Всі" || course.level === selectedLevel).map((course) => (
          <div className='course' key={course.id}>
            <img  src={course.photo} alt={course.title} className="courseImage" />
            <h3 className='titleCours'>{course.title}</h3>
            <h4>Тривалість: {course.duration} занять</h4>


            {openCourseId === course.id && (
              <div>
                <p>Рівень: {course.level}</p>
                <p>Викладач: {course.instructor}</p>
                <p className='description'>{course.description}</p>
                {user && (<div className="review"> 
                  <textarea className='textareas' placeholder="Напишіть ваш відгук..." value={reviewText} onChange={(e) => setReviewText(e.target.value)}/>
                  <button className="btn" onClick={() => sendReview(course.id)} >Надіслати відгук</button></div>)}
              </div>
            )}



            <button className='btn' onClick={() => 
              setOpenCourseId(prev => prev === course.id ? null : course.id)}>
                {openCourseId === course.id ? "Сховати" : "Детальніше"}
            </button>
            
            <button className='btn' onClick={() => toggleReviews(course.id)}>
              {openReviewsId === course.id ? "Сховати відгуки" : "Переглянути відгуки"}
            </button>

            {openReviewsId === course.id && (
              <div>
                <h4>Відгуки:</h4>
                {reviews.length === 0 ? (
                  <p>Немає відгуків</p>
                ) : ( reviews.map((r, index) => ( <div className='revie' key={index}> <p className='messag'>{r.message}</p><p>{r.dateFormatted}</p> </div>))
              )}
              </div>
            )}




            {user ? ( selectedCourses.some(c => c.id === course.id) ? ( 
              <button className='btn' disabled>Вже обрано</button>
              ) : ( <button className='btn' onClick={() => setSelectedCourses(prev => [...prev, course])} >
                Обрати курс</button>
                ) 
            ) : ( <Link to="/login">
              <button className='btn'>Увійдіть</button></Link> )}
          </div>
        ))}
      </div>
    </div>
  );
};



export default Courses;