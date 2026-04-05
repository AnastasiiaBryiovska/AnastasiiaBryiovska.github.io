import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { db } from "../../firebase";
import { collection, getDocs, addDoc } from "firebase/firestore";
import './Courses.css';








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
    await addDoc(collection(db, "response"), {
      message: reviewText,
      userId: user.uid,
      courseId: courseId 
    });

    setReviewText("");
    alert("Відгук збережено!");
  } catch (error) {
    console.error("Помилка:", error);
  }
};


const getReviews = async (courseId) => {
  try {
    const querySnapshot = await getDocs(collection(db, "response"));

    const data = querySnapshot.docs.map(doc => doc.data());

    const filtered = data.filter(r => r.courseId === courseId);

    setReviews(filtered);
    setOpenReviewsId(courseId);

  } catch (error) {
    console.error(error);
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
                  <textarea placeholder="Напишіть ваш відгук..." value={reviewText} onChange={(e) => setReviewText(e.target.value)}/>
                  <button className="btn" onClick={() => sendReview(course.id)} >Надіслати відгук</button></div>)}
              </div>
            )}



            <button className='btn' onClick={() => 
              setOpenCourseId(prev => prev === course.id ? null : course.id)}>
                {openCourseId === course.id ? "Сховати" : "Детальніше"}
            </button>
            
            <button className='btn' onClick={() => openReviewsId === course.id
            ? setOpenReviewsId(null)
            : getReviews(course.id)}>
              {openReviewsId === course.id ? "Сховати відгуки" : "Переглянути відгуки"}
            </button>

            {openReviewsId === course.id && (
              <div>
                <h4>Відгуки:</h4>
                {reviews.length === 0 ? (
                  <p>Немає відгуків</p>
                ) : ( reviews.map((r, index) => (
                  <p className='messag' key={index}>{r.message}</p>
                ))
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