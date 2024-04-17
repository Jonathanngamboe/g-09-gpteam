<template>
  <div class="container">
    <h1>Available Rooms</h1>
    <div class="row">
      <div class="col-md-4" v-for="room in rooms" :key="room.id">
        <div class="card">
          <div class="card-body">
            <h5 class="card-title"><b>{{ room.title }}</b></h5>
            <p class="card-text">{{ room.description }}</p>
            <p class="card-text">Price: CHF {{ room.price }}.-</p>
            <p class="card-text">Location: {{ room.location }}</p>
          </div>
        </div>
      </div>
      <div class="col-12" v-if="rooms.length === 0">
        <p>No rooms available at the moment.</p>
      </div>
    </div>
  </div>
</template>

<script>
import axios from '@/services/api';
export default {
  name: "HelloWorld",
  data() {
    return {
      rooms: [],
    };
  },
  props: {
    msg: String
  },
  mounted() {
      axios.get('/rooms/')
          .then(response => {
              this.rooms = response.data;
          })
          .catch(error => {
              console.error('There was an error!', error);
          });
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
@import 'https://stackpath.bootstrapcdn.com/bootstrap/4.5.2/css/bootstrap.min.css';

.card {
  margin-bottom: 1rem;
  border-radius: 8px;
}

h1 {
  font-weight: 500;
  font-size: 2.6rem;
  top: -10px;
}

h3 {
  font-size: 1.2rem;
}

.greetings h1,
.greetings h3 {
  text-align: center;
}

@media (min-width: 1024px) {
  .greetings h1,
  .greetings h3 {
    text-align: left;
  }
}

@media (max-width: 768px) {
  .card-img-top {
    height: 40vw;
  }
}
</style>
