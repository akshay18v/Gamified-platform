// js/studentDashboard.js

document.addEventListener("DOMContentLoaded", async () => {
  const token = localStorage.getItem("token");
  if (!token) {
    window.location.href = "../index.html"; // redirect to index if not logged in
    return;
  }
 try {
    // CHANGE: Use a relative path for the API call
    const res = await fetch("/api/dashboard", { 
      headers: { "Authorization": `Bearer ${token}` }
    });

    const data = await res.json();

    if (!res.ok) {
      alert(data.message);
      return;
    }

    // Example: populate leaderboard
    const leaderboard = document.getElementById("leaderboard");
    leaderboard.innerHTML = ""; // clear existing

    data.forEach((student, index) => {
      const tr = document.createElement("tr");
      tr.innerHTML = `
        <td>${index + 1}</td>
        <td>${student.name}</td>
        <td>${student.ecoPoints || 0}</td>
      `;
      leaderboard.appendChild(tr);
    });

  } catch (err) {
    console.error(err);
    alert("Failed to load dashboard data");
  }
});
// Inside studentDashboard.js or teacherDashboard.js
document.getElementById('logout-btn').addEventListener('click', () => {
    localStorage.removeItem('token'); // Clear the token
    window.location.href = 'login.html'; // Redirect to login
});