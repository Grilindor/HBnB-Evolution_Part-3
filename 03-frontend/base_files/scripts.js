document.addEventListener('DOMContentLoaded', () => {
    // Récupère les éléments du formulaire de connexion et du formulaire d'avis, ainsi que l'ID du lieu depuis l'URL et le token JWT depuis les cookies
    const loginForm = document.getElementById('login-form');
    const reviewForm = document.getElementById('review-form');
    const placeId = getPlaceIdFromURL();
    const token = getCookie('token');

    // Si le formulaire de connexion existe, ajoute un écouteur d'événement pour gérer la soumission du formulaire
    if (loginForm) {
        loginForm.addEventListener('submit', async (event) => {
            event.preventDefault(); // Empêche le comportement par défaut du formulaire
            const email = document.getElementById('email').value;
            const password = document.getElementById('password').value;

            // Envoie une requête POST pour se connecter
            const response = await fetch('http://127.0.0.1:5000/login', {  // Remplacez par l'URL réelle de votre API
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ email, password })
            });

            // Si la connexion réussit, stocke le token JWT dans les cookies et redirige vers la page d'accueil
            if (response.ok) {
                const data = await response.json();
                document.cookie = `token=${data.access_token}; path=/`;
                window.location.href = 'index.html';
            } else {
                document.getElementById('error-message').innerText = 'Login failed: An error has occured';
            }
        });
    }

    // Fonction pour vérifier l'authentification de l'utilisateur
    function checkAuthentication() {
        const token = getCookie('token');
        console.log('Token récupéré:', token);  // Vérifie que le token est bien récupéré
        const loginLink = document.getElementById('login-link');
        if (token) {
            loginLink.style.display = 'none';  // Masque le lien de connexion si l'utilisateur est authentifié
        }
    }

    checkAuthentication();  // Appelle la fonction pour vérifier l'authentification

    // Partie pour gérer l'affichage de tous les lieux
    if (document.getElementById('places-list')) {
        let places = []

        // Fonction pour récupérer la liste des lieux depuis l'API
        async function fetchPlaces(token) {
            const response = await fetch('http://127.0.0.1:5000/places', {  // Remplacez par l'URL réelle de votre API
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            // Si la requête réussit, stocke les lieux et les affiche
            if (response.ok) {
                places = await response.json();
                displayPlaces(places);
            }
        }

        fetchPlaces();  // Appelle la fonction pour récupérer les lieux

        // Fonction pour afficher les lieux sur la page
        function displayPlaces(places) {
            const placesList = document.getElementById('places-list');
            placesList.innerHTML = '';

            places.forEach(place => {
                console.log(place.image_place);  // Ajout du log pour vérifier les chemins d'image
                const placeCard = document.createElement('div');
                placeCard.className = 'place-card';
                placeCard.innerHTML = `
                <h2>${place.description}</h2>
                <img src="${place.image_place}" class="place-image">
                <p>Price per night: $ ${place.price_per_night}</p>
                <p>Location: ${place.city_name}, ${place.country_name}</p>
                <button id="details-button" data-place-id="${place.id}" class="detail-botton">View details</button>
                `;
                placesList.appendChild(placeCard);
            });
            goToPlaceDetails();  // Ajoute des écouteurs d'événements sur les boutons de détail
        }

        // Fonction pour ajouter des écouteurs d'événements sur les boutons de détail
        function goToPlaceDetails () {
            const buttons = document.querySelectorAll('#details-button');
            buttons.forEach(button => {
                button.addEventListener('click', () => {
                    const targetId = button.getAttribute('data-place-id');
                    window.location.href = `place.html#${targetId}`;
                });
            });
        }

        // Fonction pour filtrer les lieux par pays
        function filterPlacesByCountry(country) {
            if (country === "all") {
                displayPlaces(places);  // Affiche tous les lieux si "all" est sélectionné
            } else {
                const filteredPlaces = places.filter(place => place.country_name === country);
                displayPlaces(filteredPlaces);  // Affiche uniquement les lieux du pays sélectionné
            }
        }

        // Ajoute un écouteur d'événement pour filtrer les lieux lorsque le filtre de pays change
        document.getElementById('country-filter').addEventListener('change', (event) => {
            filterPlacesByCountry(event.target.value);
        });
    }

    // Partie pour gérer les détails d'un lieu spécifique
    if (document.getElementById('place-details')) {
        if (!token) {
            document.getElementById('add-review').style.display = 'none';  // Masque la section d'ajout d'avis si l'utilisateur n'est pas authentifié
        } else {
            fetchPlaceDetails(token, placeId);  // Récupère les détails du lieu si l'utilisateur est authentifié
        }
    }

    // Fonction pour récupérer les détails d'un lieu spécifique depuis l'API
    async function fetchPlaceDetails(token, placeId) {
        const response = await fetch(`http://127.0.0.1:5000/places/${placeId}`, {  // Remplacez par l'URL réelle de votre API
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });

        // Si la requête réussit, affiche les détails du lieu
        if (response.ok) {
            const place = await response.json();
            displayPlaceDetails(place);
        }
    }

    // Fonction pour afficher les détails d'un lieu sur la page
    function displayPlaceDetails(place) {
        const placeDetails = document.getElementById('place-details');
        placeDetails.innerHTML = `
            <img src="${place.image}" alt="${place.name}" class="place-image-large">
            <h2>${place.name}</h2>
            <p>${place.location}</p>
            <p>${place.price_per_night} per night</p>
            <p>${place.description}</p>
        `;
    }

    // Fonction pour obtenir la valeur d'un cookie par son nom
    function getCookie(name) {
        const value = `; ${document.cookie}`;
        const parts = value.split(`; ${name}=`);
        if (parts.length === 2) return parts.pop().split(';').shift();
    }

    // Fonction pour obtenir l'ID du lieu depuis l'URL
    function getPlaceIdFromURL() {
        const params = new URLSearchParams(window.location.search);
        return params.get('id');
    }
});
