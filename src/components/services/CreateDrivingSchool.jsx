import { useEffect, useState, useRef } from "react";
import { Container, Typography, Paper, Box, TextField, Button } from "@mui/material";
import { Link, useNavigate } from 'react-router-dom';

export default function CreateDrivingSchool() {
    const [name, setName] = useState("");
    const [location, setLocation] = useState("");
    const [phone, setPhone] = useState("");
    const [data, setData] = useState([]); // Αποθηκευώ τις υπάρχουσες σχολές
    const navigate = useNavigate();
    const [validation, setValidation] = useState(false);
    const [phoneError, setPhoneError] = useState(false);
    const [duplicateNameError, setDuplicateNameError] = useState("");
    const [duplicatePhoneError, setDuplicatePhoneError] = useState("");
    const alertShown = useRef(false);

    // Φόρτωση δεδομένων κατά την είσοδο στη σελίδα
    useEffect(() => {
        const token = localStorage.getItem("token");
        fetch("http://192.168.1.102:8080/api/driving-schools", {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`
            }
        })
        .then(res => res.json())
        .then(data => setData(data))
        .catch(err => console.error("❌ Σφάλμα φόρτωσης:", err));
    }, []);

    // 🔹 Ελέγχω τα διπλότυπα του ονόματος και του τηλεφώνου κάθε φορά που αλλάζουν
    useEffect(() => {
        const nameExists = data.some(school => school.name.toLowerCase() === name.toLowerCase());
        if (nameExists) {
            setDuplicateNameError("❌ Το όνομα υπάρχει ήδη!");
        } else {
            setDuplicateNameError("");
        }

        const phoneExists = data.some(school => school.phone === phone);
        if (phoneExists) {
            setDuplicatePhoneError("❌ Το τηλέφωνο υπάρχει ήδη!");
        } else {
            setDuplicatePhoneError("");
        }
    }, [name, phone, data]); // Ελέγχω μόλις αλλάξει το όνομα ή το τηλέφωνο

    const handleChangePhone = (e) => {
        let value = e.target.value.replace(/\D/g, ""); // Επιτρέπει μόνο αριθμούς
        setPhone(value);
        setPhoneError(value.length !== 10);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setDuplicateNameError("");
        setDuplicatePhoneError("");

        // Έλεγχος κενών πεδίων
        if (name === "" || location === "" || phone === "") {
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

        // Αν όλα είναι εντάξει, στέλνω το request
        const newSchool = { name, location, phone };
        const token = localStorage.getItem("token");

        try {
            const response = await fetch("http://192.168.1.102:8080/api/driving-schools", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`
                },
                body: JSON.stringify(newSchool)
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

            alert("✅ Επιτυχής δημιουργία σχολής");
            navigate("/driving-schools");
        } catch (error) {
            console.error("❌ Σφάλμα κατά τη δημιουργία:", error.message);
        }
    };

    return (
        <Container sx={{ marginTop: '100px' }}>
            <Box display="flex" justifyContent="space-around" mt={4} gap={2}>
                <Paper sx={{ p: 3, textAlign: "center", width: "100%" }}>
                    <Typography>Δημιουργία Σχολής Οδηγών</Typography>
                    <form onSubmit={handleSubmit}>
                        <TextField
                            label="Όνομα"
                            fullWidth
                            margin="normal"
                            value={name}
                            onChange={e => setName(e.target.value)}
                            required
                            error={!!duplicateNameError}
                            helperText={duplicateNameError}
                        />
                        <TextField
                            label="Τοποθεσία"
                            fullWidth
                            margin="normal"
                            value={location}
                            onChange={e => setLocation(e.target.value)}
                            required
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
                        <Button variant="contained" type="submit" className="btn">ΑΠΟΘΗΚΕΥΣΗ</Button>
                        <Link to="/driving-schools" variant="contained" className="btn">ΑΚΥΡΩΣΗ</Link>
                    </form>
                </Paper>
            </Box>
        </Container>
    );
}