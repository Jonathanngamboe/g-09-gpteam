<template>
  <div class="flex flex-center full-height q-pa-md">
    <q-card flat bordered class="q-pa-lg">
      <q-card-section class="row items-center q-gutter-sm">
        <div class="col-12 text-h4 bg-dark text-white text-center rounded-borders q-pa-md">Home Owner</div>
        <q-card class="col-12 col-md-6 q-ma-md" flat bordered>
          <q-card-section>
            <div class="text-h6">{{ utilisateur.first_name }}</div>
          </q-card-section>
        </q-card>
        <q-card class="col-12 col-md-6 q-ma-md" flat bordered>
          <q-card-section>
            <div class="text-h6">{{ utilisateur.last_name }}</div>
          </q-card-section>
        </q-card>
        <q-card class="col-12 q-ma-md" flat bordered>
          <q-card-section>
            <div class="text-h6">078/456/78/90</div> <!-- Fictive phone number -->
          </q-card-section>
        </q-card>
        <q-card class="col-12 q-ma-md" flat bordered>
          <q-card-section>
            <div class="text-h6">{{ utilisateur.email }}</div>
          </q-card-section>
        </q-card>
        <div class="col-12 text-center q-mt-lg">
          <q-btn color="primary" icon="edit" @click="editField('informations')" label="Edit Informations" />
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

<style scoped>
.rounded-borders {
  border-radius: 25px;
}
.flex-center {
  height: 100vh; /* Make the component take up the full height of the page */
}
</style>