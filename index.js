const express = require('express');
const bodyParser = require('body-parser');
const app = express();

app.use(bodyParser.json());

const PORT = 3000;

app.post('/api/notable/:doctorID/:appointment_day/:appointment_time/:patient_firstname/:patient_lastname/:type', (req, res) => {
    doctorID = req.params.doctorID
    appointmentDay = req.params.appointment_day
    appointmentTime = req.params.appointment_time
    patientFirstname = req.params.patient_firstname
    patientLastname = req.params.patient_lastname
    type = req.params.type

    appointmentCounter = 0

    if(appointmentTime.charAt(2) != '1' && appointmentTime.charAt(2) != '3' && appointmentTime.charAt(2) != '4' && appointmentTime.charAt(2) != '0'){
        console.log(appointmentTime.charAt(2))
        res.json({ error: `invalid time submitted`})
        return
    }

    if(appointmentTime.charAt(3) != '0' && appointmentTime.charAt(3) != '5'){
        console.log(appointmentTime.charAt(3))
        res.json({ error: `invalid time submitted`})
        return
    }

    for(let doctor of req.body.doctors){
        if(doctor.doctorID == doctorID){
            doctorFirstname = doctor.doctor_firstname
            doctorLastname = doctor.doctor_lastname
            for(time in doctor.appointment_time){
                if(time == appointmentTime){
                    appointmentCounter = appointmentCounter + 1
                }
            }
            if(appointmentCounter > 2){
                res.json({ error: `${doctor.doctor_firstname} ${doctor.doctor_lastname} has too many appointments at that time`})
            }
            doctor.appointment_day.push(appointmentDay)
            doctor.appointment_time.push(appointmentTime)
            doctor.patient_firstname.push(patientFirstname)
            doctor.patient_lastname.push(patientLastname)
            doctor.type.push(type)
            newAppointmentID = Math.max.apply(Math, doctor.appointmentID) + 1
            doctor.appointmentID.push(newAppointmentID)
        }
    }


    
    res.send(
        `Appointment with ${doctorFirstname} ${doctorLastname} on ${appointmentDay} at ${appointmentTime} for ${patientFirstname} ${patientLastname} as ${type} has been scheduled. AppointmentID: ${newAppointmentID}.`
    )
});

app.get('/api/notable', (req, res) => {
    doctors = []
    for(let doctor of req.body.doctors){
        doctorFirstname = doctor.doctor_firstname
        doctorLastname = doctor.doctor_lastname

        doctors.push(`${doctorFirstname} ${doctorLastname}`)
    }
    res.send(
        doctors
    )
});

app.get('/api/notable/:doctorID/:appointment_day', (req, res) => {

    const doctorID = req.params.doctorID

    const appointmentDay = req.params.appointment_day

    appointments = []

    for(let doctor of req.body.doctors){
        if(doctor.doctorID == doctorID){
            doctorFirstname = doctor.doctor_firstname
            doctorLastname = doctor.doctor_lastname
            for(i=0; i < doctor.appointment_day.length;i++){
                if(doctor.appointment_day[i] == appointmentDay){
                    appointments.push(`${doctor.appointment_time[i]}, with ${doctor.patient_firstname[i]} ${doctor.patient_lastname[i]}, ID:${doctor.appointmentID[i]}, type: ${doctor.type[i]}`)
                }
            }
        }
        
    }
    res.json(
        {message: `The appointments on ${appointmentDay} for ${doctorFirstname} ${doctorLastname} are ${appointments}`}
    )
});

app.delete('/api/notable/:doctorID/:appointmentID', (req, res) => {
    const doctorID = req.params.doctorID
    const appointmentID = req.params.appointmentID

    appointmentDeleted = ``

    for(let doctor of req.body.doctors){
        if(doctor.doctorID == doctorID){
            for(i=0; i<doctor.appointmentID.length; i++){
                if(doctor.appointmentID[i] == appointmentID){
                    appointmentDeleted = `Appointment with ${doctor.doctor_firstname} ${doctor.doctor_lastname} at ${doctor.appointment_time[i]} on ${doctor.appointment_day[i]} for ${doctor.patient_firstname[i]} ${doctor.patient_lastname[i]} has been deleted`
                    doctor.appointmentID.splice(i,1)
                    doctor.appointment_day.splice(i,1)
                    doctor.appointment_time.splice(i,1)
                    doctor.patient_firstname.splice(i,1)
                    doctor.patient_lastname.splice(i,1)
                    doctor.type.splice(i,1)
                }
            }
        }
    }
    
    res.json({ message : `${appointmentDeleted}`})
});

app.listen(PORT, () => {console.log(`Listening on localhost:${PORT}`)})

