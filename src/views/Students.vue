<template>
  <Navbar />
  <div class="container mt-4">
    <h2 class="text-center mb-4">Student Management</h2>
    <div
      class="d-flex flex-column justify-content-around w-25 align-items-stretch ms-auto mb-2"
    >
      <button class="btn btn-primary mb-3" @click="openModal(false)">
        + Add Student
      </button>

      <!-- Filter Pending Balances -->
      <label>
        <input
          type="checkbox"
          v-model="showPendingOnly"
          @change="fetchStudents"
        />
        Show only students with pending balances
      </label>

      <!-- Export Button -->
      <button @click="exportToCSV">Export as CSV</button>
    </div>

    <!-- Student List Table -->
    <div class="table-responsive">
      <table class="table table-bordered table-striped">
        <thead class="table-primary">
          <tr>
            <th>#</th>
            <th>Name</th>
            <th>Email</th>
            <th>Phone</th>
            <th>Date of Birth</th>
            <th>Address</th>
            <th>Courses</th>
            <th>Total Fee</th>
            <th>Fee Paid</th>
            <th>Remaining Fee</th>
            <th>Status</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(student, index) in students" :key="student.id">
            <td>{{ index + 1 }}</td>
            <td>{{ student.name }}</td>
            <td>{{ student.email }}</td>
            <td>{{ student.phone }}</td>
            <td>{{ student.dob }}</td>
            <td>{{ student.address }}</td>
            <td>
              <ul class="list-unstyled">
                <li v-for="course in student.courses" :key="course.id">
                  {{ course.name }} ({{ course.duration }} months)
                </li>
              </ul>
            </td>
            <td>${{ student.total_fee }}</td>
            <td>${{ student.amount_paid }}</td>
            <td>${{ student.remaining_fee }}</td>
            <td>
              <span :class="statusClass(student.status)">
                {{ student.status }}
              </span>
            </td>
            <td>
              <button
                class="btn btn-sm btn-warning me-1"
                @click="openModal(true, student)"
              >
                Edit
              </button>
              <button
                class="btn btn-sm btn-warning me-1"
                @click="toggleStatus(student)"
              >
                Toggle
              </button>
              <button
                class="btn btn-sm btn-danger"
                @click="deleteStudent(student.id)"
              >
                Delete
              </button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- Add/Edit Student Modal -->
    <div class="modal fade" id="studentModal" tabindex="-1" aria-hidden="true">
      <div class="modal-dialog">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title">
              {{ isEditing ? "Edit Student" : "Add Student" }}
            </h5>
            <button
              type="button"
              class="btn-close"
              data-bs-dismiss="modal"
              aria-label="Close"
            ></button>
          </div>
          <div class="modal-body">
            <form @submit.prevent="saveStudent">
              <div class="mb-3">
                <label class="form-label">Name</label>
                <input
                  v-model="studentForm.name"
                  type="text"
                  class="form-control"
                  required
                />
              </div>
              <div class="mb-3">
                <label class="form-label">Email</label>
                <input
                  v-model="studentForm.email"
                  type="email"
                  class="form-control"
                  required
                />
              </div>
              <div class="mb-3">
                <label class="form-label">Phone</label>
                <input
                  v-model="studentForm.phone"
                  type="text"
                  class="form-control"
                  required
                />
              </div>
              <div class="mb-3">
                <label class="form-label">Date of Birth</label>
                <input
                  v-model="studentForm.dob"
                  type="date"
                  class="form-control"
                  required
                />
              </div>
              <div class="mb-3">
                <label class="form-label">Address</label>
                <textarea
                  v-model="studentForm.address"
                  class="form-control"
                  required
                ></textarea>
              </div>
              <div class="mb-3">
                <label class="form-label">Assign Courses</label>
                <select
                  v-model="studentForm.selectedCourses"
                  multiple
                  class="form-control"
                >
                  <option
                    v-for="course in courses"
                    :key="course.id"
                    :value="course.id"
                  >
                    {{ course.name }} ({{ course.duration }} months)
                  </option>
                </select>
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
      students: [],
      courses: [],
      studentForm: {
        id: null,
        name: "",
        email: "",
        phone: "",
        dob: "",
        address: "",
        selectedCourses: [],
      },
      isEditing: false,
      modalInstance: null,
    };
  },
  methods: {
    exportToCSV() {
      let csvContent =
        "Student Name,Total Fees,Amount Paid,Remaining Balance\n";

      this.students.forEach((student) => {
        csvContent += `${student.name},${student.total_fee || 0},${
          student.amount_paid || 0
        },${student.remaining_fee || 0}\n`;
      });

      const blob = new Blob([csvContent], { type: "text/csv" });
      const link = document.createElement("a");
      link.href = URL.createObjectURL(blob);
      link.download = "students_fees.csv";
      link.click();
    },
    async fetchStudents() {
      try {
        const url = this.showPendingOnly
          ? "/students?pending_only=true"
          : "/students";
        const response = await this.$axios.get(url);
        this.students = response.data.map((student) => ({
          ...student,
          total_fee: student.courses.reduce(
            (sum, course) => sum + course.duration * course.fee_per_month,
            0
          ),
        }));
      } catch (error) {
        console.error("Error fetching students:", error);
      }
    },
    async fetchCourses() {
      try {
        const response = await this.$axios.get("/courses");
        this.courses = response.data;
      } catch (error) {
        console.error("Error fetching courses:", error);
      }
    },
    async deleteStudent(studentId) {
      if (confirm("Are you sure you want to delete this student?")) {
        try {
          await this.$axios.delete(`/students/${studentId}`);
          this.students = this.students.filter(
            (student) => student.id !== studentId
          );
        } catch (error) {
          console.error("Error deleting student:", error);
        }
      }
    },
    async toggleStatus(student) {
      const newStatus = student.status === "active" ? "suspended" : "active";
      try {
        await this.$axios.put(`/students/${student.id}`, {
          status: newStatus,
        });
        student.status = newStatus;
      } catch (error) {
        console.error("Error updating status:", error);
      }
    },
    openModal(editing, student = null) {
      this.isEditing = editing;
      if (editing) {
        this.studentForm = {
          ...student,
          selectedCourses: student.courses.map((course) => course.id),
        };
      } else {
        this.studentForm = {
          id: null,
          name: "",
          email: "",
          phone: "",
          dob: "",
          address: "",
          selectedCourses: [],
        };
      }
      this.$nextTick(() => {
        this.modalInstance = new Modal(document.getElementById("studentModal"));
        this.modalInstance.show();
      });
    },
    async saveStudent() {
      try {
        if (this.isEditing) {
          await this.$axios.put(`/students/${this.studentForm.id}`, {
            name: this.studentForm.name,
            email: this.studentForm.email,
            phone: this.studentForm.phone,
            dob: this.studentForm.dob,
            address: this.studentForm.address,
            courses: this.studentForm.selectedCourses,
          });
        } else {
          await this.$axios.post("/students", {
            name: this.studentForm.name,
            email: this.studentForm.email,
            phone: this.studentForm.phone,
            dob: this.studentForm.dob,
            address: this.studentForm.address,
            courses: this.studentForm.selectedCourses,
          });
        }

        this.fetchStudents();
        this.modalInstance.hide();
      } catch (error) {
        console.error("Error saving student:", error);
      }
    },
    statusClass(status) {
      return {
        "badge bg-success": status === "active",
        "badge bg-danger": status === "suspended",
        "badge bg-secondary": status === "rejected",
      };
    },
  },
  mounted() {
    this.fetchStudents();
    this.fetchCourses();
  },
};
</script>

<style>
.table {
  text-align: center;
}
</style>
