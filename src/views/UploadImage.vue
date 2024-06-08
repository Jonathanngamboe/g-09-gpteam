<template>
    <div class="upload-image">
        <q-form @submit.prevent="uploadImage">
            <input type="file" id="inputAddImage" @change="handleFileChange" style="display:none; margin-bottom: 2%;" />
            <q-btn onclick="document.getElementById('inputAddImage').click()" type="submit"  unelevated rounded color="primary" label="Select an image" />
            <span v-if="selectedFile" class="file-name" style="margin-left:1%;">{{ selectedFile.name }}</span><br><br>
            <q-btn type="submit"  unelevated rounded color="primary" label="Upload Image" />
        </q-form>
    </div>
</template>

<script>
import { ref } from 'vue';
import imagesService from '@/services/imagesService';
import { useQuasar } from 'quasar';

export default {
    name: 'UploadImage',
    
    setup(_, { emit }) {
        const $q = useQuasar();
        const selectedFile = ref(null);
        const image = ref({ ext_url: '' });

        const handleFileChange = (event) => {
            const files = event.target.files;
            if (files.length > 0) {
                selectedFile.value = files[0];
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

                try {
                    const response = await imagesService.createImage(formData);
                    emit('image-uploaded', response);  // Emit the event with the new image data
                    selectedFile.value = null; // Reset file input
                    image.value.ext_url = ''; // Reset URL input
                } catch (error) {
                    $q.notify({
                        color: 'negative',
                        position: 'top',
                        message: 'Error uploading image',
                    });
                }
            } else {
                $q.notify({
                    color: 'negative',
                    position: 'top',
                    message: 'Please select a file or provide an external URL',
                });
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
    margin-bottom: 2% ;
}
</style>