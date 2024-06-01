// Import Firebase SDK
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.6.1/firebase-app.js";
import { getFirestore, collection, getDocs } from "https://www.gstatic.com/firebasejs/9.6.1/firebase-firestore.js";

// Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyBGEPi4gydD8Y6Y3krPr8d-KwtXl8PZeLU",
    authDomain: "between-b2bbe.firebaseapp.com",
    projectId: "between-b2bbe",
    storageBucket: "between-b2bbe.appspot.com",
    messagingSenderId: "249018301100",
    appId: "1:249018301100:web:979f5a6c5c8fa553343d09"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// Google Maps initialization function
window.initMap = async function() {
    const mapElement = document.getElementById("map");
    const mapOptions = {
        center: { lat: 51.5961164, lng: -0.1718572 }, // Tokyo coordinates
        zoom: 17, // Zoom level
        mapTypeControl: false, // マップタイプ切り替えコントロールを非表示にする
        zoomControl: false,
        fullscreenControl: false,
        streetViewControl: false
    };
    const map = new google.maps.Map(mapElement, mapOptions);

    // Fetch markers from Firebase
    try {
        const querySnapshot = await getDocs(collection(db, "between-data"));
        querySnapshot.forEach((doc) => {
            const data = doc.data();
            if (data.map && typeof data.map.latitude === 'number' && typeof data.map.longitude === 'number') {
                const latitude = data.map.latitude;
                const longitude = data.map.longitude;

                // Determine the marker icon based on the category
                let iconUrl;
                switch (data.category) {
                    case "1":
                        iconUrl = "assets/orange_plug_small.png";
                        break;
                    case "2":
                        iconUrl = "assets/red_plug_small.png";
                        break;
                    case "3":
                        iconUrl = "assets/green_plug_small.png";
                        break;
                    case "4":
                        iconUrl = "assets/blue_plug_small.png";
                        break;
                    default:
                        iconUrl = "assets/emptyplug_devos.png"; // Default icon if category doesn't match
                        break;
                }
                
                const marker = new google.maps.Marker({
                    position: { lat: latitude, lng: longitude },
                    map: map,
                    title: "Your custom marker title",
                    icon: {
                        url: iconUrl, // Path to your custom pin image
                        scaledSize: new google.maps.Size(50, 50) // Set the size of the marker (width, height)
                    }
                    
                });
            } else {
                // Log a message for missing or invalid coordinates, but do not throw an error
                console.log(`Skipping document ID: ${doc.id} due to missing or invalid coordinates.`);
            }
        });
    } catch (error) {
        console.error("Error fetching documents: ", error);
    }
}

function loadGoogleMapsScript() {
    if (!window.google || !window.google.maps) {
        const script = document.createElement('script');
        script.src = `https://maps.googleapis.com/maps/api/js?key=AIzaSyCH5pbBSSlcXO2iB_5Lm7iS0D1WoSlPcFo&callback=initMap`;
        script.async = true;
        script.defer = true;
        script.onerror = function() {
            console.error("Error loading Google Maps script.");
        };
        document.head.appendChild(script);
    } else {
        // Google Maps API script is already loaded
        if (typeof window.initMap === 'function') {
            window.initMap();
        }
    }
}


document.addEventListener('DOMContentLoaded', loadGoogleMapsScript);
