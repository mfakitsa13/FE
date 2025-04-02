import React, { useState, useEffect, useRef } from 'react'; 
import { Link, useNavigate } from 'react-router-dom';
import {
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow,
  IconButton, Container, Paper, Typography, Box, TablePagination
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import PersonIcon from '@mui/icons-material/Person';

const StudentsPage = () => {
  const [data, setData] = useState([]); 
  const [page, setPage] = useState(0); // Κρατάω την τρέχουσα σελίδα
  const rowsPerPage = 3; 
  const alertShown = useRef(false); 
  const navigate = useNavigate();

  // Επεξεργασία μαθητή
  const EditStudent = (id) => {
    navigate("/students/edit/" + id);
  }

  // Διαγραφή μαθητή
  const DeleteStudent = (id) => {
    const token = localStorage.getItem("token");
    if (window.confirm("Είσαι σίγουρος ότι θέλεις να διαγράψεις αυτόν τον μαθητή;")) {
      fetch("http://192.168.1.102:8080/api/students/" + id, {
        method: 'DELETE',
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`  // Στέλνω το token
        },
        credentials: "include", // Απαραίτητο επειδή έχω allowCredentials(true)
      }).then((res) => {
        window.location.reload();
      }).catch((err) => console.log(err.message));
    }
  }

  useEffect(() => {
    const token = localStorage.getItem("token");
    console.log("Token:", token); 
    fetch('http://192.168.1.102:8080/api/students', {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${localStorage.getItem("token")}`
      },
      credentials: "include",  // Απαραίτητο αν έχεις allowCredentials(true)
    })
      .then((res) => {
        if (res.status === 403) {
          if (!alertShown.current) { // Επιβεβαιώνει ότι το alert εμφανίζεται μία φορά
            alertShown.current = true;
            alert("⛔ Η σύνδεσή σας έληξε. Παρακαλώ συνδεθείτε ξανά.");
            localStorage.removeItem("token");
            navigate("/login");
          }
          return;
        }

        if (!res.ok) {
          throw new Error(`HTTP error! Status: ${res.status}`);
        }
        return res.json();
      })
      .then((data) => {
        console.log("Fetched Data:", data);
        setData(data);  // Αποθήκευση των δεδομένων
      })
      .catch((err) => console.error("Error fetching data:", err.message));
  }, [navigate]); // Προσθέτω κενό array [] για να εκτελείται μία φορά

  //Αλλαγή σελίδας
  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };


  return (
        <Container sx={{ marginTop: '64px' }}>
          <Box display="flex" justifyContent="space-around" mt={4} gap={2}>
            <Paper sx={{ p: 3, textAlign: "center", width: "100%" }}>
              <PersonIcon sx={{ fontSize: 40, color: "#1976D2" }} />
              <Typography sx={{ marginBottom: 2 }}>Μαθητές</Typography>
              <Link to="/students/create" variant="contained" className="btn">
                ΠΡΟΣΘΗΚΗ ΝΕΟΥ ΜΑΘΗΤΗ
              </Link>

              <TableContainer sx={{ marginTop: 5}}>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell>ID</TableCell>
                      <TableCell>ΑΦΜ</TableCell>
                      <TableCell>Όνομα</TableCell>
                      <TableCell>Επώνυμο</TableCell>
                      <TableCell>Ημερομηνία Γέννησης</TableCell>
                      <TableCell>Σχολή Οδηγών</TableCell>
                      <TableCell>Ενέργειες</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {data.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((row) => (
                      <TableRow key={row.id}>
                        <TableCell>{row.id}</TableCell>
                        <TableCell>{row.afm}</TableCell>
                        <TableCell>{row.firstName}</TableCell>
                        <TableCell>{row.lastName}</TableCell>
                        <TableCell>{row.dateOfBirth}</TableCell>
                        <TableCell>
                          {row.drivingSchoolName ? row.drivingSchoolName : "❌ Δεν βρέθηκε"}
                        </TableCell>
                        <TableCell>
                          <IconButton onClick={() => { EditStudent(row.id) }}><EditIcon /></IconButton>
                          <IconButton onClick={() => { DeleteStudent(row.id) }}><DeleteIcon /></IconButton>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>

            
              <TablePagination
                component="div"
                count={data.length}
                rowsPerPage={rowsPerPage}
                page={page}
                onPageChange={handleChangePage}
                onRowsPerPageChange={(event) => {
                  setPage(0);
                }}
                rowsPerPageOptions={[]} // Αφαίρεση επιλογών για αριθμό γραμμών ανά σελίδα
              />
            </Paper>
          </Box>
        </Container> 
  );
};

export default StudentsPage;