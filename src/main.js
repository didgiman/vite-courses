import './style.css'
// import javascriptLogo from './javascript.svg'
// import viteLogo from '/vite.svg'
// import { setupCounter } from './counter.js'

const apiUrl = "http://127.0.0.1:8000/api";

async function fetchCourses() {
  try {
    const response = await fetch(apiUrl + "/courses");
    const data = await response.json();

    return data;
  } catch (error) {
    console.error("An error occured while fetching courses", error);
    throw error;
  }
}

async function fetchCourseTypes() {
  try {
    const response = await fetch(apiUrl + "/coursetypes");

    const data = await response.json();

    return data;
  } catch (error) {
    console.error("An error occured while fetching coursetypes", error);
    throw error;
  }
}

async function displayCourses() {
  const courses = await fetchCourses();
  const courseTypes = await fetchCourseTypes();
  document.querySelector('#app').innerHTML = `
    <div class="container mx-auto">
      <h1 class="pb-2">Courses</h1>
      <div class="grid grid-cols-1 gap-4">
        ${courses.map(course => `
            <div class="course bg-slate-200 rounded-xl p-4 shadow-xl flex justify-between">
              <div class="courseContent">
                ${course.name}: <b>&euro;${course.price}</b>
                (${courseTypes.filter(type => type.id === course.type_id).map(type => type.name)})
              </div>
              <div class="editForm gap-2 items-center hidden">
                <input type="hidden" name="course-id" value="${course.id}">
                <div class="w-1/2"><input type="text" name="course-name" placeholder="Course name" value="${course.name}" class="p-2 rounded-lg"></div>
                <div class="w-1/2"><input type="number" name="course-price" placeholder="Course price" value="${course.price}" class="p-2 rounded-lg"></div>
                <div class="w-1/2"><input type="datetime-local" name="course-start" placeholder="Course startdate" value="${course.start}" class="p-2 rounded-lg"></div>
                <div class="w-1/2"><input type="number" name="course-duration" placeholder="Course duration" value="${course.duration}" class="p-2 rounded-lg"></div>
                <div class="w-1/2"><select name="course-type" class="p-2 rounded-lg">${courseTypes.map(type => `<option value="${type.id}" ${type.id === course.type_id ? "selected" : ""}>${type.name}</option>`).join("")}</select></div>
                <div class="w-full"><button class="course-edit shadow-md">Update course</button></div>
              </div>
              <div class="actionLinks">
                [<a href="#" class="editCourse">edit</a>]
                [<a href="#" class="deleteCourse">delete</a>]
              </div>
            </div>
        `).join("")}
      </div>
      <div class="bg-slate-300 p-5 mt-5 rounded-xl shadow-xl">
        <h2 class="text-xl font-semibold pb-2">Add course</h2>
        <div class="grid grid-cols-3 gap-2">
          <div class="bg-red-200"><input type="text" id="course-name" placeholder="Course name" class="p-3 rounded-lg w-full"></div>
          <div><input type="number" id="course-price" placeholder="Course price" class="p-3 rounded-lg w-full"></div>
          <div><input type="date" id="course-start" placeholder="Course startdate" class="p-3 rounded-lg w-full"></div>
          <div><input type="number" id="course-duration" placeholder="Course duration" class="p-3 rounded-lg w-full"></div>
          <div><select id="course-type" class="p-3 rounded-lg w-full">${courseTypes.map(type => `<option value="${type.id}">${type.name}</option>`).join("")}</select></div>
          <div><button id="course-create" class="shadow-md w-full">Create course</button></div>
        </div>
      </div>
    </div>
  `
  setEventHandlers();
}
displayCourses();

async function setEventHandlers() {
  const createBtn = document.getElementById("course-create");
  createBtn.addEventListener("click", async event => {
    const course = {
      name: document.getElementById("course-name").value,
      price: +document.getElementById("course-price").value,
      start: document.getElementById("course-start").value,
      duration: +document.getElementById("course-duration").value,
      type: +document.getElementById("course-type").value
    }
    const result = await postCourse(course);

    displayCourses();
  });

  const editButtons = document.querySelectorAll(".course-edit");
  editButtons.forEach(button => {
    button.addEventListener("click", async (event) => {
      const button = event.currentTarget;
      const form = button.closest(".editForm");

      const course = {
        id: form.querySelector("[name=course-id]").value,
        name: form.querySelector("[name=course-name]").value,
        price: form.querySelector("[name=course-price]").value,
        start: form.querySelector("[name=course-start]").value,
        duration: form.querySelector("[name=course-duration]").value,
        type: form.querySelector("[name=course-type]").value
      }

      await updateCourse(course);

      displayCourses();
    })
  });

  const editLinks = document.querySelectorAll(".editCourse");
  editLinks.forEach(link => {
    link.addEventListener("click", (event) => {
      const link = event.currentTarget;
      const course = link.closest(".course");
      const editForm = course.querySelector(".editForm");
      const courseContent = course.querySelector(".courseContent");
      const actionLinks = course.querySelector(".actionLinks");
      courseContent.classList.add("hidden");
      editForm.classList.remove("hidden");
      editForm.classList.add("flex");
      actionLinks.classList.add("hidden");
    })
  })

  const deleteLinks = document.querySelectorAll(".deleteCourse");
  deleteLinks.forEach(link => {
    link.addEventListener("click", async (event) => {
      const link = event.currentTarget;
      const course = link.closest(".course");
      const courseId = course.querySelector("[name=course-id]").value;

      await deleteCourse(courseId);

      displayCourses();
    })
  })
}

async function postCourse({ name, price, start, duration, type }) {
  try {
    const response = await fetch(apiUrl + "/courses", {
      method: "POST",
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        name: name,
        price: price,
        start: start,
        duration: duration,
        type_id: type
      })
    })

    const data = await response.json();
    console.log(data);
  } catch (error) {
    console.error("An error occured while posting course", error);
    throw error;
  }
}

async function updateCourse({ id, name, price, start, duration, type }) {
  try {
    const response = await fetch(apiUrl + "/courses/" + id, {
      method: "PUT",
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        name: name,
        price: price,
        start: start,
        duration: duration,
        type_id: type
      })
    })

    const data = await response.json();
    console.log(data);
  } catch (error) {
    console.error("An error occured while updating course", error);
    throw error;
  }
}

async function deleteCourse(id) {
  try {
    const response = await fetch(apiUrl + "/courses/" + id, {
      method: "DELETE"
    })

    const data = await response.json();
    console.log(data);
  } catch (error) {
    console.error("An error occured while deleting course", error);
    throw error;
  }
}
