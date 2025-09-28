document.addEventListener('DOMContentLoaded', () => {
    const loginForm = document.getElementById('loginForm');
    
    if (loginForm) {
        loginForm.addEventListener('submit', async (e) => {
            e.preventDefault();

            const email = document.getElementById('email').value;
            const password = document.getElementById('password').value;

            try {
                const res = await fetch('/api/auth/login', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ email, password }),
                });

               const data = await res.json();

                if (res.ok) {
                    // 1. Success: Save the JWT token
                    localStorage.setItem('token', data.token); 
                    
                    // 2. CHANGE: Implement Role-Based Redirection
                    if (data.user && data.user.role === 'teacher') {
                        // Correctly redirect teacher to the teacher dashboard
                        window.location.href = 'Dashboard.html'; 
                    } else {
                        // Default or student role redirection
                        window.location.href = 'dashboard.html'; 
                    }

                    } else {
                    // 3. Failure: Show the error message from the backend
                    alert(data.message || 'Login failed. Please check your credentials.');
                }
            } catch (error) {
                console.error('Network Error:', error);
                alert('A network error occurred. Please try again.');
            }
        });
    }
});