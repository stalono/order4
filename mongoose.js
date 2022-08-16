const { userSchema } = require('./schemas/user-schema.js');
const { dblink } = require('./json/config.json');
const mongoose = require('mongoose');

mongoose.connect(dblink);

function toModel(name, schema) {
	return mongoose.model(name, schema);
}

async function insertNew(model, data, collection) {
	const newModel = new model(data, collection);
	return await newModel.save();
}

async function createUser(id) {
	const userModel = toModel('user', userSchema);
	const userData = await userModel.findOne({ id: id });
	if (!userData) {
		const user = await insertNew(userModel, { id: new mongoose.Types.Decimal128(id) }, 'users');
		return user;
	} else {
		return userData;
	}
}

async function createModer(id) {
	const moderModel = toModel('moder', userSchema);
	const moderData = await moderModel.findOne({ id: id });
	if (!moderData) {
		const moder = await insertNew(moderModel, { id: new mongoose.Types.Decimal128(id) }, 'moders');
		return moder;
	} else {
		return moderData;
	}
}

async function updateUser(id, data) {
	await createUser(id);
	const userModel = toModel('user', userSchema);
	const userData = await userModel.findOne({ id: id });
	if (userData) {
		return await userModel.findOneAndUpdate({ id: id }, data);
	} else {
		return await createUser(id);
	}
}

async function updateModer(id, data) {
	await createModer(id);
	const moderModel = toModel('moder', userSchema);
	const moderData = await moderModel.findOne({ id: id });
	if (moderData) {
		return await moderModel.findOneAndUpdate({ id: id }, data);
	} else {
		return await createModer(id);
	}
}

async function getUser(id) {
	await createUser(id);
	const userModel = toModel('user', userSchema);
	const userData = await userModel.findOne({ id: id });
	if (userData) {
		return userData;
	} else {
		return await createUser(id);
	}
}

async function getModer(id) {
	await createModer(id);
	const moderModel = toModel('moder', userSchema);
	const moderData = await moderModel.findOne({ id: id });
	if (moderData) {
		return moderData;
	} else {
		return await createModer(id);
	}
}

async function isModer(id) {
	const moderModel = toModel('moder', userSchema);
	const moderData = await moderModel.findOne({ id: id });
	if (moderData) {
		return true;
	} else {
		return false;
	}
}

module.exports = { createUser, createModer, updateUser, updateModer, getUser, getModer, isModer };