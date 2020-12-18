//Express App
const express = require('express')
const app = express()

//JOI
const Joi = require('joi')

app.use(express.json());

//Testing the server
app.get('/', (req, res) => {
    res.send("test is working :)")
})


//Create courses with name and ID number
const courses = [
    {id:  001, name: 'Math'},
    {id:  002, name: 'Reading'},
    {id:  003, name: 'Science'},
    {id:  004, name: 'P.E'},
    {id:  005, name: 'Music'},
    {id:  006, name: 'Writing'},
]

//Create faculty directory
const faculty = []

//Create array for holding students
const students = []

//Create Classes
const classes = [
    {className: 'A', grade: 3, facultyMember: null, students: null, annoucements: null, assignments: null},
    {className: 'B', grade: 1, facultyMember: null, students: null, annoucements: null, assignments: null},
    {className: 'C', grade: 2, facultyMember: null, students: null, annoucements: null, assignments: null}
]


//Display courses
app.get('/courses', (req, res) => {
    res.send(courses)
})

//Display Classes
app.get('/classes', (req, res) => {

    
})

//Display the name of the course
app.get('/courses/:id', (req, res) => {

    const courseName = courses.find(c => c.id === parseInt((req.params.name)))
    
    if (!course) {
        res.status(404).send('404: A course name does not match that id')
    }else{
        res.send(`The course name is: ${courseName.name}`)
    }

    
})

//Display the faculty memebers
app.get('/faculty', (req, res) => {
    res.send(faculty)
}) 

//Display the students
app.get('/students', (req, res) => {
    res.send(students)
})

//add a faculty member
app.post('/faculty', (req, res) => {

    const schema = Joi.object ({
        title: Joi.string().required(),
        firstName: Joi.string().required(),
        lastName: Joi.string().required(),
        class: Joi.string().required(),
    })
    
    const result = Joi.validate(req.body, schema)

    if(result.error){
        res.status(400).send(result.error.details[0].message)
        return
    }

    const facultyMember = {
        facultyID: faculty.length + 1,
        title: req.body.title,
        firstName: req.body.firstName,
        lastName: req.body.lastName,
        class: req.body.class,
    }

    faculty.push(facultyMember)
    res.send(facultyMember)

})

//add a student
app.post('/students', (req, res) => {

    const schema = Joi.object ({
        grade: Joi.number().required(),
        firstName: Joi.string().required(),
        lastName: Joi.string().required(),
        class: Joi.string().required(),
    })
    
    const result = Joi.validate(req.body, schema)

    if(result.error){
        res.status(400).send(result.error.details[0].message)
        return
    }

    const student= {
        studentID: roster.length + 1,
        grade: req.body.grade,
        firstName: req.body.firstName,
        lastName: req.body.lastName,
        class: req.body.class,
        tutor: false
    }

    roster.push(student)
    res.send(student)

})

//update faculty info (maybe add new fields to facultyMember)
app.put('/faculty/:facultyID', (req, res) => {

    const memberName = faculty.find(f => f.id === parseInt((req.params.firstName)))
    
    if (!memberName) {
        res.status(404).send('404: A faculty member does not match that id')
    }

    const schema = Joi.object ({
        firstName: Joi.string().required(),
        lastName: Joi.string().required(),
    })

    const result = Joi.validate(req.body, schema)

    if(result.error){
        res.status(400).send(result.error.details[0].message)
        return
    }

    //update the faculty memebers information
    faculty.firstName = req.body.firstName
    faculty.lastName = req.body.lastName

    res.send(teacher)


})


app.listen(3500, () => console.log('Listening on port 3500'))
