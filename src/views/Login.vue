<template>
  <div class="d-flex justify-content-center align-items-center vh-100 bg-light">
    <div class="card shadow p-4 rounded" style="width: 400px">
      <div class="card-body">
        <h2 class="text-center mb-4 text-primary">Login</h2>
        <form @submit.prevent="login">
          <div class="mb-3">
            <label for="email" class="form-label">Email Address</label>
            <input
              v-model="email"
              type="email"
              id="email"
              class="form-control"
              placeholder="Enter email"
              required
            />
          </div>
          <div class="mb-3">
            <label for="password" class="form-label">Password</label>
            <input
              v-model="password"
              type="password"
              id="password"
              class="form-control"
              placeholder="Enter password"
              required
            />
          </div>
          <button type="submit" class="btn btn-primary w-100">Login</button>
        </form>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      email: "",
      password: "",
    };
  },
  methods: {
    async login() {
      try {
        const response = await this.$axios.post("/login", {
          email: this.email,
          password: this.password,
        });
        localStorage.setItem("token", response?.data?.token);
        this.$router.push("/dashboard");
      } catch (error) {
        console.error(error);
      }
    },
  },
};
</script>

<style>
.card {
  border-radius: 12px;
}
</style>
