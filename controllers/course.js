const Course = require("../models/course")

const getAllCourses = async (req, res)=>{
    try{
        const courses = await Course.find({}).select('-select');

        res.status(200).json({
            message: true,
            courses,
        });

    }catch(err){
        throw new Error("Something went wrong");


    }
    

}

const getLecturesByCourseId = async (req, res)=>{

}

module.exports = {
    getAllCourses,
    getLecturesByCourseId,


}