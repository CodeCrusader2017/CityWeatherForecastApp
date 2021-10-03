import { performAction } from './js/app'
import { getGeoCoordinatesAPI } from './js/app'
import { getWeatherbit } from './js/app'
import { postCurrentWeatherData } from './js/app'
import { updateCurrentWeatherUI } from './js/app'
import { postForecastWeatherData } from './js/app'
import { updateForecastWeatherUI } from './js/app'
import { checkUserInput } from './js/checkUserInput'

import './styles/Index.scss'
import './styles/Index_anchor_styling.scss'
import './styles/Index_layout_styling.scss'

export {
    performAction,
    getGeoCoordinatesAPI,
    getWeatherbit,
    postCurrentWeatherData,
    updateCurrentWeatherUI,
    postForecastWeatherData,
    updateForecastWeatherUI,
    checkUserInput
}

try {
    console.log(app)  
 } catch (error) {
     console.log("Error displaying app via console.log - no impact to application functional flow. The error was: ", error);
}
