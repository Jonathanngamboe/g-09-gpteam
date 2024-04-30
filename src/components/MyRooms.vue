<template>
  <div class="flex flex-center full-height q-pa-md">
    <q-card flat bordered class="q-pa-lg">
      <q-card-section class="row items-center q-gutter-sm">
        <div class="col-12 text-h4 bg-dark text-white text-center rounded-borders q-pa-md">My Rooms</div>
        <div class="col-12 col-md-6 q-ma-md flex flex-column">
          <q-card class="flex flex-column" flat bordered>
            <q-card-section class="flex flex-column">
              <div class="text-h6">{{ room.title }}</div>
            </q-card-section>
            <q-btn class="q-ml-md q-pa-xs" color="primary" icon="edit" @click="editField('title')" label="Edit Room" /> <!-- Changed this line -->
          </q-card>
          <q-btn class="align-self-end q-mt-lg" color="primary" icon="add" @click="addRoom" label="Add a Room" />
        </div>
      </q-card-section>
    </q-card>
  </div>
</template>



<script>
export default {
  props: {
    room: Object
  },
  methods: {
    editField(field) {
      this.$router.push(`/edit/${field}`);
    },
    addRoom() {
      this.$router.push('/add-room');
    }
  }
};
</script>

<style scoped>
.rounded-borders {
  border-radius: 25px;
}
.align-self-end {
  align-self: flex-end;
}
.edit-button {
  font-size: 0.8rem; /* Reduce the font size */
  margin-left: 1rem; /* Add margin to the left */
}
</style>