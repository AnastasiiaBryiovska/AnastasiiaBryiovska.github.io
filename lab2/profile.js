const dataInitials = document.getElementById('dataInitials');
const dataCourses = document.getElementById('dataCourses');
const dataProgress = document.getElementById('dataProgress');
const dataCertificates = document.getElementById('dataCertificates');

const currentUser = sessionStorage.getItem('currentUser');


if(currentUser && dataInitials){
    dataInitials.textContent = currentUser;
}