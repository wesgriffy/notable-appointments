# Notable Coding challenge

To run, you can use a curl request with

```
curl -H "Content-Type:application/json" -X POST --data-binary "@input.json" http://localhost:3000/api/notable
```

and input the correct data at the end of the url.

I used a sample input named `doctors.json` so you can see what I used to test the code.

A sample output would be:

```
Appointment with Sterling Archer on Dec202019 at 8:15AM for John Smith as Follow-up has been scheduled. AppointmentID: 7.
```