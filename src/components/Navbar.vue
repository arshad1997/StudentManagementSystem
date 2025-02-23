<template>
    <nav class="navbar navbar-expand-lg navbar-dark bg-primary fixed-top">
      <div class="container">
        <router-link class="navbar-brand" to="/dashboard">Fee Management</router-link>
  
        <!-- Navbar Toggler Button -->
        <button
          class="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarNav"
          aria-controls="navbarNav"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span class="navbar-toggler-icon"></span>
        </button>
  
        <!-- Collapsible Menu -->
        <div class="collapse navbar-collapse" id="navbarNav">
          <ul class="navbar-nav ms-auto">
            <li class="nav-item">
              <router-link class="nav-link" to="/dashboard">Dashboard</router-link>
            </li>
            <li class="nav-item">
              <router-link class="nav-link" to="/students">Students</router-link>
            </li>
            <li class="nav-item">
              <router-link class="nav-link" to="/courses">Courses</router-link>
            </li>
            <li class="nav-item">
              <router-link class="nav-link" to="/payments">Payments</router-link>
            </li>
            <li class="nav-item">
              <button class="btn btn-danger" @click="logout">Logout</button>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  </template>
  
  <script>
  export default {
    methods: {
      logout() {
        localStorage.removeItem("token");
        this.$router.push("/login");
      }
    }
  };
  </script>
  
  <style>
  /* Ensure content is visible under fixed navbar */
  body {
    padding-top: 70px;
  }
  </style>
  