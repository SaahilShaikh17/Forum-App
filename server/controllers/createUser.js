// Controller to  create user in DB.
const User = require('../model/User');
const bcrypt = require('bcryptjs');

const handleNewUser = async(req,res) => {

    const {user, pwd, fname, lname} = req.body;
    if(!user || !pwd || !fname || !lname) return res.status(400).json({'message':' Username ,Password,First Name and LastName are required'});

    const duplicate = await User.findOne({ username: user }).exec();
    if(duplicate){
        return res.sendStatus(409); //Conflict
    }
    try{
        //Encrypting the password

        const hashedPwd = await bcrypt.hash(pwd,10);

        //Create the user and store
        const result = await User.create({
            "firstname":fname,
            "lastname":lname,
            "username":user,
            "password":hashedPwd
        });

        console.log(result);
        res.status(200).json({'message': `Success! New User ${user} created`});
    }catch(err){
        res.sendStatus(500).json({'message': err.message});
    }
}

module.exports = { handleNewUser };