<template>
    <q-dialog :position="dialogPosition" v-model="visible" @update:visible="val => $emit('update:visible', val)">
      <q-card class="q-pa-md full-width">
        <q-bar class="full-width bg-white text-primary">
            <q-space />
            <q-btn dense flat icon="close" @click="closeDialog">
                <q-tooltip class="bg-white text-primary">Close</q-tooltip>
            </q-btn>        
        </q-bar>

        <q-card-section class="row items-center justify-between text-h6">
          <div>{{ user.first_name }}'s Reviews</div>
        </q-card-section>
  
        <q-separator spaced />
  
        <q-card-section>
          <div v-if="reviews.length > 0">
            <q-list separator>
                <q-item v-for="review in reviews" :key="review.id">
                    <q-item-section avatar>
                        <q-avatar color="primary" text-color="white">
                        {{ review.user.first_name.charAt(0).toUpperCase() }}
                        </q-avatar>
                    </q-item-section>
                    <q-item-section>
                        <div class="text-subtitle2">{{ review.user.first_name }} {{ review.user.last_name }}</div>
                        <q-rating v-model="review.rating" readonly color="primary" size="xs"/>
                        <div class="q-mt-xs">{{ review.comment }}</div>
                    </q-item-section>
                    <q-item-section side top>
                        <div class="text-caption text-grey">{{ new Date(review.created_at).toLocaleDateString() }}</div>
                    </q-item-section>
                </q-item>
            </q-list>
          </div>
          <div v-else class="text-center text-grey">
            No reviews available.
          </div>
        </q-card-section>
      </q-card>
    </q-dialog>
  </template>
  
  
<script>
    import { ref, defineComponent, computed, watch } from 'vue';
    import reviewService from '@/services/reviewService'; 
    import { useQuasar } from 'quasar';
    
    export default defineComponent ({
        props: {
            user: Object,
            visible: Boolean,
        },
        emits: ['update:visible'],
        setup(props, { emit }) {
            const $q = useQuasar();
            const reviews = ref([]);
            const dialogPosition = computed(() => $q.screen.lt.md ? 'bottom' : 'standard');
            
            const closeDialog = () => {
                emit('update:visible', false);
            };
            
            const fetchReviews = async () => {
                try {
                    reviews.value = await reviewService.getReviewsByUser(props.user.id);
                } catch (error) {
                    $q.notify({
                        color: 'negative',
                        position: 'top',
                        message: `${error}`
                    });
                }
            };
            
            watch(() => props.visible, (visible) => {
                if (visible) {
                    fetchReviews();
                }
            });
            
            return {
                dialogPosition,
                closeDialog,
                reviews,
            };
        }
    });
</script>
  