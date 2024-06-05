<template>
    <div class="upload-image">
        <q-form @submit.prevent="uploadImage">
    <input type="file" ref="fileInput" @change="handleFileChange" class="hidden-input" />
    <q-btn unelevated rounded color="primary" label="Choose File" @click="triggerFileInput" style="margin-bottom:2%"/>
    <span v-if="selectedFileName" class="file-name">{{ selectedFileName }}</span><br>
    <q-btn type="submit" unelevated rounded color="primary" label="Upload Image" />
  </q-form>
    </div>
</template>
<script>
import { ref } from 'vue';
import imagesService from '@/services/imagesService';
export default {
    data() {
    return {
      selectedFileName: ''
    };
  },
    methods: {
    triggerFileInput() {
      this.$refs.fileInput.click();
    },
    handleFileChange(event) {
      const file = event.target.files[0];
      if (file) {
        this.selectedFileName = file.name;
      } else {
        this.selectedFileName = '';
      }
    },
    async uploadImage() {
        if (selectedFile.value || image.value.ext_url) {
                const formData = new FormData();
                if (selectedFile.value) {
                    formData.append('image', selectedFile.value);
                }
                if (image.value.ext_url) {
                    formData.append('ext_url', image.value.ext_url);
                }

                // Log the content of formData
                formData.forEach((value, key) => {
                    console.log(key + ': ' + value);
                });

                try {
                    const response = await imagesService.createImage(formData);
                    console.log('Image uploaded successfully:', response);
                    emit('image-uploaded', response);  // Emit the event with the new image data
                    selectedFile.value = null; // Reset file input
                    image.value.ext_url = ''; // Reset URL input
                } catch (error) {
                    console.error('Error uploading image:', error);
                }
            } else {
                console.log('No file or URL provided');
            }
    }
  }
}
</script>


<style scoped>
.upload-image {
    margin: 20px;
}
.hidden-input {
  display: none;
}
.file-name {
  margin-left: 10px;
  margin-right: 10px;
  font-size: 14px;
  color: #555;
}
</style>