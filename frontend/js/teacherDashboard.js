// ../js/teacherDashboard.js

document.addEventListener('DOMContentLoaded', async () => {
    const token = localStorage.getItem('token');
    if (!token) {
        window.location.href = '../login.html'; // Redirect if not logged in
        return;
    }

    // Get references to all elements that need updating
    const teacherClassEl = document.getElementById('teacherClass');
    const studentsTable = document.getElementById('studentsTable');
    const totalStudentsEl = document.getElementById('totalStudents');
    const averagePointsEl = document.getElementById('averagePoints');
    const highestScoreEl = document.getElementById('highestScore');

    try {
        // Fetch the structured dashboard data from the API
        const res = await fetch('/api/dashboard', {
            headers: { 'Authorization': `Bearer ${token}` }
        });
        const data = await res.json();

        if (!res.ok) {
            throw new Error(data.message || 'Failed to load teacher data.');
        }

        // 1. Populate the teacher's class name in the header
        if (teacherClassEl && data.class) {
            teacherClassEl.textContent = data.class;
        }

        // 2. Populate the students leaderboard table
        if (studentsTable && data.students) {
            studentsTable.innerHTML = ''; // Clear any placeholder content
            if (data.students.length === 0) {
                // Show a message if there are no students
                studentsTable.innerHTML = `<tr><td colspan="4" class="text-center py-4 text-gray-500">No students are registered in this class yet.</td></tr>`;
            } else {
                data.students.forEach(student => {
                    const tr = document.createElement('tr');
                    tr.className = 'hover:bg-green-50/50';
                    tr.innerHTML = `
                        <td class="px-4 py-3 whitespace-nowrap text-center font-bold text-lg ${student.rank === 1 ? 'text-yellow-600' : ''}">${student.rank}</td>
                        <td class="px-4 py-3 whitespace-nowrap text-gray-800">${student.name}</td>
                        <td class="px-4 py-3 whitespace-nowrap text-gray-500 text-sm">${student.email}</td>
                        <td class="px-4 py-3 whitespace-nowrap font-semibold text-right text-green-600">${student.ecoPoints}</td>
                    `;
                    studentsTable.appendChild(tr);
                });
            }
        }

        // 3. Populate the summary data cards
        if (data.summary) {
            totalStudentsEl.textContent = data.summary.totalStudents;
            averagePointsEl.textContent = data.summary.averagePoints;
            highestScoreEl.textContent = data.summary.highestScore;
        }
        
    } catch (error) {
        console.error('Error fetching dashboard data:', error);
        alert(`An error occurred: ${error.message}`);
    }
});

// Add event listener for the logout button
document.getElementById('logout-btn').addEventListener('click', () => {
    localStorage.removeItem('token');
    window.location.href = 'login.html';
});
