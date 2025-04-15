import { Container, Typography, Paper, Box, TextField, Button } from "@mui/material";
import { useState, useEffect, useRef } from "react";
import { Link, useNavigate, useParams } from 'react-router-dom';

export default function EditDrivingSchool() {
    const { drivingschoolid } = useParams();
    const [name, setName] = useState("");
    const [location, setLocation] = useState("");
    const [phone, setPhone] = useState("");
    const [data, setData] = useState([]);  // Αποθήκευση όλων των σχολών
    const navigate = useNavigate();
    const [validation, setValidation] = useState(false);
    const [phoneError, setPhoneError] = useState(false);
    const [duplicateNameError, setDuplicateNameError] = useState("");
    const [duplicatePhoneError, setDuplicatePhoneError] = useState("");
    const [error, setError] = useState(false);
    const alertShown = useRef(false); 

    const handleChangePhone = (e) => {
        let value = e.target.value.replace(/\D/g, ""); // Επιτρέπω μόνο αριθμούς
        setPhone(value);
        setPhoneError(value.length !== 10);
    };

    useEffect(() => {
        const token = localStorage.getItem("token");
        console.log("Token:", token); 
        fetch('http://localhost:8080/api/driving-schools/' + drivingschoolid, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`
            },
            credentials: "include",  // Απαραίτητο επειδή έχω allowCredentials(true)
        })
            .then((res) => {
                if (!res.ok) {
                    throw new Error(`HTTP error! Status: ${res.status}`);
                }
                return res.json();
            })
            .then((data) => {
                console.log("Fetched Data:", data); 
                setName(data.name);
                setLocation(data.location);
                setPhone(data.phone);
            })
            .catch((err) => console.error("Error fetching data:", err.message));
            
            // Φέρνουμε όλες τις σχολές για να ελέγξουμε για διπλότυπα
        fetch("http://localhost:8080/api/driving-schools", {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`
            }
        })
        .then(res => res.json())
        .then(schools => setData(schools))
        .catch(err => console.error("❌ Σφάλμα φόρτωσης σχολών:", err));
    }, [drivingschoolid]); // Επαναλαμβάνεται όταν αλλάξει το drivingschoolid

    // Ελέγχω αν το όνομα ή το τηλέφωνο είναι διπλότυπο
    useEffect(() => {
        const nameExists = data.some(school => 
            school.id !== parseInt(drivingschoolid) && // Εξαιρώ το τρέχον
            school.name.toLowerCase() === name.toLowerCase()
        );
        if (nameExists) {
            setDuplicateNameError("❌ Το όνομα υπάρχει ήδη!");
        } else {
            setDuplicateNameError(""); // Κρύβω το μήνυμα λάθους αν δεν υπάρχει διπλότυπο
        }

        const phoneExists = data.some(school => 
            school.id !== parseInt(drivingschoolid) && // Εξαιρώ το τρέχον
            school.phone === phone
        );
        if (phoneExists) {
            setDuplicatePhoneError("❌ Το τηλέφωνο υπάρχει ήδη!");
        } else {
            setDuplicatePhoneError(""); // Κρύβω το μήνυμα λάθους αν δεν υπάρχει διπλότυπο
        }
    }, [name, phone, data, drivingschoolid]); // Επαναλαμβάνεται όταν αλλάξει το όνομα ή το τηλέφωνο

    const handleSubmit = async (e) => {
        e.preventDefault(); 
        setDuplicateNameError("");
        setDuplicatePhoneError("");

        // Εάν υπάρχουν κενά πεδία, σταματάω την υποβολή
        if (name === "" || location === "" || phone === "" || phone.length !== 10) {
            setValidation(true);
            return;
        }

        if (phone.length !== 10) {
            setPhoneError(true);
            return;
        }

        if (duplicateNameError || duplicatePhoneError) {
            return; // Αν υπάρχει κάποιο μήνυμα λάθους, αποτρέπω την αποστολή
        }

        const newSchool = { name, location, phone };
        const token = localStorage.getItem("token"); // Παίρνω το token

        try {
            const response = await fetch("http://localhost:8080/api/driving-schools/" + drivingschoolid, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}` // Στέλνω το token
                },
                body: JSON.stringify(newSchool),
                credentials: "include", // Αν ο server χρειάζεται credentials
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

            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }

            await response.json();
            alert("✅ Επιτυχής ενημέρωση σχολής");
            navigate("/driving-schools");
        } catch (error) {
            console.error("❌ Σφάλμα κατά την ενημέρωση:", error.message);
        }
    };

    return (
        <Container sx={{marginTop: '100px'}}>
            <Box display="flex" justifyContent="space-around" mt={4} gap={2}>
                <Paper sx={{ p: 3, textAlign: "center", width: "100%" }}>
                    <Typography>Επεξεργασία Σχολής Οδηγών</Typography>
                    <form onSubmit={handleSubmit}>
                        <TextField
                            label="Όνομα"
                            InputLabelProps={{ shrink: true }}
                            fullWidth
                            margin="normal"
                            value={name}
                            onChange={e => setName(e.target.value)}
                            required
                            onMouseDown={() => setValidation(true)}
                            error={!!duplicateNameError}
                            helperText={duplicateNameError}
                        />
                        <TextField
                            label="Τοποθεσία"
                            InputLabelProps={{ shrink: true }}
                            fullWidth
                            margin="normal"
                            value={location}
                            onChange={e => setLocation(e.target.value)}
                            required
                            onMouseDown={() => setValidation(true)}
                            error={location === "" && validation}
                            helperText={location === "" && validation ? "Πληκτρολογήστε τοποθεσία" : ""}
                        />
                        <TextField
                            label="Τηλέφωνο"
                            fullWidth
                            margin="normal"
                            value={phone}
                            onChange={handleChangePhone}
                            error={phoneError || !!duplicatePhoneError}
                            helperText={phoneError ? "10 ψηφία (μόνο αριθμοί)" : duplicatePhoneError}
                            inputProps={{ maxLength: 10 }}
                            required
                        />

                        <Button variant="contained" type="submit" sx={{ background: "#007bff" }}>ΕΝΗΜΕΡΩΣΗ</Button>
                        <Link to="/driving-schools" variant="contained" className="btn">ΑΚΥΡΩΣΗ</Link>
                    </form>
                </Paper>
            </Box>
        </Container>
    );
}
