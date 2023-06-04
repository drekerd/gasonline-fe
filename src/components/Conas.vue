<template>
  <div class="favorite-fuel-filter">{{ this.$route.query.fuel }}</div>
  <div class="favorites-container">
    <div :class="['cheapest', 'favorite', 'fav-box']">
      <div class="name">{{ cheapest.name }}</div>
      <div class="price">{{ cheapest.price }}€</div>
      <div class="diff-price">-0.002€</div>
    </div>
    <div v-if="favorites.length > 1" class="favorites">
      <div
        class="favorite fav-box"
        v-for="favorite in favorites.slice(1)"
        :key="favorite.externalId"
      >
        <div class="name">{{ favorite.name }}</div>
        <div class="price">{{ favorite.price }}€</div>
      </div>
    </div>
  </div>
  <div class="find-near-station">
    <div class="near-station-text">
      <div class="low">Tank running low?</div>
      <div class="near-station">Find the nearest station</div>
    </div>
    <img class="near-station icon" src="@/assets/location.svg" />
  </div>

  <div v-if="favoritesAllFuels.length === 0" class="empty-favorites">
    <NoFavCarIcon class="empty-favorites-icon" />
    <div class="empty-favorites-message-title">This looks empty</div>
    <div class="empty-favorites-message-text">{{ getEmptyFavoritesMessage() }}</div>
    <div>
      <q-btn label="Search fuel stations" type="submit" />
    </div>
    <div class="empty-favorites-info-label label">
      {{ getEmptyFavoritesLabelMessage() }}
    </div>
  </div>
  <div
    v-for="favorite in favoritesAllFuels"
    :key="favorite.externalId"
    class="favorite-all-fuels"
    @click="openDetails(favorite.externalId)"
  >
    <div class="favorite-fuels-header">
      <FuelIcon class="fuel-icon" />
      <div class="stations-name">{{ favorite.brand }} {{ favorite.parish }}</div>
      <ArrowRightIcon class="arrow-icon" />
    </div>
    <div v-for="fuel in favorite.fuels" :key="fuel.externalId" class="station-fuel-details">
      <div class="name">{{ fuel.name }}</div>
      <div class="fuel-prices">
        <div class="price">{{ fuel.price }}€</div>
        <div class="diff-price">-0.002€</div>
      </div>
    </div>
    <span class="compared-update-info"> Compared to previous update </span>
  </div>
  <q-dialog v-model="dialog" :position="this.position">
    <q-card>
      <StationDetailsComponent :externalId="this.externalId" @close-details="closeDetails()" />
    </q-card>
  </q-dialog>
</template>

<script>
import axios from 'axios'
import StationDetailsComponent from './StationDetailsComponent.vue'
import FuelIcon from './icons/FuelIcon.vue'
import ArrowRightIcon from './icons/ArrowRight.vue'
import NoFavCarIcon from './icons/NoFavoritesCarIcon.vue'

export default {
  data() {
    return {
      cheapest: {},
      favorites: [],
      favoritesAllFuels: [],
      dialog: false,
      position: '',
      externalId: 0,
      message:
        'Search for stations and add them as favorites. We will keep you updated of price changes for your favorite stations'
    }
  },
  components: {
    StationDetailsComponent,
    FuelIcon,
    ArrowRightIcon,
    NoFavCarIcon
  },

  methods: {
    getEmptyFavoritesMessage() {
      return (
        'Search for stations and add them as favorites. \n' +
        'We will keep you updated of price changes for your favorite stations'
      )
    },
    getEmptyFavoritesLabelMessage() {
      return (
        "Since you don't have favorite stations yet, we're showing you \n" +
        'the cheapest stations for this fuel'
      )
    },
    async processResponse(data) {
      const { favorites } = data

      this.cheapest = {
        name: favorites[0].brand + '-' + favorites[0].parish,
        price: favorites[0].fuels[0].price
      }
      console.log('favorites', favorites)

      for (const favorite of favorites) {
        this.favorites.push({
          name: favorite.brand + '-' + favorite.parish,
          price: favorite.fuels[0].price
        })
      }
      const fullDataOfFavoriteStations = await this.fetchFullDataOfFavoriteStations(favorites)
      console.log('fullDataOfFavoriteStations', fullDataOfFavoriteStations)
      this.favoritesAllFuels = fullDataOfFavoriteStations
      // this.favoritesAllFuels = []
    },
    async fetchFullDataOfFavoriteStations(favoriteStations) {
      const ids = favoriteStations.map(({ externalId }) => externalId)
      const response = await axios.get(`/api/station?externalId=${ids}`)
      return response.data
    },
    openDetails(externalId) {
      this.dialog = true
      this.position = 'bottom'
      this.externalId = externalId

      // this.$router.push({
      //   name: 'station',
      //   query: { externalId: station.externalId }
      // })
    },
    closeDetails() {
      this.dialog = false
    }
  },
  async mounted() {
    await axios
      .get('/api/users/favorites?filterBy=typeOfFuel&filterValue=Gasolina simples 95', {
        headers: {
          Authorization:
            'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6Im1hcmlvQHRlc3QuY29tIiwic3ViIjoiNjQ0MWI1MDBkNjA1NDAzN2E2ZDNiZjU5IiwiaWF0IjoxNjgyMjg0NzI5fQ.XYK9vFjD96Ry-dU94OyzeSILE6N64fRiTwX1jUh0yTI'
        }
      })
      .then((response) => {
        this.processResponse(response.data)
      })
  }
}
</script>

<style scoped>
.q-card {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 0 16px;
  border-radius: 28px 28px 0px 0px;
  background: linear-gradient(0deg, rgba(58, 83, 201, 0.05), rgba(58, 83, 201, 0.05)), #fefbff;
  overflow-y: auto;
}

.q-card::-webkit-scrollbar {
  display: none;
}

.q-card > div:not(:last-child),
.q-card > img:not(:last-child) {
  border-bottom-left-radius: unset;
  border-bottom-right-radius: unset;
}
.q-card > div:first-child,
.q-card > img:first-child {
  border-top: unset;
  border-top-left-radius: unset;
  border-top-right-radius: unset;
}
.favorites-container {
  margin-top: 16px;
  display: flex;
  gap: 16px;
  width: 100%;
}
.favorites {
  padding: 12px 16px;
  background-color: #ffffff;
  border-radius: 12px;
  width: 50%;
  display: flex;
  flex-direction: column;
  gap: 12px;
}
.cheapest {
  padding: 12px 16px;
  background: rgba(165, 239, 139, 0.47);
  width: 50%;
  flex-grow: 1;
}

.cheapest .name {
  font-weight: 400;
  font-size: 16px;
}
.diff-price {
  font-weight: 500;
  font-size: 16px;
  color: #52b031;
}

.cheapest .price {
  font-weight: 700;
  font-size: 32px;
}
.fav-box {
  font: Montserrat;
  font-weight: 400;
  border-radius: 12px;
  /* max-width: 156px; */
}
.favorite-fuel-filter {
  font-family: 'Inter';
  font-weight: 600;
  font-size: 26px;
}

.favorites .name {
  font-family: 'Inter';
  font-style: normal;
  font-weight: 500;
  font-size: 14px;
  line-height: 20px;
  letter-spacing: 0.25px;

  color: #1b1b1f;
}

.favorites .price {
  font-family: 'Inter';
  font-weight: 700;
  font-size: 16px;
  color: #1b1b1f;
}

.find-near-station {
  margin-top: 16px;
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  padding: 12px 16px;

  /* width: 328px;
height: 68px; */

  background: linear-gradient(90deg, #001159 0%, #1c38b0 100%);
  border-radius: 12px;
}

.find-near-station div {
  font-family: 'Inter';
  font-style: normal;
  font-weight: 500;
  font-size: 14px;

  color: #ffffff;
}

.find-near-station .near-station {
  font-weight: 700;
  font-size: 16px;
}

.favorite-all-fuels {
  display: flex;
  flex-direction: column;
  padding: 12px 16px;
  background: #ffffff;
  box-shadow: 0px 1px 4px rgba(186, 195, 255, 0.2);
  border-radius: 12px;
  margin-top: 16px;
}

.favorite-fuels-header {
  display: flex;
  align-items: center;
  margin-bottom: 16px;
}

.fuel-icon {
  margin-right: 10px;
}

.stations-name {
  margin-right: auto;
  font-family: 'Inter';
  font-style: normal;
  font-weight: 600;
  font-size: 18px;
  line-height: 24px;
}
.station-fuel-details {
  display: flex;
  flex-direction: row;
  width: 100%;
  margin-bottom: 8px;
}

.favorite-all-fuels .name {
  font-family: 'Inter';
  font-style: normal;
  font-weight: 400;
  font-size: 14px;
  line-height: 20px;
  letter-spacing: 0.1px;
  color: #171a2c;
}

.favorite-all-fuels .fuel-prices {
  margin-left: auto;
  display: flex;
  flex-direction: column;
  align-items: flex-end;
}

.favorite-all-fuels .price {
  font-family: 'Inter';
  font-style: normal;
  font-weight: 700;
  font-size: 16px;
  line-height: 22px;
  letter-spacing: 0.1px;
}
.favorite-all-fuels .diff-price {
  font-family: 'Inter';
  font-style: normal;
  font-weight: 400;
  font-size: 12px;
  line-height: 15px;
  color: #30ba1a;
}

.compared-update-info {
  font-family: 'Inter';
  font-style: normal;
  font-weight: 500;
  font-size: 11px;
  line-height: 16px;
  letter-spacing: 0.5px;
  color: #5a5d72;
  opacity: 0.5;
  margin-right: auto;
}

.empty-favorites {
  margin-top: 24px;
}

.empty-favorites-icon{
  width: 100%;
}

.empty-favorites-message-title {
  font-family: 'Inter';
  font-style: normal;
  font-weight: 600;
  font-size: 18px;
  line-height: 24px;
  color: #171a2c;
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

  margin-top: 16px;
}

.empty-favorites-info-label {
  font-family: 'Inter';
  font-style: normal;
  font-weight: 500;
  font-size: 11px;
  line-height: 16px;
  letter-spacing: 0.5px;
  color: #5a5d72;
  opacity: 0.5;
  margin-top: 24px;
}
</style>
