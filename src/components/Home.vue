<template>
  <div>
    <h1 class="title">ISO8601.info</h1>
    <a class="githubLogo" href="https://github.com/ponycode/iso8601.info" title="View the source code for this project on GitHub">
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
        <defs/>
        <path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12"/>
      </svg>
    </a>
    <b-container fluid>
      <b-row class="mb-5">
        <b-col>
          <div v-if="clientTimezone">
            Your time zone is {{clientTimezone}}
            <h1 class="currentTime mt-3"><ISO8601Timestamp :timestamp="currentTime" :timezone="clientTimezone" :showCopyIcon="false"/></h1>
          </div>
          <h1 v-else class="currentTime mt-3"><ISO8601Timestamp :timestamp="currentTime" :showCopyIcon="false"/></h1>
          <hr class="mt-5 mb-5"/>
        </b-col>
      </b-row>
      <b-row>
        <b-col md="8" lg="8" offset-md="2" offset-lg="2">

          <b-row>
            <b-col>
              <b-form-input v-model="userProvidedDate" placeholder="Paste an ISO8601 date" size="lg"></b-form-input>
            </b-col>
            <b-col>
              <h3 class="mt-2"><ISO8601Timestamp :timestamp="userProvidedDate" :showCopyIcon="false"/></h3><br/>
              <small v-if="userProvidedDateEpoch">{{userProvidedDateEpoch}}</small>
            </b-col>
          </b-row>

          <b-row v-if="userProvidedDateInTimeZones">
            <b-col>
              <table v-if="userProvidedDateInTimeZones" class="table mt-3 convertedTimes">
                <tr>
                  <th><b-form-select v-model="selectedTimezoneGroup" :options="timezoneGroups"></b-form-select></th>
                  <th>Local Time</th>
                  <th>DST active</th>
                  <th>Offset ISO8601</th>
                </tr>
                <tr v-for="timezone in userProvidedDateInTimeZones" :key="timezone.name">
                  <th class="timezone"><b-icon v-if="clientTimezone === timezone.name" icon="flag-fill" />{{timezone.name}} <cite>{{timezone.offset}}</cite></th>
                  <td>{{timezone.localReadableTime}}</td>
                  <td>{{timezone.isDSTActive ? 'Yes' : 'No'}}</td>
                  <td><ISO8601Timestamp :timestamp="userProvidedDate" :timezone="timezone.name"/></td>
                </tr>
              </table>
            </b-col>
          </b-row>

        </b-col>
      </b-row>
    </b-container>
  </div>
</template>

<script>
import moment from 'moment-timezone'
import ISO8601Timestamp from './ISO8601Timestamp'
import countries from 'i18n-iso-countries'

export default {
  name: 'Home',
  components: {
    ISO8601Timestamp
  },
  data(){
    return {
      selectedTimezoneGroup: 'US-simple',
      clientTimezone: moment.tz.guess(),
      currentTime: null,
      userProvidedDate: null,
      userProvidedDateInTimeZones: null,
      moment
    }
  },
  computed: {
    userProvidedDateEpoch(){
      if (!this.userProvidedDate) return undefined
      return Math.floor(userProvidedDate.getTime() / 1000)
    },
    timezoneGroups(){
      const momentCountries = moment.tz.countries().map( countryCode => {
        return {
          value: countryCode,
          text: countries.getName( countryCode, 'en' )
        }
      })

      const groups = [{ value: 'US-simple', text: 'United States of America (Simple)' }, ...momentCountries]
      groups.sort( (a, b) => {
        const countryA = a.text.toUpperCase()
        const countryB = b.text.toUpperCase()
        if( countryA > countryB ) return 1
        if( countryA < countryB ) return -1
        return 0
      })
      return groups
    },
    timeszonesInGroup(){
      if( !this.selectedTimezoneGroup ) return null

      if( this.selectedTimezoneGroup === 'US-simple' ){
        return ['Etc/UTC', 'America/New_York', 'America/Chicago', 'America/Denver', 'America/Phoenix', 'America/Los_Angeles'];
      }else{
        return ['Etc/UTC', ...moment.tz.zonesForCountry( this.selectedTimezoneGroup )]
      }
    }
  },
  watch: {
    userProvidedDate(){
      this.udpateTable()
    },
    selectedTimezoneGroup(){
      this.udpateTable()
    }
  },
  methods: {
    udpateTable(){
      const m = moment( this.userProvidedDate );

      if( !m.isValid() ){
        this.userProvidedDateInTimeZones = null
        return
      }

      const convertedTimes = {};
      for( let timezone of this.timeszonesInGroup ){
        const mInTimezone = m.tz(timezone);

        convertedTimes[timezone] = {
          name: timezone,
          offset: mInTimezone.format('Z'),
          localIso8601Time: mInTimezone.format(),
          utcIso8601Time: mInTimezone.toISOString(),
          localReadableTime: mInTimezone.format('lll') + ' ' + mInTimezone.zoneAbbr(),
          abbreviation: mInTimezone.zoneAbbr(),
          isDSTActive: mInTimezone.isDST()
        };
      }

      this.userProvidedDateInTimeZones = convertedTimes
    }
  },
  mounted(){
    this.currentTime = new Date().toISOString()
    this.userProvidedDate = new Date().toISOString()
    setInterval( () => {
      this.currentTime = new Date().toISOString()
    }, 1000 )
  },
}
</script>

<style lang="scss" scoped>
.currentTime {
  font-size: 3rem;
}

.timezone {
  text-align: right;

  cite {
    color: #666;
    font-weight: 100;
  }
}

.title{
  position: absolute;
  top: 10px;
  left: 10px;
  font-weight: 100;
}

.githubLogo {
  position: absolute;
  top: 10px;
  right: 10px;

  display: inline-block;
  height: 40px;
  width: 40px;
}

// @media (prefers-color-scheme: dark) {
//   .convertedTimes {
//     color: rgba(237, 237, 237, 1.0);
//   }
// }

</style>
