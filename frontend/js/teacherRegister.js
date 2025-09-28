const form = document.getElementById("registerForm"); // Assuming you use a teacherRegistration.html that has this ID

form.addEventListener("submit", async (e) => {
  e.preventDefault();

  const name = form.name.value;
  const email = form.email.value;
  const password = form.password.value;
  
  // 🏆 FIX: Hardcode the role to "teacher" for this dedicated script
  const role = "teacher"; 
  
  const className = form.class.value; // Teachers are also associated with a class

  try {
    const res = await fetch("http://localhost:5000/api/auth/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, email, password, role, class: className })
    });

    const data = await res.json();

    if (res.ok) {
      localStorage.setItem("token", data.token);
      alert("Teacher registered successfully!");
      // Redirect to the teacher dashboard path
      window.location.href = "Dashboard.html"; 
    } else {
      alert(data.message);
    }
  } catch (err) {
    console.error(err);
    alert("Server error");
  }
});