# Mapbox Integration Setup

This project now includes Mapbox integration for location selection in the pickup request form. Users can click on a map to select their pickup location instead of manually entering addresses.

## Setup Instructions

### 1. Get a Mapbox Access Token

1. Go to [Mapbox Account](https://account.mapbox.com/access-tokens/)
2. Sign up for a free account if you don't have one
3. Create a new access token
4. Copy the token

### 2. Configure the Token

1. Open `smartwastefrontend/src/config/mapbox.js`
2. Replace the demo token with your own token:
   ```javascript
   export const MAPBOX_CONFIG = {
     accessToken: 'YOUR_MAPBOX_TOKEN_HERE',
     style: 'mapbox://styles/mapbox/streets-v11'
   };
   ```

### 3. Security Considerations

- Add your domain to the token's allowed origins in your Mapbox account
- For production, consider using environment variables instead of hardcoding the token
- The free tier includes 50,000 map loads per month

## Features

### MapLocationPicker Component

- **Interactive Map**: Users can click anywhere on the map to select a location
- **Current Location**: "Use Current Location" button for GPS-based selection
- **Reverse Geocoding**: Automatically converts coordinates to readable addresses
- **Visual Feedback**: Shows selected location with a marker and popup
- **Responsive Design**: Works on desktop and mobile devices

### Integration with PickupRequestForm

- **Seamless Integration**: Replaces manual address input with map selection
- **Form Validation**: Ensures a location is selected before form submission
- **Data Consistency**: Automatically populates address, city, and postal code fields
- **Fallback Support**: Graceful handling of geocoding failures

## Usage

1. Navigate to the pickup request form
2. Scroll to the "Location Details" section
3. Click anywhere on the map to select your pickup location
4. The address will be automatically populated
5. Optionally add additional pickup location description
6. Continue with the rest of the form

## Technical Details

- **Library**: Mapbox GL JS (direct integration, no React wrapper)
- **Geocoding**: Mapbox Geocoding API for reverse geocoding
- **Styling**: Mapbox Streets style (customizable)
- **Default Location**: Colombo, Sri Lanka (configurable)
- **Compatibility**: Works with Vite and modern React builds

## Troubleshooting

### Common Issues

1. **Map not loading**: Check if your Mapbox token is valid and has proper permissions
2. **Geocoding failing**: Ensure your token has geocoding API access
3. **CORS errors**: Add your domain to the token's allowed origins
4. **Location not found**: The reverse geocoding might not find an address for the selected coordinates
5. **Vite import errors**: This implementation uses Mapbox GL JS directly to avoid compatibility issues with Vite

### Fallback Behavior

If reverse geocoding fails, the system will:
- Still save the coordinates
- Display coordinates as the address
- Allow the user to manually edit the address if needed

## Future Enhancements

- **Search functionality**: Add a search box to find specific addresses
- **Multiple map styles**: Allow users to choose different map styles
- **Offline support**: Cache map tiles for offline usage
- **Custom markers**: Add custom markers for different pickup types
- **Route optimization**: Show optimal routes for pickup workers
