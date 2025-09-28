// ../js/teacherDashboard.js

document.addEventListener('DOMContentLoaded', async () => {
    const token = localStorage.getItem('token');
    const teacherClassEl = document.getElementById('teacherClass');
    const studentsTable = document.getElementById('studentsTable'); // The table body ID

    if (!token) {
        // Redirect if not logged in
        window.location.href = '../login.html'; // Assuming login is one directory up
        return;
    }

    try {
        // Fetch dashboard data (which includes user.class on the backend)
        const res = await fetch('/api/dashboard', {
            headers: { 'Authorization': `Bearer ${token}` }
        });

        const data = await res.json();

        if (!res.ok) {
            alert(data.message || 'Failed to load teacher data.');
            window.location.href = '../login.html';
            return;
        }

        // 🏆 FIX: Set the class name from the fetched data
        if (teacherClassEl && data.class) {
            teacherClassEl.textContent = data.class;
        }

        // --- Students Table Population (Recommended to include) ---
        if (studentsTable && data.students) {
            studentsTable.innerHTML = '';
            data.students.forEach(student => {
                const tr = document.createElement('tr');
                tr.className = 'hover:bg-green-50/50';
                tr.innerHTML = `
                    <td class="px-4 py-3 whitespace-nowrap text-center font-bold text-lg text-yellow-600">${student.rank}</td>
                    <td class="px-4 py-3 whitespace-nowrap text-gray-800">${student.name}</td>
                    <td class="px-4 py-3 whitespace-nowrap text-gray-500 text-sm">${student.email}</td>
                    <td class="px-4 py-3 whitespace-nowrap font-semibold text-right text-green-600">${student.ecoPoints}</td>
                `;
                studentsTable.appendChild(tr);
            });
        }
        
    } catch (error) {
        console.error('Error fetching dashboard data:', error);
        alert('An error occurred while loading the dashboard.');
    }
});