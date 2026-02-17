const fs = require('fs');
try {
    const data = fs.readFileSync('models.json', 'utf16le'); // Try utf16le first
    const models = JSON.parse(data).models;
    models.forEach(m => console.log(m.name));
} catch (e) {
    console.error("Error parsing utf16le:", e.message);
    try {
        const data = fs.readFileSync('models.json', 'utf8');
        const models = JSON.parse(data).models;
        models.forEach(m => console.log(m.name));
    } catch (e2) {
        console.error("Error parsing utf8:", e2.message);
    }
}
