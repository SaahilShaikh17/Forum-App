const User = require('../model/User');

const getAllUsers = async (req,res) => {
    const users = await User.find();
    if(!users) return res.status(204).json({'message':'No users found'});
    res.json(users);
}

const updateUser = async (req, res) => {
    try {
        const {userId} = req.params; 
        if (!userId) return res.status(400).json({ message: 'User ID required' });

        const user = await User.findOne({ _id: userId }).exec();
        if (!user) {
            return res.status(204).json({ message: `No user matches ID ${userId}` });
        }

        // Update user properties if provided in request body
        if (req.body.firstname) user.firstname = req.body.firstname;
        if (req.body.lastname) user.lastname = req.body.lastname;
        if (req.body.username) user.username = req.body.username;

        const result = await user.save();
        res.json(result);
    } catch (error) {
        console.error('Error updating user:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};
 const deleteUser = async (req, res) => {
    try {
        const {userId} = req.params; 
        if (!userId) return res.status(400).json({ message: 'User ID required' });

        const user = await User.findOne({ _id: userId }).exec();
        if (!user) {
            return res.status(204).json({ message: `User ID ${userId} not found` });
        }

        const result = await user.deleteOne();
        res.json(result);
    } catch (error) {
        console.error('Error deleting user:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};


module.exports={
    updateUser,
    deleteUser,
    getAllUsers
}