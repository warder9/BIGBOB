const registerForm = document.getElementById('registerForm');
const loginForm = document.getElementById('loginForm');
const addHabitForm = document.getElementById('addHabitForm');
const habitList = document.getElementById('habitList');
const authSection = document.getElementById('auth');
const habitsSection = document.getElementById('habits');

// Register a new user
registerForm.addEventListener('submit', async (e) => {
  e.preventDefault();
  const username = document.getElementById('username').value;
  const email = document.getElementById('email').value;
  const password = document.getElementById('password').value;

  const response = await fetch('/api/auth/register', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ username, email, password }),
  });

  const data = await response.json();
  if (response.ok) {
    alert('Registration successful! Please log in.');
  } else {
    alert(data.error);
  }
});

// Log in a user
loginForm.addEventListener('submit', async (e) => {
  e.preventDefault();
  const email = document.getElementById('loginEmail').value;
  const password = document.getElementById('loginPassword').value;

  const response = await fetch('/api/auth/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password }),
  });

  const data = await response.json();
  if (response.ok) {
    localStorage.setItem('token', data.token); // Store token in localStorage
    authSection.style.display = 'none';
    habitsSection.style.display = 'block';
    fetchHabits();
  } else {
    alert(data.error);
  }
});

// Add a new habit
addHabitForm.addEventListener('submit', async (e) => {
  e.preventDefault();
  const name = document.getElementById('habitName').value;
  const description = document.getElementById('habitDescription').value;
  const dueDate = document.getElementById('dueDate').value;

  const token = localStorage.getItem('token'); // Retrieve token from localStorage

  const response = await fetch('/api/habits', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`, // Include token in the header
    },
    body: JSON.stringify({ name, description, dueDate, status: 'Pending' }),
  });

  const data = await response.json();
  if (response.ok) {
    fetchHabits();
  } else {
    alert(data.error);
  }
});

// Fetch all habits for the logged-in user
async function fetchHabits() {
  const token = localStorage.getItem('token'); // Retrieve token from localStorage

  const response = await fetch('/api/habits', {
    headers: { Authorization: `Bearer ${token}` }, // Include token in the header
  });
  const data = await response.json();
  if (response.ok) {
    habitList.innerHTML = data
      .map(
        (habit) => `
        <li>
          <span>${habit.name} - ${habit.status}</span>
          <button onclick="deleteHabit('${habit._id}')">Delete</button>
        </li>
      `
      )
      .join('');
  } else {
    alert(data.error);
  }
}

// Delete a habit
window.deleteHabit = async (id) => {
  const token = localStorage.getItem('token'); // Retrieve token from localStorage

  const response = await fetch(`/api/habits/${id}`, {
    method: 'DELETE',
    headers: { Authorization: `Bearer ${token}` }, // Include token in the header
  });
  if (response.ok) {
    fetchHabits();
  } else {
    alert('Failed to delete habit');
  }
};