const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const bcrypt = require("bcrypt");
const mysql = require("mysql2"); 

const app = express();
const PORT = 5001;

// Middleware
app.use(cors());
app.use(bodyParser.json());

// MySQL connection setup
const db = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "",
  database: "user_management",
});

// Connecting to MySQL
db.connect((err) => {
  if (err) {
    console.error("Database connection failed: " + err.stack);
    return;
  }
  console.log("Connected to MySQL database.");
});

// Email validation function
const isValidEmail = (email) => {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return re.test(email);
};

// API to handle registration
app.post("/register", async (req, res) => {
  const { username, email, password } = req.body;

  if (!username || !email || !password) {
    console.log("Validation failed: missing fields");
    return res.status(400).json({ error: "All fields are required" });
  }

  if (!isValidEmail(email)) {
    console.log("Validation failed: invalid email format");
    return res.status(400).json({ error: "Invalid email format" });
  }

  try {
    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    const query = 'INSERT INTO users (username, email, password) VALUES (?, ?, ?)';
    db.query(query, [username, email, hashedPassword], (err, results) => {
      if (err) {
        console.error("Error executing query:", err);
        if (err.code === "ER_DUP_ENTRY") {
          return res.status(400).json({ error: "Email already exists" });
        }
        return res.status(500).json({ error: "Database error" });
      }

      console.log("User registered successfully:", results);
      res.status(201).json({ message: "User registered successfully" });
    });
  } catch (error) {
    console.error("Error hashing password:", error);
    return res.status(500).json({ error: "Server error" });
  }
});

// API to handle login
app.post("/login", async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    console.log("Validation failed: missing fields");
    return res.status(400).json({ error: "All fields are required" });
  }

  try {
    const query = 'SELECT * FROM users WHERE email = ?';
    db.query(query, [email], async (err, results) => {
      if (err) {
        console.error("Error executing query:", err);
        return res.status(500).json({ error: "Database error" });
      }

      if (results.length === 0) {
        return res.status(401).json({ error: "Invalid email or password" });
      }

      const user = results[0];

      // Compare the password with the hashed password in the database
      const match = await bcrypt.compare(password, user.password);
      if (!match) {
        return res.status(401).json({ error: "Invalid email or password" });
      }

      console.log("User logged in successfully:", user);
      res.status(200).json({ message: "Login successful", user: { id: user.id, username: user.username, email: user.email } });
    });
  } catch (error) {
    console.error("Error during login:", error);
    return res.status(500).json({ error: "Server error" });
  }
});



// API to handle adding hospital
app.post("/add-hospital", (req, res) => {
  const { hospital_name, hospital_type, address, phone_no } = req.body;
  
  console.log("Request received:", req.body); // Log the incoming data

  if (!hospital_name || !hospital_type || !address || !phone_no) {
    return res.status(400).json({ error: "All fields are required" });
  }
  const query =
    "INSERT INTO hospitals (hospital_name, hospital_type, address, phone_no) VALUES (?, ?, ?, ?)";
  
  db.query(query, [hospital_name, hospital_type, address, phone_no], (err) => {
    if (err) {
      console.error("Error inserting hospital:", err);  // Log error if query fails
      return res.status(500).json({ error: "Database error" });
    }
    console.log("Hospital added successfully");
    res.status(201).json({ message: "Hospital added successfully!" });
  });
});

// Retrieve all hospitals from the database
app.get("/hospitals", (req, res) => {
  const query = "SELECT * FROM hospitals WHERE is_delete = 0";
  db.query(query, (err, results) => {
    if (err) {
      return res.status(500).json({ error: "Database error" });
    }
    res.status(200).json(results);
  });
});

// Update a hospital by ID
app.put("/hospitals/:id", (req, res) => {
  const { id } = req.params;
  const { hospital_name, hospital_type, address, phone_no } = req.body;
  const query = "UPDATE hospitals SET hospital_name = ?, hospital_type = ?, address = ?, phone_no = ? WHERE hospital_id = ?";
  db.query(query, [hospital_name, hospital_type, address, phone_no, id], (err, results) => {
    if (err) {
      return res.status(500).json({ error: "Database error" });
    }
    if (results.affectedRows === 0) {
      return res.status(404).json({ error: "Hospital not found" });
    }
    res.status(200).json({ message: "Hospital updated successfully" });
  });
});


// Delete a hospital by ID
app.delete("/hospitals/:id", (req, res) => {
  const { id } = req.params;

  const query = "UPDATE hospitals SET is_delete = 1 WHERE hospital_id = ?";

  db.query(query, [id], (err, results) => {
    if (err) {
      console.error("Error deleting hospital:", err);
      return res.status(500).json({ error: "Database error" });
    }
    if (results.affectedRows === 0) {
      return res.status(404).json({ error: "Hospital not found" });
    }
    res.status(200).json({ message: "Hospital deleted successfully" });
  });
});


//get method
app.get("/hospitals/:id", (req, res) => {
  const { id } = req.params;
  console.log("Fetching hospital with ID:", id);

  const query = "SELECT * FROM hospitals WHERE hospital_id = ?";
  db.query(query, [id], (err, results) => {
    if (err) {
      console.error("Database error:", err);
      return res.status(500).json({ error: "Database error" });
    }
    if (results.length === 0) {
      console.warn("Hospital not found for ID:", id);
      return res.status(404).json({ error: "Hospital not found" });
    }
    console.log("Hospital Data:", results[0]);
    res.status(200).json(results[0]);
  });
});
app.put('/change', async (req, res) => {
  const { email, currentPassword, newPassword } = req.body;

  // Validate input
  if (!email || !currentPassword || !newPassword) {
    return res.status(400).json({ message: "All fields are required" });
  }

  // Check if user exists in the database
  db.query("SELECT * FROM users WHERE email = ?", [email], async (err, results) => {
    if (err) return res.status(500).json({ message: "Server error" });

    if (results.length === 0) {
      return res.status(404).json({ message: "User not found" });
    }

    const user = results[0];

    // Check if current password is correct
    const match = await bcrypt.compare(currentPassword, user.password);
    if (!match) {
      return res.status(400).json({ message: "Incorrect current password" });
    }

    // Hash the new password
    const hashedPassword = await bcrypt.hash(newPassword, 10);

    // Update the password in the database
    db.query("UPDATE users SET password = ? WHERE email = ?", [hashedPassword, email], (err) => {
      if (err) return res.status(500).json({ message: "Error updating password" });

      res.status(200).json({ message: "Password updated successfully" });
    });
  });
});
app.get("/value", (req, res) => {
  // Standard query function using callback
  const query = "SELECT hospital_id, hospital_name FROM hospitals WHERE is_delete = 0";
  
  db.query(query, (err, results) => {
    if (err) {
      console.error("Error fetching hospitals:", err);
      return res.status(500).json({ message: "Failed to fetch hospitals." });
    }
    
    console.log("Hospitals fetched:", results);
    res.status(200).json(results); // Send results as JSON
  });
});


app.post("/add-patient", async (req, res) => {
  const { patient_name, age, address, phone_number, issues, hospital_id } = req.body;

 
    // Step 1: Validate required fields
    if (!patient_name || !age || !address || !phone_number || !issues || !hospital_id) {
      return res.status(400).json({ message: "All fields are required" });
    }

    // Step 2: Validate age
    if (isNaN(age) || age <= 0) {
      return res.status(400).json({ message: "Age must be a positive number" });
    }

    // Step 3: Validate phone number
    const phoneRegex = /^[0-9]{10}$/;
    if (!phoneRegex.test(phone_number)) {
      return res.status(400).json({ message: "Phone number is invalid" });
    }

    // Step 4: Insert into the database
    const query = `
      INSERT INTO patients (patient_name, age, address, phone_number, issues, hospital_id) 
      VALUES (?, ?, ?, ?, ?, ?)
    `;


    
  db.query(query, [patient_name, age, address, phone_number, issues, hospital_id], (err) => {
    if (err) {
      console.error("Error inserting patient:", err);  // Log error if query fails
      return res.status(500).json({ error: "Database error" });
    }
    console.log("patient added successfully");
    res.status(201).json({ message: "patient added successfully!" });
  });

 
});
+
app.get("/patients", (req, res) => {
  const query = `
SELECT 
    patients.patient_id, 
    patients.patient_name, 
    patients.age, 
    patients.phone_number, 
    patients.address, 
    patients.issues, 
    patients.hospital_id, 
    hospitals.hospital_name 
FROM patients 
LEFT JOIN hospitals 
    ON patients.hospital_id = hospitals.hospital_id
WHERE patients.is_delete = 0 
  AND hospitals.is_delete = 0;`


  db.query(query, (error, results) => {
    if (error) {
      console.error("Error fetching patients:", error);
      res.status(500).json({ error: "Failed to fetch patients" });
    } else {
      res.status(200).json(results);
    }
  });
});

// Get patient by ID
app.get("/patients/:id", (req, res) => {
  const { id } = req.params;
  const query = `
    SELECT 
      patients.patient_id, 
      patients.patient_name, 
      patients.age, 
      patients.phone_number, 
      patients.address, 
      patients.issues, 
      patients.hospital_id, 
      hospitals.hospital_name
    FROM 
      patients
    JOIN 
      hospitals
    ON 
      patients.hospital_id = hospitals.hospital_id
    WHERE 
      patients.patient_id = ?;
  `;

  db.query(query, [id], (err, results) => {
    if (err) {
      console.error("Error fetching patient:", err);
      res.status(500).send("Error fetching patient");
    } else if (results.length === 0) {
      res.status(404).send("Patient not found");
    } else {
      res.json(results[0]);
    }
  });
});


app.delete("/patients/:id",(req,res) => {
  const{ id } = req.params;
  const query = "UPDATE patients SET is_delete = 1 WHERE patient_id = ?";
  db.query(query, [id], (err, results) => {
    if (err) {
      console.error("Error deleting patients:", err);
      return res.status(500).json({ error: "Database error" });
    }
    if (results.affectedRows === 0) {
      return res.status(404).json({ error: "patient not found" });
    }
    res.status(200).json({ message: "Patient deleted successfully" });
  });

})
app.put("/patients/:id", (req, res) => {
  const { id } = req.params;
  const { patient_name, age, address, phone_number, issues , hospital_name } = req.body;

  const getHospitalIdQuery = `SELECT hospital_id FROM hospitals WHERE hospital_name = ?`;

  db.query(getHospitalIdQuery, [hospital_name], (err, results) => {
    if (err) {
      console.error("Error fetching hospital ID:", err);
      return res.status(500).json({ message: "Database error while fetching hospital ID" });
    }

    if (results.length === 0) {
      return res.status(404).json({ message: "Hospital not found" });
    }

  const hospital_id = results[0].hospital_id;
    const updateDoctorQuery = `
      UPDATE patients
      SET patient_name = ?, 
          age = ?,
          address = ?,
          phone_number = ?,
          issues = ?,
          hospital_id = ? 
      WHERE patient_id = ?
    `;

    db.query(updateDoctorQuery, [patient_name,age,address,phone_number,issues, hospital_id, id], (updateErr, updateResults) => {
      if (updateErr) {
        console.error("Error updating doctor:", updateErr);
        return res.status(500).json({ message: "Database error while updating patient" });
      }

      if (updateResults.affectedRows === 0) {
        return res.status(404).json({ message: "patient not found" });
      }

      res.status(200).json({ message: "patient updated successfully" });
    });
  });
});



app.post('/add-medicine', (req, res) => {
  const { medicine_name, manufacture_date, expiry_date, company_name } = req.body;

  // Check if the medicine already exists and is not deleted (is_delete = 0)
  const checkQuery = `
    SELECT * FROM medicine_records
    WHERE medicine_name = ? 
      AND manufacture_date = ? 
      AND expiry_date = ? 
      AND company_name = ?
      AND is_delete = 0
  `;

  db.query(checkQuery, [medicine_name, manufacture_date, expiry_date, company_name], (err, result) => {
    if (err) {
      return res.status(500).send({ message: 'Error checking existing medicine', error: err });
    }
    if (result.length > 0) {
      // Medicine already exists and is not deleted
      return res.status(400).send({ message: 'Medicine already exists' });
    }

    // Proceed with inserting the new medicine record
    const query = `
      INSERT INTO medicine_records (medicine_name, manufacture_date, expiry_date, company_name, is_delete)
      VALUES (?, ?, ?, ?, 0)  -- Set is_delete to 0 for new records
    `;
    db.query(query, [medicine_name, manufacture_date, expiry_date, company_name], (err, result) => {
      if (err) {
        return res.status(500).send({ message: 'Error adding medicine', error: err });
      }
      res.status(200).send({ message: 'Medicine added successfully' });
    });
  });
});
app.get('/medicines',(req,res) =>{
  const query = `SELECT * FROM medicine_records WHERE is_delete = 0`;
  db.query(query, (error, results) => {
  if (error) {
    return res.status(500).send("error fetching data");
  }
  res.status(200).json(results);
});
})
//delete the medicine 
app.delete("/medicines/:id",(req,res) => {
  const{ id } =req.params;
  const query = "UPDATE medicine_records SET is_delete = 1 WHERE medicine_id = ? ";
  db.query(query,[id],(err,results) => {
    if (err) {
      console.error("Error deleting medicines:", err);
      return res.status(500).json({ error: "Database error" });
    }
    if (results.affectedRows === 0) {
      return res.status(404).json({ error: "medicine not found" });
    }
    res.status(200).json({ message: "medicine deleted successfully" });
  });

  })

  // API to fetch a specific medicine by ID
app.get('/medicine/:medicineId', (req, res) => {
  const{medicineId} = req.params;

  db.query(
    'SELECT * FROM medicine_records WHERE medicine_id = ?',
    [medicineId],
    (err, result) => {
      if (err) {
        console.error(err);
        return res.status(500).send('Server error');
      }

      if (result.length > 0) {
        return res.json(result[0]); // Send the medicine details
      } else {
        return res.status(404).send('Medicine not found');
      }
    }
  );
});

// API to update the medicine details
app.put("/medicine/:medicineId", (req, res) => {
  const { medicineId } = req.params; // Extract medicine ID from the route
  const { medicine_name,  manufacture_date, expiry_date, company_name } = req.body;

  // Validation: Check for missing fields
  if (!medicine_name ||  !manufacture_date || !expiry_date || !company_name) {
    return res.status(400).json({ error: "All fields are required" });
  }

  const query = `
    UPDATE medicine_records
    SET medicine_name = ?,  manufacture_date = ?, expiry_date = ?, company_name = ? 
    WHERE medicine_id = ?
  `;

  db.query(query, [medicine_name,manufacture_date, expiry_date, company_name, medicineId], (err, results) => {
    if (err) {
      console.error("Error updating medicine:", err);
      return res.status(500).json({ error: "Database error" });
    }

    if (results.affectedRows === 0) {
      return res.status(404).json({ error: "Medicine not found" });
    }

    res.status(200).json({ message: "Medicine updated successfully" });
  });
});
// Add a new doctor
// Add a new doctor
app.post("/add-doctor", (req, res) => {
  const { doctor_name, doctor_specialization, hospital_id } = req.body;

  // Validate incoming data
  if (!doctor_name || !doctor_specialization || !hospital_id) {
    return res.status(400).json({ message: "Doctor name, specialization, and hospital ID are required" });
  }

  const query = `
    INSERT INTO doctor (doctor_name, doctor_specialization, hospital_id)
    VALUES (?, ?, ?)
  `;

  db.query(query, [doctor_name, doctor_specialization, hospital_id], (err, result) => {
    if (err) {
      console.error("Error adding doctor:", err);
      return res.status(500).json({ message: "Failed to add doctor", error: err });
    }

    res.status(201).json({ message: "Doctor added successfully", doctor_id: result.insertId });
  });
});

// Get all doctors
app.get("/doctors", (req, res) => {
  const query = `
    SELECT * FROM doctor WHERE is_delete = 0
  `;

  db.query(query, (err, results) => {
    if (err) {
      console.error("Error fetching doctors:", err);
      return res.status(500).json({ message: "Failed to retrieve doctors", error: err });
    }

    res.status(200).json(results);
  });
});

// Get a specific doctor by ID
app.get("/doctors/:id", (req, res) => {
  const { id } = req.params;

  const query = `
    SELECT * FROM doctor WHERE doctor_id = ? AND is_delete = 0
  `;

  db.query(query, [id], (err, results) => {
    if (err) {
      console.error("Error fetching doctor:", err);
      return res.status(500).json({ message: "Database error" });
    }

    if (results.length === 0) {
      return res.status(404).json({ message: "Doctor not found" });
    }

    res.status(200).json(results[0]);
  });
});

app.put("/doctors/:id", (req, res) => {
  const { id } = req.params;
  const { doctor_name, doctor_specialization, hospital_name } = req.body;

  if (!doctor_name || !doctor_specialization || !hospital_name) {
    return res.status(400).json({
      message: "Doctor name, specialization, and hospital name are required",
    });
  }

  // Fetch the hospital_id based on hospital_name
  const getHospitalIdQuery = `SELECT hospital_id FROM hospitals WHERE hospital_name = ?`;

  db.query(getHospitalIdQuery, [hospital_name], (err, results) => {
    if (err) {
      console.error("Error fetching hospital ID:", err);
      return res.status(500).json({ message: "Database error while fetching hospital ID" });
    }

    if (results.length === 0) {
      return res.status(404).json({ message: "Hospital not found" });
    }

    const hospital_id = results[0].hospital_id;

    // Update the doctor table with the fetched hospital_id
    const updateDoctorQuery = `
      UPDATE doctor
      SET doctor_name = ?, 
          doctor_specialization = ?, 
          hospital_id = ? 
      WHERE doctor_id = ?
    `;

    db.query(updateDoctorQuery, [doctor_name, doctor_specialization, hospital_id, id], (updateErr, updateResults) => {
      if (updateErr) {
        console.error("Error updating doctor:", updateErr);
        return res.status(500).json({ message: "Database error while updating doctor" });
      }

      if (updateResults.affectedRows === 0) {
        return res.status(404).json({ message: "Doctor not found" });
      }

      res.status(200).json({ message: "Doctor updated successfully" });
    });
  });
});

// Delete a doctor by ID (Soft delete)
app.delete("/doctors/:id", (req, res) => {
  const { id } = req.params;

  const query = `
    UPDATE doctor SET is_delete = 1 WHERE doctor_id = ?
  `;

  db.query(query, [id], (err, results) => {
    if (err) {
      console.error("Error deleting doctor:", err);
      return res.status(500).json({ message: "Database error" });
    }

    if (results.affectedRows === 0) {
      return res.status(404).json({ message: "Doctor not found" });
    }

    res.status(200).json({ message: "Doctor deleted successfully" });
  });
});


// API Endpoint to add a treatment
app.post('/add-treatment', (req, res) => {
  const { hospital_id, patient_id, doctor_id, medicine_id, dosage } = req.body;

  // Validate input
  if (!hospital_id || !patient_id || !doctor_id || !medicine_id || !dosage) {
    return res.status(400).json({ message: 'All fields are required' });
  }

  // Insert treatment into the database
  const query = `
    INSERT INTO treatments (hospital_id, patient_id, doctor_id, medicine_id, dosage)
    VALUES (?, ?, ?, ?, ?)`;

  const values = [hospital_id, patient_id, doctor_id, medicine_id, dosage];

  db.query(query, values, (err, results) => {
    if (err) {

      console.error('Error adding treatment:', err);
      return res.status(500).json({ message: 'Failed to add treatment' });
    }
    res.status(200).json({ message: 'Treatment added successfully', treatment_id: results.insertId });
  });
});

// API endpoint to fetch prescribed medicines
app.get('/prescribedMedicines', (req, res) => {
  // SQL query to join treatment with hospital, medicine, patient, and doctor
  // Only show rows where is_delete = 0
  const query = `
    SELECT 
      treatments.treatment_id, 
      hospitals.hospital_name, 
      medicine_records.medicine_name, 
      doctor.doctor_name, 
      patients.patient_name, 
      treatments.dosage
    FROM treatments
    JOIN hospitals ON treatments.hospital_id = hospitals.hospital_id
    JOIN medicine_records ON treatments.medicine_id = medicine_records.medicine_id
    JOIN patients ON treatments.patient_id = patients.patient_id
    JOIN doctor ON treatments.doctor_id = doctor.doctor_id
    WHERE treatments.is_delete = 0; 
  `;

  db.query(query, (err, results) => {
    if (err) {
      console.error('Error fetching prescribed medicines:', err);
      res.status(500).json({ message: 'Failed to fetch prescribed medicines.' });
    } else {
      res.status(200).json(results);
    }
  });
});
// DELETE API
app.delete("/prescribed-medicines/:treatmentId", (req, res) => {
  const { treatmentId } = req.params;

  // Log the treatment ID received from the frontend
  console.log("Received treatmentId for deletion:", treatmentId);

  const query = `UPDATE treatments SET is_delete = 1 WHERE treatment_id = ? AND is_delete = 0`;
  db.query(query, [treatmentId], (err, result) => {
    if (err) {
      console.error("Error deleting prescribed medicine:", err);
      return res.status(500).json({ message: "Failed to delete prescribed medicine." });
    }

    // Check if any rows were updated
    if (result.affectedRows === 0) {
      console.log(`No record found with treatment_id = ${treatmentId} and is_delete = 0.`);
      return res.status(404).json({ message: "Prescribed medicine not found or already deleted." });
    }

    console.log(`Successfully marked treatment_id = ${treatmentId} as deleted.`);
    res.status(200).json({ message: "Prescribed medicine deleted successfully." });
  });
});


// Update the prescribed medicine for a specific treatment
app.put("/treatments/:id", (req, res) => {
  const treatmentId = req.params.id;
  const { hospital_id, doctor_id, patient_id, medicine_id, dosage } = req.body; // All fields required

  // Validate all fields
  if (!hospital_id || !doctor_id || !patient_id || !medicine_id || !dosage) {
    return res.status(400).json({ message: "All fields (hospital_id, doctor_id, patient_id, medicine_id, dosage) are required" });
  }

  const query = `
    UPDATE treatments
    SET hospital_id = ?, doctor_id = ?, patient_id = ?, medicine_id = ?, dosage = ?
    WHERE treatment_id = ?`;

  db.query(query, [hospital_id, doctor_id, patient_id, medicine_id, dosage, treatmentId], (err, results) => {
    if (err) {
      return res.status(400).json({ message: "Error updating prescribed medicine", error: err });
    }

    if (results.affectedRows === 0) {
      return res.status(404).json({ message: "Treatment not found" });
    }

    res.json({ message: "Prescribed medicine updated successfully" });
  });
});


// Fetch the prescribed medicine details for a specific treatment
app.get("/treatments/:id", (req, res) => {
  const { id } = req.params;

  const query = `SELECT 
  hospitals.hospital_id,
  hospitals.hospital_name, 
  patients.patient_id,
  patients.patient_name, 
  doctor.doctor_id,
  doctor.doctor_name, 
  medicine_records.medicine_id,
  medicine_records.medicine_name,
  treatments.dosage
FROM 
  treatments
JOIN patients ON treatments.patient_id = patients.patient_id
JOIN hospitals ON treatments.hospital_id = hospitals.hospital_id
JOIN doctor ON treatments.doctor_id = doctor.doctor_id
JOIN medicine_records ON treatments.medicine_id = medicine_records.medicine_id
WHERE treatments.treatment_id = ?`;

  db.query(query, [id], (err, result) => {
    if (err) {
      console.error("Error fetching treatment details:", err);
      res.status(500).json({ error: "Failed to fetch treatment details" });
    } else if (result.length === 0) {
      res.status(404).json({ message: "No treatment found with the given ID" });
    } else {
      res.status(200).json(result[0]); // Return only the requested details
    }
  });
});
app.post("/add-reminder", (req, res) => {
  const {treatment_id,reminder_time,start_date, total_days, message,status,times_of_day} = req.body;
  
  console.log("Request received:", req.body); // Log the incoming data

  if (!treatment_id || !reminder_time|| !start_date || !total_days ||!message ||!status ||!times_of_day) {
    return res.status(400).json({ error: "All fields are required" });
  }
  const query =
    "INSERT INTO reminders (treatment_id,reminder_time, start_date, total_days, message,status,times_of_day) VALUES (?, ?, ?, ?, ?, ?, ?)";
  
  db.query(query, [treatment_id, reminder_time, start_date, total_days,message,status,times_of_day], (err) => {
    if (err) {
      console.error("Error inserting hospital:", err);  // Log error if query fails
      return res.status(500).json({ error: "Database error" });
    }
    console.log("reminder added successfully");
    res.status(201).json({ message: "reminder added successfully!" });
  });
});


app.get('/reminders', (req, res) => {
  const query = `
   SELECT 
    r.reminder_id,
    r.reminder_time,
    r.start_date,
    r.total_days,
    r.message,
    r.status,
    r.times_of_day,
    -- From treatments table
    t.treatment_id,
    t.patient_id,
    t.doctor_id,
    t.medicine_id,
    t.hospital_id,
    t.dosage,
    -- From hospitals table
    h.hospital_name,
    -- From patients table
    p.patient_name,
    p.phone_number,
    -- From doctors table
    d.doctor_name,
    m.medicine_name
FROM reminders r
-- Join the treatments table to get treatment details
JOIN treatments t ON r.treatment_id = t.treatment_id
-- Join the hospitals table to get hospital name
JOIN hospitals h ON t.hospital_id = h.hospital_id
-- Join the patients table to get patient name
JOIN patients p ON t.patient_id = p.patient_id
-- Join the doctors table to get doctor name
JOIN doctor d ON t.doctor_id = d.doctor_id
JOIN medicine_records m ON t.medicine_id = m.medicine_id


WHERE r.status = 'active' AND r.is_delete = 0; -- Example filter
 -- Only fetch active reminders`;

  // Execute the query
  db.query(query, (err, results) => {
    if (err) {
      console.error('Error executing query:', err);
      return res.status(500).json({ error: 'Internal Server Error' });
    }

    // Return the results as a response
    res.status(200).json(results);
  });
});

app.delete("/reminders/:id", (req, res) => {
  const { id } = req.params;
  console.log(id);

  const query = "UPDATE reminders SET is_delete = 1 WHERE reminder_id = ?";

  db.query(query, [id], (err, results) => {
    if (err) {
      console.error("Error deleting hospital:", err);
      return res.status(500).json({ error: "Database error" });
    }
    if (results.affectedRows === 0) {
      return res.status(404).json({ error: "reminder not found" });
    }
    res.status(200).json({ message: "reminder deleted successfully" });
  });
});
// Get patient by ID
app.get("/reminders/:id", (req, res) => {
  const { id } = req.params;
  const query = `
    SELECT *
    FROM 
      reminders
    WHERE 
     reminder_id = ?
  `;

  db.query(query, [id], (err, results) => {
    if (err) {
      console.error("Error fetching patient:", err);
      res.status(500).send("Error fetching patient");
    } else if (results.length === 0) {
      res.status(404).send("Patient not found");
    } else {
      res.json(results[0]);
    }
  });
});

// Update the prescribed medicine for a specific treatment
app.put("/reminders/:id", (req, res) => {
  const reminderId = req.params.id;
  console.log(reminderId);

  const { treatment_id, start_date, reminder_time, total_days, message, status,times_of_day } = req.body; // All fields required

  // Validate all fields
  if (!treatment_id || !start_date || !reminder_time || !total_days || !message || !status || !times_of_day) {
    return res.status(400).json({ message: "All fields are required" });
  }

  const query = `
    UPDATE reminders
    SET treatment_id = ?, start_date = ?, reminder_time = ?, total_days = ?, message = ?, status = ?, times_of_day = ?
    WHERE reminder_id = ?`;

  db.query(query, [treatment_id, start_date, reminder_time, total_days, message, status,times_of_day, reminderId], (err, results) => {
    if (err) {
      return res.status(400).json({ message: "Error updating reminder", error: err });
    }

    if (results.affectedRows === 0) {
      return res.status(404).json({ message: "Reminder not found" });
    }

    res.json({ message: "Reminder updated successfully" });
  });
});



module.exports = app;







// Start the server
app.listen(PORT, () => {
  console.log("Server is running on http://localhost:${PORT}");
});