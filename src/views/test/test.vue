<template>
  <div class="test-container">
    <div>1111</div>
  </div>
</template>

<script>
import { fetchList } from '@/api/article'
import Sortable from 'sortablejs'

export default {
 
  data() {
    return {
    
    }
  },
  created() {
    this.getList()
  },
  methods: {
   
  }
}
</script>

<style>

</style>

<style scoped>

</style>
