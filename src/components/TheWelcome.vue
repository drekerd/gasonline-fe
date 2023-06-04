<template>
  <div class="app-title">Gasonline</div>
  <div class="welcome-message welcome">Welcome to</div>
  <div class="welcome-message">Gasonline</div>
  <div class="select-fuel-message">Which fuel are you into?</div>

  <div class="q-pa-md">
    <q-form @submit="onSubmit" class="q-gutter-md">
      <div class="fuel-selection" v-for="fuel in fuelList" :key="fuel.value">
        <q-radio name="fuel" v-model="selectedFuel" :val="fuel.value" :label="fuel.label"></q-radio>
        <div class="fuel-selection-separator"></div>
      </div>
      <div>
        <q-btn label="Show me the best prices" type="submit" />
      </div>
    </q-form>
  </div>
</template>

<script>
import { ref } from 'vue'

export default {
  data() {
    return {
      selectedFuel: 3,
      fuelList: [
        { label: 'Gasóleo+', value: 1 },
        { label: 'Gasóleo Simples', value: 2 },
        { label: 'Gasolina 95', value: 3 },
        { label: 'Gasolina 95 +', value: 4 },
        { label: 'Gasolina 98', value: 5 },
        { label: 'GPL', value: 6 }
      ],
      submitResult: []
    }
  },
  methods: {
    onSubmit() {
      console.log("fuelList", this.fuelList[this.selectedFuel-1].label)
      this.$router.push({
        name: 'conas',
        query: { fuel: this.fuelList[this.selectedFuel-1].label }
      });
    }
  }
}
</script>

<style scoped>
.q-gutter-md {
  margin: 34px 0 0 0;
}
.q-gutter-md > * {
  margin: 16px 0 0 0;
}
.app-title {
  font-family: 'Inter';
  font-style: normal;
  font-weight: 700;
  font-size: 19.6612px;
  line-height: 24px;

  color: #b56123;
}

.welcome-message {
  font-family: 'Inter';
  font-style: normal;
  font-weight: 600;
  font-size: 32px;
  line-height: 39px;
  color: #001159;
}
.welcome {
  margin-top: 16px;
}

.select-fuel-message {
  margin-top: 16px;
  font-family: 'Inter';
  font-style: normal;
  font-weight: 600;
  font-size: 18px;
  line-height: 24px;
  color: #001159;
}

.q-form {
  display: flex;
  flex-direction: column;
}

.fuel-selection {
  margin: 0;
}
.fuel-selection-separator {
  background: #c6c5d0;
  height: 1px;
  margin: 8px 0;
}
.q-btn {
  /* Auto layout */
  text-transform: none;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  padding: 0px;

  width: 328px;
  height: 48px;

  background: #3a53c9;
  border-radius: 100px;

  /* Inside auto layout */

  flex: none;
  order: 3;
  align-self: stretch;
  flex-grow: 0;

  /* Font */
  font-family: 'Inter';
  font-style: normal;
  font-weight: 500;
  font-size: 14px;
  line-height: 20px;
  letter-spacing: 0.1px;
  color: #ffffff;
  width: 100%;
}

.q-pa-md {
  padding: 0;
}
</style>
