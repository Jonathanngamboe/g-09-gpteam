<template>
  <div>
      <h1>Room Details</h1>
      <div v-if="room">
          <p>Title: {{ room.title }}</p>
          <p>Description: {{ room.description }}</p>
          <p>Price: {{ room.price }}</p>
          <p>Location: {{ room.location }}</p>
      </div>
  </div>
</template>

<script>
import axios from '@/services/api';
export default {
  name: "HelloWorld",
  data() {
        return {
            room: null
        };
    },
  props: {
    msg: String
  },
  mounted() {
      axios.get('/rooms/1/')
          .then(response => {
              this.room = response.data;
          })
          .catch(error => {
              console.error('There was an error!', error);
          });
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
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
</style>
