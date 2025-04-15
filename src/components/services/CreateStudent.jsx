import { Container, Typography, Paper, Box, TextField, Button, Autocomplete, CircularProgress } from "@mui/material";
import { useState, useEffect, useRef } from "react";
import { Link, useNavigate } from 'react-router-dom';

export default function CreateStudent() {
    const [afm, setAfm] = useState("");
    const [firstname, setFirstname] = useState("");
    const [lastname, setLastname] = useState("");
    const [dateOfBirth, setDateOfBirth] = useState("");
    const [drivingSchool, setDrivingSchool] = useState(null);
    const [schools, setSchools] = useState([]);
    const [students, setStudents] = useState([]); //Λίστα όλων των μαθητών για έλεγχο ΑΦΜ
    const [loading, setLoading] = useState(true);
    const [validation, setValidation] = useState(false);
    const [error, setError] = useState(false);
    const [ageError, setAgeError] = useState(false);
    const [duplicateAfmError, setDuplicateAfmError] = useState(""); //Σφάλμα για διπλότυπο ΑΦΜ
    const navigate = useNavigate();
    const alertShown = useRef(false); 

    // Ανάκτηση όλων των σχολών και μαθητών από το API
    useEffect(() => {
        const token = localStorage.getItem("token");

        // Φορτώνω τις σχολές
        fetch('http://localhost:8080/api/driving-schools', {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`
            },
            credentials: "include", // Απαραίτητο επειδή έχω allowCredentials(true)
        })
        .then(res => res.json())
        .then(data => {
            setSchools(data);
            setLoading(false);
        })
        .catch(err => {
            console.error("Error fetching schools:", err.message);
            setLoading(false);
        });

        // Φορτώνω τους μαθητές
        fetch('http://localhost:8080/api/students', {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`
            },
            credentials: "include", // Απαραίτητο επειδή έχω allowCredentials(true)
        })
        .then(res => res.json())
        .then(data => {
            setStudents(data); // Αποθήκευση μαθητών για έλεγχο ΑΦΜ
        })
        .catch(err => {
            console.error("Error fetching students:", err.message);
        });

    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();

        // Έλεγχος αν το ΑΦΜ υπάρχει ήδη στους μαθητές
        const afmExists = students.some(student => student.afm === afm);
        if (afmExists) {
            setDuplicateAfmError("❌ Το ΑΦΜ υπάρχει ήδη!");
            return;
        }

        // Έλεγχος αν η ηλικία σύμφωνα με την ημερομηνία είναι τουλάχιστον 18 ετών
        if (ageError) {
            alert("⚠️ Πρέπει να είστε άνω των 18 ετών.");
            return;
        }

        if (!drivingSchool) {
            alert("⚠️ Παρακαλώ επιλέξτε σχολή οδηγών.");
            return;
        }

        const newStudent = { 
            afm, 
            firstName: firstname, 
            lastName: lastname, 
            dateOfBirth, 
            drivingSchoolName: drivingSchool?.name
        };

        const token = localStorage.getItem("token");

        try {
            const response = await fetch("http://localhost:8080/api/students", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`
                },
                body: JSON.stringify(newStudent),
                credentials: "include", // Απαραίτητο επειδή έχω allowCredentials(true)
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
            alert("✅ Επιτυχής δημιουργία μαθητή");
            navigate("/students");
        } catch (error) {
            console.error("❌ Σφάλμα κατά τη δημιουργία:", error.message);
        }
    };

    const handleChangeAfm = (e) => {
        let value = e.target.value.replace(/\D/g, "");
        setAfm(value);
        setError(value.length !== 9);
        setDuplicateAfmError(""); // Καθαρίζει το μήνυμα λάθους όταν αλλάζει το ΑΦΜ
    };

    const handleChangeDateOfBirth = (e) => {
        const selectedDate = e.target.value;
        setDateOfBirth(selectedDate);

        const today = new Date();
        const birthDate = new Date(selectedDate);
        const age = today.getFullYear() - birthDate.getFullYear();
        const month = today.getMonth() - birthDate.getMonth();
        
        if (age < 18 || (age === 18 && month < 0)) {
            setAgeError(true);
        } else {
            setAgeError(false);
        }
    };

    return (
        <Container sx={{marginTop: '90px' }}>
            <Box display="flex" justifyContent="space-around" mt={4} gap={2}>
                <Paper sx={{ p: 3, textAlign: "center", width: "100%" }}>
                    <Typography>Δημιουργία Μαθητή</Typography>
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
                                    noOptionsText={loading ? <CircularProgress size={24} /> : "❌ Δεν βρέθηκαν σχολές"}
                                    loading={loading}
                                />

                                <Button variant="contained" type="submit" className="btn">ΑΠΟΘΗΚΕΥΣΗ</Button>
                                <Link to="/students" variant="contained" className="btn">ΑΚΥΡΩΣΗ</Link>
                            </form>
                        </Paper>
                    </Box>
                </Container>   
    );
}
