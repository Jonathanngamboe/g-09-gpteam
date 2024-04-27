<template>
  <div class="flex flex-center full-height">
    <q-card flat bordered class="q-pa-lg">
      <q-card-section>
        <div class="text-h2 q-mb-md">{{ utilisateur.first_name }} {{ utilisateur.last_name }}</div>
        <div class="text-h4 q-mb-md">{{ utilisateur.email }}</div>
        <div class="row justify-around">
          <q-btn color="primary" icon="edit" @click="editField('name')" label="Edit Name" />
          <q-btn color="primary" icon="edit" @click="editField('email')" label="Edit Email" />
        </div>
      </q-card-section>
    </q-card>
  </div>
</template>

<script>
export default {
  props: {
    utilisateur: Object
  },
  methods: {
    editField(field) {
      // Navigate to the edit page for the specified field
      this.$router.push(`/edit/${field}`);
    }
  }
}
</script>