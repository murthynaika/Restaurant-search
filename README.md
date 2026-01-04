# Food Explorer - Restaurant Website

## Project Structure

```
WebSite/
├── index.html              # Main HTML file
├── css/
│   └── style.css          # All styling
├── js/
│   └── app.js             # Application logic
├── data/
│   ├── restaurants.json   # Restaurant data
│   └── menus.json         # Menu items data
├── images/                # Local images (if any)
└── nature.avif           # Background image
```

## Features

- **Restaurant Listing**: Browse all restaurants with ratings and specialities
- **Search Functionality**: Search by name, rating, organic, or home-made
- **Order Online**: View menu with images, prices, and ratings
- **Dine Out**: Restaurant info, gallery, call & directions buttons
- **Responsive Design**: Works on all devices
- **Smooth Animations**: Professional transitions and hover effects

## Architecture

### Separation of Concerns
- **HTML** (index.html): Structure and layout
- **CSS** (css/style.css): All styling and animations
- **JavaScript** (js/app.js): Business logic and interactions
- **JSON** (data/): Data layer for restaurants and menus

### Data Flow
1. App loads → Fetches JSON data
2. Renders restaurant cards
3. User clicks → Shows menu with tabs
4. Tabs switch between Order Online and Dine Out views

## How to Run

1. Open `index.html` in a browser
2. Or use a local server:
   ```
   npx http-server -p 8000
   ```
   Then visit: http://localhost:8000

## Technologies Used

- HTML5
- CSS3 (Grid, Flexbox, Animations)
- Vanilla JavaScript (ES6+)
- JSON for data storage
- Google Fonts (Poppins, Playfair Display, Cormorant Garamond)
- Unsplash for food images
