/*
_  ______   _____ _____ _____ _   _
| |/ / ___| |_   _| ____/___ | | | |
| ' / |  _    | | |  _|| |   | |_| |
| . \ |_| |   | | | |__| |___|  _  |
|_|\_\____|   |_| |_____\____|_| |_|

ANYWAY, YOU MUST GIVE CREDIT TO MY CODE WHEN COPY IT
CONTACT ME HERE +237656520674
YT: KermHackTools
Github: Kgtech-cmr
*/

const { cmd } = require('../command');
const axios = require('axios');
const moment = require('moment');

// Variable to keep track of whether the daily fact feature is enabled
let isFactEnabled = false;
let factTimer; // To store the interval timer for daily facts

// Define the themes for each day of the week
const dailyThemes = {
    Monday: 'amour',        // Love
    Tuesday: 'motivation',  // Motivation
    Wednesday: 'science',   // Science
    Thursday: 'blague',     // Joke
    Friday: 'conseils',     // Tips
    Saturday: 'amour',      // Love
    Sunday: 'motivation',   // Motivation
};

cmd({
    pattern: "dailyfact",
    desc: "Get a random fact of the day and control the daily fact feature.",
    react: "📚",
    category: "fun",
    use: ".dailyfact on/off",
    filename: __filename
}, async (conn, mek, m, { reply, args }) => {
    // Check the first argument (on/off)
    if (args[0] === "on") {
        if (isFactEnabled) {
            return reply("❌ The daily fact feature is already enabled.");
        }
        
        isFactEnabled = true;
        reply("✅ The daily fact feature is now enabled. I will send a fact every day at 6 AM (Cameroon time).");

        // Set the daily fact interval at 6 AM (Cameroon time)
        sendDailyFactAt6AM(conn, reply);
    } 
    else if (args[0] === "off") {
        if (!isFactEnabled) {
            return reply("❌ The daily fact feature is already disabled.");
        }

        clearInterval(factTimer); // Clear the timer when the feature is disabled
        isFactEnabled = false;
        reply("❌ The daily fact feature is now disabled.");
    } 
    else {
        reply("❌ Please specify 'on' or 'off' to enable or disable the daily fact feature.\nExample: `.dailyfact on`");
    }
});

// Function to fetch and send the daily fact
async function sendDailyFact(conn, reply) {
    try {
        const dayOfWeek = moment().format('dddd'); // Get the current day of the week
        const theme = dailyThemes[dayOfWeek]; // Get the theme for the current day

        // Send a message saying we're fetching the daily fact
        reply(`Fetching a ${theme} fact for you...`);

        // API endpoint for random facts with the theme based on the current day
        const response = await axios.get(`https://uselessfacts.jsph.pl/random.json?language=fr`);

        // Extract the fact from the API response
        const fact = response.data.text;

        // Send the fact back to the user
        reply(`📚 Here's a ${theme} fact for you on ${dayOfWeek}:\n\n*${fact}\n\n> POWERED BY KERM*`);
        
    } catch (error) {
        console.error("Error fetching daily fact:", error.message);
        reply("❌ Sorry, I couldn't fetch a fact for today. Please try again later.");
    }
}

// Function to calculate the time until 6 AM and set the interval
function sendDailyFactAt6AM(conn, reply) {
    const now = moment();
    const targetTime = moment().set({ hour: 6, minute: 0, second: 0, millisecond: 0 }); // 6 AM Cameroon time

    if (now.isAfter(targetTime)) {
        // If it's already past 6 AM today, set the time for 6 AM tomorrow
        targetTime.add(1, 'days');
    }

    const timeUntilNextRun = targetTime.diff(now); // Time difference in milliseconds

    // Set an interval to send the daily fact at 6 AM every day
    factTimer = setInterval(() => {
        sendDailyFact(conn, reply); // Send the fact at 6 AM every day
    }, 86400000); // Repeat every 24 hours

    // Wait until the next 6 AM and send the first fact
    setTimeout(() => {
        sendDailyFact(conn, reply); // Send the first fact
    }, timeUntilNextRun);
}
cmd({
    pattern: "age",
    desc: "Calculate your age based on your date of birth.",
    react: "🎉",
    category: "utility",
    use: ".age <DD/MM/YYYY>",
    filename: __filename
}, async (conn, mek, m, { reply, args }) => {
    try {
        if (args.length === 0) {
            return reply("❌ Please provide your date of birth in the format DD/MM/YYYY.\nExample: `.age 15/08/1995`");
        }

        const birthDate = args[0]; // Get the date of birth from user input
        const dateOfBirth = moment(birthDate, "DD/MM/YYYY");

        // Validate the provided date
        if (!dateOfBirth.isValid()) {
            return reply("❌ Invalid date format. Please use DD/MM/YYYY.\nExample: `.age 15/08/1995`");
        }

        // Calculate the age by comparing the current date with the birthdate
        const age = moment().diff(dateOfBirth, 'years');
        
        // Send the calculated age back to the user
        reply(`🎉 Your age is: *${age}* years old.`);

    } catch (error) {
        console.error("Error calculating age:", error.message);
        reply("❌ An error occurred while calculating your age. Please try again later.");
    }
});
cmd({
    pattern: "tiny",
    desc: "Shorten a URL using TinyURL.",
    react: "🔗",
    category: "utility",
    use: ".tiny <URL>",
    filename: __filename
}, async (conn, mek, m, { reply, args }) => {
    try {
        // Check if the user provided a URL
        if (args.length === 0) {
            return reply("❌ Please provide a URL to shorten.\nExample: `.tiny https://example.com`");
        }

        // Get the URL from the user's message
        const url = args.join(" ");

        // Send a request to TinyURL's API to shorten the URL
        const response = await axios.get(`https://api.tinyurl.com/api-create.php?url=${url}`);

        // Check if the response is valid and contains a shortened URL
        if (response.data) {
            // Send the shortened URL back to the user
            reply(`🔗 Here is your shortened URL: ${response.data}`);
        } else {
            reply("❌ Something went wrong while shortening the URL. Please try again later.");
        }

    } catch (error) {
        console.error("Error shortening URL:", error.message);
        reply("❌ An error occurred while shortening the URL. Please try again later.");
    }
});
cmd({
    pattern: "define",
    desc: "Get the definition of a word.",
    react: "🔎",
    category: "utility",
    use: ".define <word>",
    filename: __filename
}, async (conn, mek, m, { args, reply }) => {
    try {
        // Vérifier si l'utilisateur a donné un mot à définir
        if (args.length === 0) {
            return reply("❌ Please provide a word to define.\nExample: `.define apple`");
        }

        const word = args.join(" ").toLowerCase();

        // Effectuer une requête à l'API pour obtenir la définition du mot
        const response = await axios.get(`https://api.dictionaryapi.dev/api/v2/entries/en/${word}`);

        // Extraire la définition de la réponse
        const meanings = response.data[0].meanings;
        const definition = meanings ? meanings[0].definitions[0].definition : "No definition found.";

        // Envoyer la définition au chat
        reply(`🔎 Definition of "${word}":\n\n*${definition}*`);

    } catch (error) {
        console.error("Error fetching definition:", error.message);
        reply("❌ Sorry, I couldn't fetch the definition. Please try again later.");
    }
});
cmd({
    pattern: "timezone",
    desc: "Get the current time in a specific timezone.",
    react: "🕰️",
    category: "utility",
    use: ".timezone <timezone>",
    filename: __filename
}, async (conn, mek, m, { args, reply }) => {
    try {
        if (args.length === 0) {
            return reply("❌ Please provide a timezone. Example: `.timezone Europe/Paris`");
        }

        // Get the timezone input from the user
        const timezone = args.join(" ");

        // API endpoint to get time data
        const response = await axios.get(`http://worldtimeapi.org/api/timezone/${timezone}`);

        // Extract time data
        const timeData = response.data;
        const currentTime = timeData.datetime;
        const timezoneName = timeData.timezone;

        // Format the time and send it back to the user
        reply(`🕰️ The current time in ${timezoneName} is: ${currentTime}`);
        
    } catch (error) {
        console.error("Error fetching time:", error.message);
        reply("❌ Sorry, I couldn't fetch the time for the specified timezone. Please ensure the timezone is valid.");
    }
});
