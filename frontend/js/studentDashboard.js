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

    // **MODIFICATION START**

    // 1. Populate the User Profile section
    const currentUser = data.currentUser;
    document.getElementById("profile-name").textContent = currentUser.name;
    document.getElementById("profile-class").textContent = `Class: ${currentUser.class || 'N/A'}`;
    document.getElementById("eco-points").textContent = currentUser.ecoPoints || 0;

    // Update avatar with the first letter of the student's name
    const profileAvatar = document.getElementById('profile-avatar');
    if (currentUser.name) {
      const initial = currentUser.name.charAt(0).toUpperCase();
      profileAvatar.src = `https://via.placeholder.com/150/10b981/ffffff?text=${initial}`;
      profileAvatar.alt = `${currentUser.name}'s Profile Avatar`;
    }

    // 2. Populate the leaderboard
    const leaderboardTable = document.getElementById("leaderboard");
    const leaderboardData = data.leaderboard;
    leaderboardTable.innerHTML = ""; // clear existing

    leaderboardData.forEach((student, index) => {
      const tr = document.createElement("tr");

      // Highlight the current user in the leaderboard
      let studentName = student.name;
      if (student._id === currentUser._id) {
          tr.className = "bg-green-50 font-bold";
          studentName = `You (${student.name})`;
      } else {
          tr.className = "hover:bg-green-50/50";
      }

      tr.innerHTML = `
        <td class="px-4 py-3 whitespace-nowrap text-lg ${index === 0 ? 'text-yellow-600 font-extrabold' : ''}">${index + 1}</td>
        <td class="px-4 py-3 whitespace-nowrap text-gray-800">${studentName}</td>
        <td class="px-4 py-3 whitespace-nowrap font-semibold text-right text-green-600">${student.ecoPoints || 0}</td>
      `;
      leaderboardTable.appendChild(tr);
    });

    // **MODIFICATION END**

  } catch (err) {
    console.error(err);
    alert("Failed to load dashboard data");
  }
});

// Logout button functionality remains the same
document.getElementById('logout-btn').addEventListener('click', () => {
  localStorage.removeItem('token'); // Clear the token
  window.location.href = 'login.html'; // Redirect to login
});
