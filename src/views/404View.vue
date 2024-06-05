<template>
    <q-page class="flex flex-center">
        <div class="text-center q-gutter-md">
            <h1>404</h1>
            <h2>Page not found</h2>
            <q-btn
                unelevated
                rounded
                color="primary"
                label="Go back"
                @click="goBack"
            />
        </div>
    </q-page>
</template>

<script>
    import { defineComponent } from 'vue';
    import { useRouter } from 'vue-router';

    export default defineComponent({
        setup() {
            const router = useRouter();

            const goBack = () => {
                router.go(-1);
            };

            return {
                goBack
            };
        }
    });
</script>
