<script setup lang="ts">

/** metodo onMounted-> es parte del ciclo de vida de los componentes de vue
 * se ejecuta una vez se monta el componente en template
*/
//importando 
import { onMounted, ref, watch } from "vue";

import Header from './components/Header.vue';
import CountryList from './components/CountryList.vue'
import axiosCliente from './utils/axios';
import { Country } from './models/country.model';

//definiendo el estado del componente
const countries = ref<Country[]>([]);

//variable para guardar busqueda en el input
const search = ref("");

//guardando los paises filtrados
const filteredCountries = ref<Country[]>([]);

const page = ref(1);
const itemsPerPage = ref(12);
const paginatedPages = ref<Country[]>([]);
const totalItems = ref(0);


//metodo que hace el fectch de los paises
const getCountries = async() => {
  try{
    const { data } = await axiosCliente.get("/all");
    countries.value = data;
    totalItems.value = countries.value.length;
  } catch(error) {
    console.log(error);
  }
};

/**funcion de busqueda */
const filterCountries = () => {
  filteredCountries.value = countries.value.filter((country) => 
    country.name.common.toLowerCase().includes(search.value.toLowerCase()))
}

/**funcion de paginacion */
const sliceCountries = (currentCountries: Country[]) => {
  const start = (page.value -1) * itemsPerPage.value;
  const end = page.value * itemsPerPage.value;
  paginatedPages.value = currentCountries.slice(start, end);

}

onMounted(() => {
  getCountries();
  sliceCountries(countries.value);
});

const changePage = (newPage: number) => {
  page.value = newPage;
}

watch([countries, page, filteredCountries], () => {
  sliceCountries(
    filteredCountries.value.length <= 0 && search.value === ""
      ? countries.value  
      : filteredCountries.value
  );
});
//getCountries();
/** cuando no se use la etiqueta setup(composition api) en el script se debe exportar el componente 
 * como se muestra a continuacion:
 * ->de esta manera se trabaja con el (options api)
 * export default {
 *    components:{
 *       nombres del los componentes
 *    },
 *    data: {
 *       variables cuyo valor cambiara 
 *    },
 *    methods: {}
 *    
 * }
 * 
 */
</script>

<template>
  <Header />
  
  <div class="container max-w-screen-lg mx-auto px-6 pb-12">
    <div class="mb-8">
      <input 
        type="text" 
        class="border border-gray-300 rounded-md w-full p-1 px-4" 
        placeholder="Busca el Pais de tu preferencia"
        v-model="search"
        @input="filterCountries"
      />
    </div>
    <div class="mb-8 flex justify-center space-x-6">
        <button 
          :disabled="page <=1"
          :class="{'opacity-50': page <=1}"
          @click="$event => changePage(page - 1)"
          class="border border-gray-300 rounded px-2 py-0.5 hover:bg-gray-200">Previous</button>
        <button
          :disabled="page >= totalItems/itemsPerPage"
          :class="{'opacity-50': page >= totalItems/itemsPerPage}"
          @click="$event => changePage(page + 1)"
          class="border border-gray-300 rounded px-2 py-0.5 hover:bg-gray-200">Next</button>
    </div>
    <CountryList 
    :countries="paginatedPages" />
  </div>

  <!--componente para mostrar los datos del objeto countries
  iterando los paises -->
  <!--<div v-for="country in countries">{{ country.name.common }}</div>-->
</template>

