import React, { useState, useEffect, useRef } from 'react'; 
import { Link, useNavigate} from 'react-router-dom';
import {
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow,
  IconButton, Container, Paper, Typography, Box, TablePagination
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import { School } from "@mui/icons-material";
const DrivingSchoolsPage = () => {
  const [data, setData] = useState([]); 
  const [page, setPage] = useState(0); // Κρατάω την τρέχουσα σελίδα
  const rowsPerPage = 3; 
  const alertShown = useRef(false); 
  const navigate = useNavigate();
  
  // Επεξεργασία σχολής
  const EditDrivingSchool = (id) => {
    navigate("/driving-schools/edit/"+id);
  }

  // Διαγραφή σχολής
  const DeleteDrivingSchool = (id) => {
       const token = localStorage.getItem("token");
       if(window.confirm("Είσαι σίγουρος/η ότι θέλεις να διαγράψεις αυτή τη σχολή οδηγών;")){
         fetch("http://192.168.1.102:8080/api/driving-schools/"+id,{
             method:'DELETE',
             headers: {
              "Content-Type": "application/json",
              "Authorization": `Bearer ${token}` // Στέλνω το token
            },
            body: JSON.stringify(data),
            credentials: "include", // Απαραίτητο επειδή έχω allowCredentials(true)
          }).then((res)=>{
              window.location.reload();
          }).catch((err)=>console.log(err.message));
    }
  }

  useEffect(() => {
    const token = localStorage.getItem("token");
    console.log("Token:", token); 
  
    let alertShown = false; 
  
    fetch('http://192.168.1.102:8080/api/driving-schools', {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`
      },
      credentials: "include",
    })
      .then((res) => {
        if (res.status === 403) {
          if (!alertShown) { // Επιβεβαιώνει ότι το alert εμφανίζεται μία φορά
            alertShown = true;
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
        setData(data);
      })
      .catch((err) => console.error("Error fetching data:", err.message));
  }, [navigate]); 


  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };


  return (
        <Container sx={{marginTop: '64px' }}>
          <Box display="flex" justifyContent="space-around" mt={4} gap={2}>
            <Paper sx={{ p: 3, textAlign: "center", width: "100%" }}>
              <School sx={{ fontSize: 40, color: "#1976D2" }} />
              <Typography sx={{ marginBottom: 2 }}>Σχολές οδηγών</Typography>
              <Link to="/driving-schools/create" variant="contained" className="btn">
                ΠΡΟΣΘΗΚΗ ΝΕΑΣ ΣΧΟΛΗΣ
              </Link>

              <TableContainer sx={{ marginTop: 5}}>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell>ID</TableCell>
                      <TableCell>Όνομα</TableCell>
                      <TableCell>Τοποθεσία</TableCell>
                      <TableCell>Τηλέφωνο</TableCell>
                      <TableCell>Ενέργειες</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {data.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((row) => (
                      <TableRow key={row.id}>
                        <TableCell>{row.id}</TableCell>
                        <TableCell>{row.name}</TableCell>
                        <TableCell>{row.location}</TableCell>
                        <TableCell>{row.phone}</TableCell>
                        <TableCell>
                          <IconButton onClick={() => { EditDrivingSchool(row.id) }}><EditIcon /></IconButton>
                          <IconButton onClick={() => { DeleteDrivingSchool(row.id) }}><DeleteIcon /></IconButton>
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
                rowsPerPageOptions={[]} // Αφαίρεση επιλογών για αριθμό γραμμών ανά σελίδα
              />
            </Paper>
          </Box>
        </Container> 
  );
};

export default DrivingSchoolsPage;