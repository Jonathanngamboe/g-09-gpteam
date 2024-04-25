<template>
  <div class="flex flex-center full-height">
    <q-card flat bordered>
      <!-- Contenu de la carte -->
      <q-card-section>
        <div class="text-h5 q-mt-sm q-mb-xs">{{ utilisateur.prenom }} {{ utilisateur.nom }}</div>
        <div class="text-subtitle1 q-mb-xs">{{ formaterDate(utilisateur.dateDeNaissance) }}</div>
        <div class="text-h7 text-dark q-mb-xs">{{ utilisateur.email }}</div>
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
    formaterDate(date) {
      const options = { year: 'numeric', month: 'long', day: 'numeric' };
      return new Date(date).toLocaleDateString(undefined, options);
    }
  }
}
</script>