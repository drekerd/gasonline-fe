<template>
  <div class="border-top" @click="$emit('close-details')"></div>
  <div class="station-details-header">
    <div class="favorite-icon-container">
      <!-- <fa v-if="this.isFavorite" :icon="['fas', 'star']" class="favorite-icon" @click="toggleFavorite()"/> -->
      <FavoriteIcon v-if="this.isFavorite" class="star" @click="toggleFavorite()" />
      <NoFavoriteIcon v-if="!this.isFavorite" class="star" @click="toggleFavorite()" />
    </div>
    <div class="station-title">
      {{ station.brand }}
      {{ station.parish }}
    </div>
  </div>
  <div class="station-details-container">
    <div class="station-details-info container">
      <div class="address-label info-label"><span>Address</span></div>
      <div class="station-address info-content">
        <div class="address-wrapper">
          <div class="first-address">
            {{ station.address }}
          </div>
          <div class="second-address">
            {{ station.postalCode }} {{ station.parish }} - {{ station.city }}
          </div>
        </div>
        <DirectionIcon class="direction-icon" />
      </div>
      <div class="station-opening-hours">
        <div class="week-opening-hours info-content">
          <div class="week-days-label info-label">Week days</div>
          <div class="week-days-hours info-content">
            {{ station.weekDaysOpeningHours }} - {{ station.weekDaysClosingHours }}
          </div>
        </div>
        <div class="saturday-opening-hours">
          <div class="saturday-days-label info-label">Saturday</div>
          <div class="saturday-days-hours info-content">
            {{ station.saturdayOpeningHours }} - {{ station.saturdayClosingHours }}
          </div>
        </div>
        <div class="sunday-opening-hours">
          <div class="sunday-days-label info-label">Sunday</div>
          <div class="sunday-days-hours info-content">
            {{ station.sundayOpeningHours }} - {{ station.sundayClosingHours }}
          </div>
        </div>
        <!-- <div class="holyDays-opening-hours">
          <div class="holyDays-days-label hours-info-label">
            Holydays
          </div>
          <div class="holyDays-days-hours">
            {{ station.holyDaysOpeningHours }} - {{ station.holyDaysClosingHours }}
          </div>
        </div> -->
      </div>
    </div>
    <div class="station-details-fuels container">
      <div v-for="fuel in station.fuels" :key="fuel.externalId" class="station-fuel">
        <div class="name">{{ fuel.name }}</div>
        <div class="fuel-prices">
          <div class="price">{{ fuel.price }}€</div>
          <div class="diff-price">-0.002€</div>
        </div>
      </div>
    </div>
    <div class="station-services container">
      <div class="station-services-label info-label">services</div>
      <div class="station-service info-content">
        <fa :icon="['far', 'credit-card']" class="icon" />
        Pagamento Multibanco
      </div>
      <div class="station-service info-content">
        <fa :icon="['fas', 'euro-sign']" class="icon" />
        Pagamento Dinheiro
      </div>
      <div class="station-service info-content">
        <fa :icon="['fas', 'restroom']" class="icon" />
        WC
      </div>
    </div>
  </div>
</template>

<script>
import axios from 'axios'
import DirectionIcon from './icons/DirectionStation.vue'
import NoFavoriteIcon from './icons/NoFavoriteIcon.vue'
import FavoriteIcon from './icons/FavoriteIcon.vue'

export default {
  props: {
    externalId: Number
  },
  data() {
    return {
      station: {},
      isFavorite: true
    }
  },
  components: {
    DirectionIcon,
    NoFavoriteIcon,
    FavoriteIcon
  },

  methods: {
    processResponse(data) {
      this.station = data[0]
    },
    toggleFavorite() {
      this.isFavorite = !this.isFavorite
    }
  },

  mounted() {
    axios
      .get('/api/station', {
        headers: {
          Authorization:
            'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6Im1hcmlvQHRlc3QuY29tIiwic3ViIjoiNjQ0MWI1MDBkNjA1NDAzN2E2ZDNiZjU5IiwiaWF0IjoxNjgyMjg0NzI5fQ.XYK9vFjD96Ry-dU94OyzeSILE6N64fRiTwX1jUh0yTI'
        },
        params: {
          externalId: this.externalId
        }
      })
      .then((response) => {
        this.processResponse(response.data)
      })
  }
}
</script>

<style scoped>
.border-top {
  width: 32px;
  min-height: 4px;
  background: #767680;
  opacity: 0.4;
  border-radius: 100px !important;
  margin-top: 16px;
  margin-bottom: 21px;
}
.station-details-container {
  width: 100%;
  overflow: auto;
}

.station-details-container::-webkit-scrollbar {
  display: none;
}
.container {
  display: flex;
  flex-direction: column;
  align-items: start;
  padding: 12px 16px;
  background: #ffffff;
  box-shadow: 0px 1px 4px rgba(186, 195, 255, 0.2);
  border-radius: 12px;
  margin-top: 16px;
}
.station-details-header {
  font-family: 'Inter';
  font-style: normal;
  font-weight: 600;
  font-size: 24px;
  display: flex;
  align-items: center;
  margin-bottom: 16px;
  width: 100%;
}
.station-title {
  display: flex;
  flex-direction: column;
  font-size: 24px;
  line-height: 1;
}
.station-details-info {
  margin-top: 8px;
}

.station-address {
  display: flex;
  align-items: center;
  width: 100%;
}
.direction-icon {
  margin-left: auto;
}

.info-label {
  font-family: 'Inter';
  font-style: normal;
  font-weight: 500;
  font-size: 11px;
  line-height: 16px;
  text-transform: uppercase;
  color: #767680;
}

.station-opening-hours {
  margin-top: 8px;
}

.info-content {
  margin-bottom: 5px;
  font-family: 'Inter';
  font-style: normal;
  font-weight: 400;
  font-size: 14px;
  line-height: 20px;
  letter-spacing: 0.1px;
  color: #171a2c;
}

.station-details-fuels {
  /* display: flex;
  flex-direction: column;
  align-items: center;
  padding: 12px 16px;
  background: #ffffff;
  box-shadow: 0px 1px 4px rgba(186, 195, 255, 0.2);
  border-radius: 12px;
  margin-top: 16px; */
}

.station-fuel {
  display: flex;
  flex-direction: row;
  width: 100%;
  margin-bottom: 8px;
}

.station-details-fuels .name {
  font-family: 'Inter';
  font-style: normal;
  font-weight: 400;
  font-size: 14px;
  line-height: 20px;
  letter-spacing: 0.1px;
  color: #171a2c;
}

.station-details-fuels .fuel-prices {
  margin-left: auto;
  display: flex;
  flex-direction: column;
  align-items: flex-end;
}

.station-details-fuels .price {
  font-family: 'Inter';
  font-style: normal;
  font-weight: 700;
  font-size: 16px;
  line-height: 22px;
  letter-spacing: 0.1px;
}
.station-details-fuels .diff-price {
  font-family: 'Inter';
  font-style: normal;
  font-weight: 400;
  font-size: 12px;
  line-height: 15px;
  color: #30ba1a;
}

.station-services{
  margin-bottom: 28px;
}
.station-service {
  margin-top: 8px;
}

.icon {
  width: 17px;
  height: 15px;
}

.star {
  margin-left: 8px;
  width: 24px;
  height: fit-content;
}

.favorite-icon-container {
  padding-top: 3px;
  color: #f1cc08;
  margin-right: 16px;
}
</style>
