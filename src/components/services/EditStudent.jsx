import { Container, Typography, Paper, Box, Autocomplete, TextField, Button } from "@mui/material";
import { useState, useEffect, useRef } from "react";
import { Link, useNavigate, useParams } from 'react-router-dom';

export default function EditDrivingSchool() {
    const { studentid } = useParams();
    const [afm, setAfm] = useState("");
    const [firstname, setFirstname] = useState("");
    const [lastname, setLastname] = useState("");
    const [dateOfBirth, setDateOfBirth] = useState("");
    const [drivingSchool, setDrivingSchool] = useState(null);
    const [schools, setSchools] = useState([]);
    const [students, setStudents] = useState([]); // Όλοι οι μαθητές για έλεγχο ΑΦΜ
    const [ageError, setAgeError] = useState(false);
    const [error, setError] = useState(false);
    const [validation, setValidation] = useState(false);
    const [duplicateAfmError, setDuplicateAfmError] = useState(""); // Μήνυμα λάθους για διπλότυπο ΑΦΜ
    const navigate = useNavigate();
     const alertShown = useRef(false); 

    //  Φόρτωση όλων των σχολών και μαθητών
    useEffect(() => {
        const token = localStorage.getItem("token");

        fetch('http://192.168.1.102:8080/api/driving-schools', {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`
            },
            credentials: "include",
        })
        .then(res => res.json())
        .then(data => setSchools(data))
        .catch(err => console.error("Error fetching schools:", err.message));

        fetch('http://192.168.1.102:8080/api/students', {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`
            },
            credentials: "include",
        })
        .then(res => res.json())
        .then(data => setStudents(data)) // Αποθήκευση μαθητών για έλεγχο ΑΦΜ
        .catch(err => console.error("Error fetching students:", err.message));
    }, []);

    // Φόρτωση δεδομένων του μαθητή
    useEffect(() => {
        const token = localStorage.getItem("token");

        fetch(`http://192.168.1.102:8080/api/students/${studentid}`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`
            },
            credentials: "include",
        })
        .then(res => {
            
            return res.json();
        })
        .then(data => {
            setAfm(data.afm);
            setFirstname(data.firstName);
            setLastname(data.lastName);
            setDateOfBirth(data.dateOfBirth);
            setDrivingSchool(data.drivingSchool.name);
        })
        .catch(err => console.error("Error fetching student:", err.message));
    }, [studentid, navigate]);

    // Έλεγχος αν το ΑΦΜ υπάρχει ήδη σε άλλον μαθητή
    const handleChangeAfm = (e) => {
        let value = e.target.value.replace(/\D/g, ""); // Επιτρέπει μόνο αριθμούς
        setAfm(value);
        setError(value.length !== 9);
        
        const afmExists = students.some(student => 
            student.afm === value && student.id !== parseInt(studentid) // Εξαιρώ το τρέχον studentid
        );

        if (afmExists) {
            setDuplicateAfmError("❌ Το ΑΦΜ ανήκει σε άλλον μαθητή!");
        } else {
            setDuplicateAfmError("");
        }
    };


    //Έλεγχος ηλικίας (>= 18)
    const handleChangeDateOfBirth = (e) => {
        const selectedDate = e.target.value;
        setDateOfBirth(selectedDate);

        const today = new Date();
        const birthDate = new Date(selectedDate);
        const age = today.getFullYear() - birthDate.getFullYear();
        const month = today.getMonth() - birthDate.getMonth();

        setAgeError(age < 18 || (age === 18 && month < 0));
    };

    // 🔹 Υποβολή φόρμας
    const handleSubmit = async (e) => {
        e.preventDefault();

        if (duplicateAfmError) return; // Αν υπάρχει διπλότυπο ΑΦΜ, αποτρέπω την αποστολή

        const updatedStudent = { 
            afm, 
            firstName: firstname, 
            lastName: lastname, 
            dateOfBirth, 
            drivingSchoolName: drivingSchool?.name
        };

        const token = localStorage.getItem("token");

        try {
            const response = await fetch(`http://192.168.1.102:8080/api/students/${studentid}`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`
                },
                body: JSON.stringify(updatedStudent),
                credentials: "include",
            });

            if (response.status === 403) {
              if (!alertShown) { // Επιβεβαιώνει ότι το alert εμφανίζεται μία φορά
                alertShown = true;
                alert("⛔ Η σύνδεσή σας έληξε. Παρακαλώ συνδεθείτε ξανά.");
                localStorage.removeItem("token");
                navigate("/login");
              }
              return;
            }

            if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);

            await response.json();
            alert("✅ Επιτυχής ενημέρωση μαθητή");
            navigate("/students");
        } catch (error) {
            console.error("❌ Σφάλμα κατά την ενημέρωση:", error.message);
        }
    };

    return (
        <Container sx={{ marginTop: '70px' }}>
            <Box display="flex" justifyContent="space-around" mt={4} gap={2}>
                <Paper sx={{ p: 3, textAlign: "center", width: "100%" }}>
                    <Typography>Επεξεργασία Μαθητή</Typography>
                    <form onSubmit={handleSubmit}>
                       <TextField
                            label="ΑΦΜ"
                            InputLabelProps={{ shrink: true }}
                            fullWidth
                            margin="normal"
                            value={afm}
                            required
                            onMouseDown={() => setValidation(true)}
                            onChange={handleChangeAfm}
                            error={error || !!duplicateAfmError}
                            helperText={duplicateAfmError || (error ? "9 ψηφία (μόνο αριθμοί)" : "")}
                            inputProps={{ maxLength: 9 }}
                        />                       
                        <TextField
                            label="Όνομα"
                            InputLabelProps={{ shrink: true }}
                            fullWidth
                            margin="normal"
                            value={firstname}
                            onChange={(e) => setFirstname(e.target.value)}
                            required
                        />
                        <TextField
                            label="Επώνυμο"
                            InputLabelProps={{ shrink: true }}
                            fullWidth
                            margin="normal"
                            value={lastname}
                            onChange={(e) => setLastname(e.target.value)}
                            required
                        />
                        <TextField
                            label="Ημερομηνία γέννησης"
                            InputLabelProps={{ shrink: true }}
                            fullWidth
                            margin="normal"
                            type="date"
                            value={dateOfBirth}
                            onChange={handleChangeDateOfBirth}
                            required
                            error={ageError}
                            helperText={ageError ? "Πρέπει να είστε άνω των 18 ετών" : ""}
                        />
                    <Autocomplete
                                    options={schools}
                                    getOptionLabel={(option) => option.name || "Χωρίς όνομα"}
                                    onChange={(event, newValue) => {
                                        setDrivingSchool(newValue); // Αποθηκεύω ολόκληρο το αντικείμενο σχολής
                                    }}
                                    renderInput={(params) => (
                                        <TextField
                                            {...params}
                                            label="Σχολή Οδηγών"
                                            margin="normal"
                                            fullWidth
                                            required
                                            error={!drivingSchool && validation}
                                            helperText={!drivingSchool && validation ? "Πρέπει να επιλέξετε σχολή" : ""}
                                        />
                                    )}
                      />                  

                   <Button variant="contained" type="submit" className="btn">ΕΝΗΜΕΡΩΣΗ</Button>
                   <Link to="/students" variant="contained" className="btn">ΑΚΥΡΩΣΗ</Link>
                   </form>  
                     </Paper> 
                 </Box>
                 </Container>  
           )
  } 