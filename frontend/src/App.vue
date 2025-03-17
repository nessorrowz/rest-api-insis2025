<template>
  <div class="p-8">
    <h1 class="text-2xl font-bold mb-4">User Management</h1>

    <form @submit.prevent="handleSubmit" class="mb-4 space-y-2">
      <input
        v-model="formData.name"
        type="text"
        placeholder="Name"
        class="border p-2 w-full"
      />
      <input
        v-model="formData.email"
        type="email"
        placeholder="Email"
        class="border p-2 w-full"
      />
      <input
        v-model="formData.category"
        type="text"
        placeholder="Category"
        class="border p-2 w-full"
      />
      <button type="submit" class="bg-blue-500 text-white p-2 rounded">
        Add User
      </button>
    </form>

    <ul class="space-y-4">
      <li v-for="user in users" :key="user._id" class="border p-4 rounded">
        <p>Name: {{ user.name }}</p>
        <p>Email: {{ user.email }}</p>
        <p>Category: {{ user.category }}</p>
        <div class="space-x-2 mt-2">
          <button @click="handleUpdate(user._id)" class="bg-yellow-500 text-white p-2 rounded">
            Update
          </button>
          <button @click="handleDelete(user._id)" class="bg-red-500 text-white p-2 rounded">
            Delete
          </button>
        </div>
      </li>
    </ul>
  </div>
</template>

<script>
import { ref, onMounted } from 'vue';

export default {
  setup() {
    const users = ref([]);
    const formData = ref({ name: '', email: '', category: '' });

    const fetchUsers = async () => {
      const response = await fetch("http://localhost:1337/users");
      users.value = await response.json();
    };

    const handleSubmit = async () => {
      await fetch("http://localhost:1337/users", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData.value),
      });
      formData.value = { name: '', email: '', category: '' };
      fetchUsers();
    };

    const handleDelete = async (id) => {
      await fetch(`http://localhost:1337/users/${id}`, { method: "DELETE" });
      fetchUsers();
    };

    const handleUpdate = async (id) => {
      await fetch(`http://localhost:1337/users/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData.value),
      });
      fetchUsers();
    };

    onMounted(fetchUsers);

    return { users, formData, handleSubmit, handleDelete, handleUpdate };
  },
};
</script>

<style scoped>
input {
  margin-bottom: 10px;
}
</style>
