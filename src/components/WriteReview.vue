<template>
    <q-dialog :position="dialogPosition" v-model="visible">
        <q-card flat class="full-width">
            <q-bar class="full-width bg-white text-primary">
                <q-space />
                <q-btn dense flat icon="close" @click="closeDialog">
                    <q-tooltip class="bg-white text-primary">Close</q-tooltip>
                </q-btn>
            </q-bar>
            <q-card-section>
                <div class="text-h6">Submit a review</div>
            </q-card-section>
            <q-card-section>
                <q-rating v-model="rating" color="primary" />
            </q-card-section>
            <q-card-section>
                <q-input v-model="review" label="Comment" type="textarea" />
            </q-card-section>
            <q-card-section>
                <q-btn rounded unelevated label="Submit" color="primary" @click="submitReview" class="full-width" :disable="!review || !rating" />
            </q-card-section>
        </q-card>
    </q-dialog>    
</template>

<script>
    import { defineComponent, ref, computed } from 'vue';
    import reviewService from '@/services/reviewService';
    import { useQuasar } from 'quasar';

    export default defineComponent({
        props: {
            visible: Boolean
        },
        emits: ['update:visible'],
        setup(props, { emit }) {
            const $q = useQuasar();
            const review = ref('');
            const rating = ref(0);
            const dialogPosition = computed(() => $q.screen.lt.md ? 'bottom' : 'standard');

            const submitReview = async () => {
                try {
                    await reviewService.create({
                        review: review.value,
                        rating: rating.value
                    });
                    $q.notify({
                        color: 'positive',
                        position: 'top',
                        message: 'Review submitted successfully'
                    });
                    emit('update:visible', false);
                } catch (err) {
                    $q.notify({
                        color: 'negative',
                        position: 'top',
                        message: `An error occurred: ${err.message}`
                    });
                }
            };

            const closeDialog = () => {
                emit('update:visible', false);
            };

            return {
                review,
                rating,
                submitReview,
                dialogPosition,
                closeDialog
            };
        }
    });
</script>