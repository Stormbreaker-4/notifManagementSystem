const Category = require("../models/Category");

const createCategory = async (req, res) => {
    try {
        const { name, description } = req.body;
        const new_category = new Category({ name, description });
        await new_category.save();
        res.status(201).json(new_category);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }

}

const getCategoryByType = async (req, res) => {
    try {
        const category_type = req.params.type;
        const category =  await Category.findOne({ name: category_type });
        res.status(200).json(category);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

module.exports = { createCategory, getCategoryByType };