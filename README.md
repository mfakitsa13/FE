# Σύστημα Σχολών Οδήγησης

Αυτό το project είναι μια εφαρμογή διαχείρισης σχολών οδήγησης και μαθητών. Παρέχει τη δυνατότητα προσθήκης μαθητών, σχολών, καθώς και επεξεργασίας και διαγραφής τους μέσω μιας απλής διεπαφής χρήστη (UI).

## Χαρακτηριστικά
- **LoginPage** όπου ο χρήστης μπορεί να κάνει σύνδεση μόνο εαν βρίσκεται στην βάση δεδομένων με email και password.
- **Αρχική σελίδα** με μενού πλοήγησης(αρχική, σχολές οδηγών, μαθητές, αποσύνδεση).
- **Προβολή σχολών οδήγησης σε πίνακα** με δυνατότητα προσθήκης νέας και επεξεργασίας ή διαγραφής των ήδη υπαρχουσών εγγραφών.(και στην βάση δεδομένων) 
- **Προβολή μαθητών σε πίνακα** με δυνατότητα προσθήκης, επεξεργασίας και διαγραφής.(και στην βάση δεδομένων)
- **Έλεγχος για διπλότυπα ονόματα ή τηλέφωνα σχολών οδήγησης.**
- **Έλεγχος για διπλότυπα ΑΦΜ και έλεγχος ηλικίας (άνω των 18) μαθητών.**
- **Αποσύνδεση** και επιστροφή στην LoginPage.
- Μετά από 15 λεπτά που το token λήγει, εμφανίζεται **μήνυμα για επανασύνδεση.**


## Τεχνολογίες που χρησιμοποιήθηκαν

- **React** για το front-end.
- **Material-UI** για το UI design.
- **React Router** για τη δρομολόγηση.
- **Axios** για τις αιτήματα HTTP.
- **JWT (JSON Web Tokens)** για την αυθεντικοποίηση χρηστών.

##### Η εφαρμογή τρέχει στο http://192.168.1.102:3000.


##### Για να λειτουργήσει η αυθεντικοποίηση και η διαχείριση χρηστών, απαιτείται back-end API που να υποστηρίζει τα endpoints για τις σχολές και τους μαθητές.


##### Χρησιμοποιείται το localStorage για την αποθήκευση του JWT token κατά τη διάρκεια της σύνδεσης.

## Σελίδες

#### Αυθεντικοποίηση χρήστη και επιστροφή token: /login 
#### Αρχική  σελίδα: /dashboard
#### Σχολές οδηγών: /driving-schools
#### Μαθητές: /students
#### Επεξεργασία στοιχείων συγκεκριμένης σχολής οδηγών: /driving-schools/edit/+id
#### Δημιουργία σχολής οδηγών: /driving-schools/create
#### Επεξεργασία στοιχείων συγκεκριμένου μαθητή: /students/edit/+id
#### Δημιουργία νέου μαθητή: /students/create

