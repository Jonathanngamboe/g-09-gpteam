<template>
    <div class="upload-image">
        <q-form @submit.prevent="uploadImage">
            <input type="file" @change="handleFileChange" style="margin-bottom: 2%;" />
            <q-input v-model="image.ext_url" label="External URL (optional)" outlined dense />
            <q-btn type="submit" label="Upload Image" color="primary" />
        </q-form>
    </div>
</template>

<script>
import { ref } from 'vue';
import imagesService from '@/services/imagesService';

export default {
    name: 'UploadImage',
    setup(_, { emit }) {
        const selectedFile = ref(null);
        const image = ref({ ext_url: '' });

        const handleFileChange = (event) => {
            const files = event.target.files;
            if (files.length > 0) {
                selectedFile.value = files[0];
                console.log('Selected file:', selectedFile.value);
            }
        };

        const uploadImage = async () => {
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
        };

        return {
            selectedFile,
            image,
            handleFileChange,
            uploadImage,
        };
    }
};
</script>

<style scoped>
.upload-image {
    margin: 20px;
}
</style>