const supabaseClient = supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

const authScreen = document.getElementById("auth-screen");
const appScreen = document.getElementById("app-screen");
const authForm = document.getElementById("auth-form");
const authError = document.getElementById("auth-error");
const emailInput = document.getElementById("email");
const passwordInput = document.getElementById("password");
const loginBtn = document.getElementById("login-btn");
const signupBtn = document.getElementById("signup-btn");
const logoutBtn = document.getElementById("logout-btn");
const userEmailSpan = document.getElementById("user-email");
const taskForm = document.getElementById("task-form");
const taskTitleInput = document.getElementById("task-title");
const taskDescriptionInput = document.getElementById("task-description");
const taskList = document.getElementById("task-list");

let currentUser = null;

async function init() {
  const { data } = await supabaseClient.auth.getSession();
  if (data.session) {
    handleLoggedIn(data.session.user);
  }

  supabaseClient.auth.onAuthStateChange((event, session) => {
    if (session) {
      handleLoggedIn(session.user);
    } else {
      handleLoggedOut();
    }
  });
}

function handleLoggedIn(user) {
  currentUser = user;
  authScreen.classList.add("hidden");
  appScreen.classList.remove("hidden");
  userEmailSpan.textContent = user.email;
  loadTasks();
}

function handleLoggedOut() {
  currentUser = null;
  authScreen.classList.remove("hidden");
  appScreen.classList.add("hidden");
  authForm.reset();
}

authForm.addEventListener("submit", async (e) => {
  e.preventDefault();
  await handleLogin();
});

signupBtn.addEventListener("click", async () => {
  await handleSignup();
});

async function handleLogin() {
  authError.textContent = "";
  const { error } = await supabaseClient.auth.signInWithPassword({
    email: emailInput.value,
    password: passwordInput.value,
  });
  if (error) {
    authError.textContent = error.message;
  }
}

async function handleSignup() {
  authError.textContent = "";
  const { error } = await supabaseClient.auth.signUp({
    email: emailInput.value,
    password: passwordInput.value,
  });
  if (error) {
    authError.textContent = error.message;
  } else {
    authError.style.color = "#16a34a";
    authError.textContent = "Account created. You can now log in.";
  }
}

logoutBtn.addEventListener("click", async () => {
  await supabaseClient.auth.signOut();
});

taskForm.addEventListener("submit", async (e) => {
  e.preventDefault();
  const title = taskTitleInput.value.trim();
  const description = taskDescriptionInput.value.trim();
  if (!title) return;

  const { error } = await supabaseClient.from("tasks").insert({
    title,
    description,
    completed: false,
    user_id: currentUser.id,
  });

  if (!error) {
    taskForm.reset();
    loadTasks();
  } else {
    alert("Could not add task: " + error.message);
  }
});

async function loadTasks() {
  const { data, error } = await supabaseClient
    .from("tasks")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) {
    taskList.innerHTML = `<div class="empty-state">Could not load tasks.</div>`;
    return;
  }

  renderTasks(data);
}

function renderTasks(tasks) {
  if (!tasks.length) {
    taskList.innerHTML = `<div class="empty-state">No tasks yet. Add one above.</div>`;
    return;
  }

  taskList.innerHTML = "";
  for (const task of tasks) {
    const item = document.createElement("div");
    item.className = "task-item" + (task.completed ? " completed" : "");

    item.innerHTML = `
      <input type="checkbox" class="task-checkbox" ${task.completed ? "checked" : ""} />
      <div class="task-content">
        <div class="task-title"></div>
        <div class="task-description"></div>
      </div>
      <button class="task-delete">Delete</button>
    `;

    item.querySelector(".task-title").textContent = task.title;
    item.querySelector(".task-description").textContent = task.description || "";

    item.querySelector(".task-checkbox").addEventListener("change", async (e) => {
      await supabaseClient
        .from("tasks")
        .update({ completed: e.target.checked })
        .eq("id", task.id);
      loadTasks();
    });

    item.querySelector(".task-delete").addEventListener("click", async () => {
      await supabaseClient.from("tasks").delete().eq("id", task.id);
      loadTasks();
    });

    taskList.appendChild(item);
  }
}

init();
