<template>
  <Navbar/>
  <div class="container mt-4">
    <h2 class="text-center mb-4">Course Management</h2>

    <!-- Add Course Button -->
    <div
      class="d-flex flex-column justify-content-around w-25 align-items-stretch ms-auto mb-2"
    >
      <button class="btn btn-primary mb-3" @click="openModal">
        + Add Course
      </button>
    </div>

    <!-- Course List Table -->
    <div class="table-responsive">
      <table class="table table-bordered table-striped">
        <thead class="table-primary">
          <tr>
            <th>#</th>
            <th>Course Name</th>
            <th>Duration (Months)</th>
            <th>Fee Per Month ($)</th>
            <th>Total Enrolled Students</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(course, index) in courses" :key="course.id">
            <td>{{ index + 1 }}</td>
            <td>{{ course.name }}</td>
            <td>{{ course.duration }}</td>
            <td>${{ course.fee_per_month }}</td>
            <td>{{ course.students_count }}</td>
            <td>
              <button
                class="btn btn-sm btn-warning me-1"
                @click="editCourse(course)"
              >
                Edit
              </button>
              <button
                class="btn btn-sm btn-danger"
                @click="deleteCourse(course.id)"
              >
                Delete
              </button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- Add/Edit Course Modal -->
    <div class="modal fade" id="courseModal" tabindex="-1" aria-hidden="true">
      <div class="modal-dialog">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title">
              {{ isEditing ? "Edit Course" : "Add Course" }}
            </h5>
            <button
              type="button"
              class="btn-close"
              data-bs-dismiss="modal"
              aria-label="Close"
            ></button>
          </div>
          <div class="modal-body">
            <form @submit.prevent="saveCourse">
              <div class="mb-3">
                <label class="form-label">Course Name</label>
                <input
                  v-model="courseData.name"
                  type="text"
                  class="form-control"
                  required
                />
              </div>
              <div class="mb-3">
                <label class="form-label">Duration (Months)</label>
                <input
                  v-model="courseData.duration"
                  type="number"
                  class="form-control"
                  required
                />
              </div>
              <div class="mb-3">
                <label class="form-label">Fee Per Month ($)</label>
                <input
                  v-model="courseData.fee_per_month"
                  type="number"
                  class="form-control"
                  required
                />
              </div>
              <button type="submit" class="btn btn-success w-100">
                {{ isEditing ? "Update" : "Save" }}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import axios from "axios";
import { Modal } from "bootstrap";
import Navbar from "../components/Navbar.vue";

export default {
  components: {
    Navbar,
  },
  data() {
    return {
      courses: [],
      isEditing: false,
      courseData: {
        id: null,
        name: "",
        duration: "",
        fee_per_month: "",
      },
      modalInstance: null,
    };
  },
  methods: {
    async fetchCourses() {
      try {
        const response = await this.$axios.get("/courses");
        this.courses = response.data;
      } catch (error) {
        console.error("Error fetching courses:", error);
      }
    },
    openModal() {
      this.isEditing = false;
      this.courseData = { id: null, name: "", duration: "", fee_per_month: "" };
      this.$nextTick(() => {
        this.modalInstance = new Modal(document.getElementById("courseModal"));
        this.modalInstance.show();
      });
    },
    editCourse(course) {
      this.isEditing = true;
      this.courseData = { ...course };
      this.$nextTick(() => {
        this.modalInstance = new Modal(document.getElementById("courseModal"));
        this.modalInstance.show();
      });
    },
    async saveCourse() {
      try {
        if (this.isEditing) {
          await this.$axios.put(
            `/courses/${this.courseData.id}`,
            this.courseData
          );
        } else {
          await this.$axios.post("/courses", this.courseData);
        }
        this.fetchCourses();
        this.modalInstance.hide();
      } catch (error) {
        console.error("Error saving course:", error);
      }
    },
    async deleteCourse(courseId) {
      if (confirm("Are you sure you want to delete this course?")) {
        try {
          await this.$axios.delete(`/courses/${courseId}`);
          this.fetchCourses();
        } catch (error) {
          console.error("Error deleting course:", error);
        }
      }
    },
  },
  mounted() {
    this.fetchCourses();
  },
};
</script>

<style>
.table {
  text-align: center;
}
</style>
