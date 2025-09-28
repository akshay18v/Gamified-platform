// Redirect user based on card click
document.getElementById('studentCard').addEventListener('click', function() {
  window.location.href = 'student/login.html';
});

document.getElementById('teacherCard').addEventListener('click', function() {
  window.location.href = 'teacher/login.html';
});
