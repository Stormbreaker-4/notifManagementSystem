const Preference = require('../models/Preference');

async function getPreferences(req, res) {
    try {
        const preferences = await Preference.find({ userId: req.params.userId })
        .populate('categoryId', 'name');        
        res.json(preferences);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
}

async function updatePreferences(req, res) {
    try {
        const { categoryId, optedIn } = req.body;
        const upated_prefs = await Preference.findOneAndUpdate(
            { userId: req.params.userId, categoryId },
            { optedIn, updatedOn: new Date() },
            { new: true, upsert: true }
        );
        res.json(upated_prefs);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

module.exports = { updatePreferences, getPreferences };
