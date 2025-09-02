const Preference = require('../models/Preference');
const Category = require('../models/Category');

function norm(s = '') {
    return String(s).toLowerCase().replace(/[^a-z0-9]+/g, '_');
}

function defaultOptInByName(catName) {
    const n = norm(catName);
    if (n === 'fest' || n === 'recruitment') return true;
    return false;
}

async function getPreferences(req, res) {
    try {
        const userId = req.params.userId;
        const categories = await Category.find().lean();
        const existing = await Preference.find({ userId }).lean();
        const byCat = new Map(existing.map(p => [String(p.categoryId), p]));

        const toCreate = [];
        for (const cat of categories) {
            const catId = String(cat._id);
            if (!byCat.has(catId)) {
                toCreate.push({
                    userId,
                    categoryId: cat._id,
                    optedIn: defaultOptInByName(cat.name)
                });
            }
        }
        if (toCreate.length) {
            const created = await Preference.insertMany(toCreate, { ordered: false });
            for (const doc of created) {
                byCat.set(String(doc.categoryId), doc);
            }
        }

        const result = categories.map(cat => {
            const pref = byCat.get(String(cat._id));
            return {
                _id: pref?._id,
                userId,
                optedIn: pref ? pref.optedIn : defaultOptInByName(cat.name),
                categoryId: {
                    _id: cat._id,
                    name: cat.name,
                    description: cat.description
                },
                updatedOn: pref?.updatedOn
            };
        });

        res.json(result);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
}

async function updatePreferences(req, res) {
    try {
        const userId = req.params.userId;
        const { categoryId, optedIn } = req.body;

        const pref = await Preference.findOneAndUpdate(
            { userId, categoryId },
            { $set: { optedIn: !!optedIn, updatedOn: new Date() } },
            { new: true, upsert: true }
        ).populate('categoryId');

        res.json(pref);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

module.exports = { updatePreferences, getPreferences };
