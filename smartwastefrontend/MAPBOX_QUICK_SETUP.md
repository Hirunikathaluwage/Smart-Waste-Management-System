# Quick Mapbox Setup Guide

## 🚀 **Get Your Mapbox API Key (Free)**

1. **Visit**: https://account.mapbox.com/access-tokens/
2. **Sign up** for a free account (if you don't have one)
3. **Create a token** or use the default public token
4. **Copy the token** (starts with `pk.`)

## 🔧 **Configure Your Token**

### Option 1: Direct Configuration (Quick)
1. Open `smartwastefrontend/src/config/mapbox.js`
2. Replace the demo token with your actual token:
   ```javascript
   accessToken: 'pk.your_actual_token_here',
   ```

### Option 2: Environment Variable (Recommended)
1. Create a `.env.local` file in the `smartwastefrontend` folder
2. Add your token:
   ```
   VITE_MAPBOX_TOKEN=pk.your_actual_token_here
   ```
3. Restart your development server

## ✅ **Test Your Setup**

1. Save your changes
2. Refresh your browser
3. Navigate to the pickup request form
4. You should see the map loading properly

## 🆓 **Free Tier Limits**

- **50,000 map loads** per month
- **100,000 geocoding requests** per month
- Perfect for development and small projects

## 🛠️ **Troubleshooting**

If the map still doesn't show:
1. Check browser console for errors
2. Verify your token is correct
3. Make sure you've restarted the dev server
4. Check if your domain is allowed in Mapbox settings

## 🔒 **Security Note**

- Never commit your actual token to version control
- Use environment variables for production
- Add your domain to allowed origins in Mapbox settings
