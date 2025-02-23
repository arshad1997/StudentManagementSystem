<template>
  <Navbar/>
  <div class="container mt-4">
    <h2 class="text-center mb-4">Payment Management</h2>

    <!-- Add Payment Button -->
    <div
      class="d-flex flex-column justify-content-around w-25 align-items-stretch ms-auto mb-2"
    >
      <button class="btn btn-primary mb-3" @click="openModal(false)">
        + Record Payment
      </button>
    </div>

    <!-- Payment Table -->
    <div class="table-responsive">
      <table class="table table-bordered table-striped">
        <thead class="table-primary">
          <tr>
            <th>#</th>
            <th>Student</th>
            <th>Course</th>
            <th>Amount Paid ($)</th>
            <th>Date</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(payment, index) in payments" :key="payment?.id">
            <td>{{ index + 1 }}</td>
            <td>{{ payment.student.name }}</td>
            <td>{{ payment.course.name }}</td>
            <td>${{ payment.amount_paid }}</td>
            <td>{{ payment.date_of_payment }}</td>
            <td>
              <button
                class="btn btn-sm btn-warning me-1"
                @click="openModal(true, payment)"
              >
                Edit
              </button>
              <button
                class="btn btn-sm btn-danger"
                @click="deletePayment(payment?.id)"
              >
                Delete
              </button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- Payment Modal -->
    <div class="modal fade" id="paymentModal" tabindex="-1" aria-hidden="true">
      <div class="modal-dialog">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title">
              {{ isEditing ? "Edit Payment" : "Record Payment" }}
            </h5>
            <button
              type="button"
              class="btn-close"
              data-bs-dismiss="modal"
            ></button>
          </div>
          <div class="modal-body">
            <form @submit.prevent="savePayment">
              <div class="mb-3">
                <label class="form-label">Student</label>
                <select
                  v-model="paymentData.student_id"
                  class="form-control"
                  required
                  @change="fetchRemainingFee"
                >
                  <option
                    v-for="student in students"
                    :key="student.id"
                    :value="student.id"
                  >
                    {{ student.name }}
                  </option>
                </select>
              </div>
              <div class="mb-3">
                <label class="form-label">Course</label>
                <select
                  v-model="paymentData.course_id"
                  class="form-control"
                  required
                >
                  <option
                    v-for="course in studentCourses"
                    :key="course.id"
                    :value="course.id"
                  >
                    {{ course.name }}
                  </option>
                </select>
              </div>
              <div class="mb-3">
                <label class="form-label">Amount Paid ($)</label>
                <input
                  v-model="paymentData.amount_paid"
                  type="number"
                  class="form-control"
                  required
                  @input="validateAmount"
                />
                <small v-if="paymentError" class="text-danger">{{
                  paymentError
                }}</small>
              </div>
              <div class="mb-3">
                <label class="form-label">Payment Date</label>
                <input
                  v-model="paymentData.date_of_payment"
                  type="date"
                  class="form-control"
                  required
                />
              </div>
              <button
                type="submit"
                class="btn btn-success w-100"
                :disabled="!!paymentError || paymentData.amount_paid <= 0"
              >
                {{ isEditing ? "Update Payment" : "Save Payment" }}
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
  components: { Navbar },
  data() {
    return {
      payments: [],
      students: [],
      studentCourses: [], // ✅ Store courses for selected student
      paymentData: {
        student_id: "",
        course_id: "",
        amount_paid: "",
        date_of_payment: "",
      },
      isEditing: false,
      modalInstance: null,
      remainingFee: 0,
      paymentError: "",
    };
  },
  methods: {
    async fetchPayments() {
      try {
        const response = await this.$axios.get("/payments");
        this.payments = response.data;
      } catch (error) {
        console.error("Error fetching payments:", error);
      }
    },

    async fetchStudents() {
      try {
        const response = await this.$axios.get("/students");
        this.students = response.data;
      } catch (error) {
        console.error("Error fetching students:", error);
      }
    },

    // ✅ Fetch Remaining Fee & Courses for Selected Student
    async fetchRemainingFee() {
      if (!this.paymentData.student_id) return;
      try {
        const response = await this.$axios.get(
          `/students/${this.paymentData.student_id}`
        );
        this.remainingFee = response.data.remaining_fee;
        this.studentCourses = response.data.courses; // ✅ Set only selected student's courses
      } catch (error) {
        console.error("Error fetching remaining fee and courses:", error);
      }
    },

    validateAmount() {
      if (this.paymentData.amount_paid > this.remainingFee) {
        this.paymentError = `Amount exceeds remaining balance: $${this.remainingFee}`;
      } else {
        this.paymentError = "";
      }
    },

    openModal(editing, payment = null) {
      this.isEditing = editing;
      this.paymentError = "";
      if (editing) {
        this.paymentData = { ...payment };
        this.fetchRemainingFee();
      } else {
        this.paymentData = {
          student_id: "",
          course_id: "",
          amount_paid: "",
          date_of_payment: "",
        };
      }
      this.$nextTick(() => {
        this.modalInstance = new Modal(document.getElementById("paymentModal"));
        this.modalInstance.show();
      });
    },

    async savePayment() {
      if (this.paymentError) return;

      try {
        if (this.isEditing) {
          await this.$axios.put(
            `/payments/${this.paymentData.id}`,
            this.paymentData
          );
        } else {
          await this.$axios.post("/payments", this.paymentData);
        }

        this.fetchPayments();
        this.modalInstance.hide();
      } catch (error) {
        console.error("Error saving payment:", error);
      }
    },

    async deletePayment(paymentId) {
      if (confirm("Are you sure you want to delete this payment?")) {
        try {
          await this.$axios.delete(`/payments/${paymentId}`);
          this.fetchPayments();
        } catch (error) {
          console.error("Error deleting payment:", error);
        }
      }
    },
  },
  mounted() {
    this.fetchPayments();
    this.fetchStudents();
  },
};
</script>
