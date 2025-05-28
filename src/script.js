// script.js

document.addEventListener('DOMContentLoaded', function() {
    const countrySelect = document.getElementById('country');
    const citySelect = document.getElementById('city');

    // Liste simplifiée de pays et de villes
    const cities = {
        Afghanistan: ["Kabul", "Kandahar", "Herat", "Mazar-i-Sharif"],
        Albania: ["Tirana", "Durrës", "Vlorë", "Shkodër"],
        Algeria: ["Algiers", "Oran", "Constantine", "Annaba"],
        Argentina: ["Buenos Aires", "Cordoba", "Rosario", "Mendoza"],
        Australia: ["Sydney", "Melbourne", "Brisbane", "Perth"],
        Brazil: ["São Paulo", "Rio de Janeiro", "Brasília", "Salvador"],
        Canada: ["Toronto", "Vancouver", "Montreal", "Ottawa"],
        China: ["Beijing", "Shanghai", "Shenzhen", "Guangzhou"],
        France: ["Paris", "Marseille", "Lyon", "Toulouse"],
        Germany: ["Berlin", "Munich", "Hamburg", "Frankfurt"],
        India: ["New Delhi", "Mumbai", "Bangalore", "Chennai"],
        Indonesia: ["Jakarta", "Surabaya", "Bandung", "Medan"],
        Italy: ["Rome", "Milan", "Naples", "Turin"],
        Japan: ["Tokyo", "Osaka", "Kyoto", "Hokkaido"],
        Mexico: ["Mexico City", "Guadalajara", "Monterrey", "Cancún"],
        Nigeria: ["Lagos", "Abuja", "Kano", "Port Harcourt"],
        Pakistan: ["Karachi", "Lahore", "Islamabad", "Rawalpindi"],
        Russia: ["Moscow", "Saint Petersburg", "Novosibirsk", "Yekaterinburg"],
        SouthAfrica: ["Cape Town", "Johannesburg", "Durban", "Pretoria"],
        UnitedKingdom: ["London", "Manchester", "Birmingham", "Glasgow"],
        UnitedStates: ["New York", "Los Angeles", "Chicago", "Houston"]
    };

    // Fonction pour mettre à jour les villes en fonction du pays sélectionné
    function updateCities() {
        // Réinitialiser la liste des villes
        citySelect.innerHTML = '<option value="" disabled selected>Select your city</option>';

        const selectedCountry = countrySelect.value;
        if (selectedCountry && cities[selectedCountry]) {
            cities[selectedCountry].forEach(function(city) {
                const option = document.createElement('option');
                option.value = city;
                option.textContent = city;
                citySelect.appendChild(option);
            });
        }
    }

    // Ajouter un événement pour surveiller les changements dans le pays sélectionné
    countrySelect.addEventListener('change', updateCities);
});
