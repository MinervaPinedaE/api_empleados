 
require('dotenv').config(); 
const express = require('express'); 
const mongoose = require('mongoose'); 
 
const app = express(); 
app.use(express.json()); 
 
// Conexión a MongoDB Atlas 
mongoose.connect(process.env.MONGO_URI) 
.then(() => console.log('  Conectado exitosamente a MongoDB Atlas')) 
.catch(err => console.error('  Error de conexión:', err)); 
 
// Modelo para la colección "Empleados" 
const empleadoSchema = new mongoose.Schema({ 
  Clave: { type: Number, required: true }, 
  Nombre: { type: String, required: true }, 
  dirección: { type: String, required: true }, 
  fechadenacimiento: { type: Date, required: true }, // Se mapea como BSON Date 
  sexo: { type: String, required: true },          // Puede recibir texto ("Masculino"/"Femenino"  
 
  tipodesangre: { type: String, required: true } 
}); 
 
const Empleado = mongoose.model('Empleado', empleadoSchema, 'Empleados'); 
 
// --- 1. Endpoint GET: Obtener todos los empleados --- 
app.get('/api/empleados', async (req, res) => { 
  try { 
    const empleados = await Empleado.find(); 
    res.json(empleados); 
  } catch (error) { 
    res.status(500).json({ mensaje: error.message }); 
  } 
}); 
 
// --- 2. Endpoint GET: Obtener un empleado por ID --- 
app.get('/api/empleados/:id', async (req, res) => { 
  try { 
    const empleado = await Empleado.findById(req.params.id); 
    if (!empleado) return res.status(404).json({ mensaje: 'Empleado no encontrado' }); 
    res.json(empleado); 
  } catch (error) { 
    res.status(500).json({ mensaje: error.message }); 
  } 
}); 
 
// --- 3. Endpoint POST: Insertar un nuevo empleado --- 
app.post('/api/empleados', async (req, res) => { 
  try { 
    const nuevoEmpleado = new Empleado(req.body); 
    const guardado = await nuevoEmpleado.save(); 
    res.status(201).json({ mensaje: 'Empleado creado con éxito', datos: guardado }); 
  } catch (error) { 
    res.status(400).json({ mensaje: error.message }); 
  } 
}); 
 
// --- 4. Endpoint PUT: Actualizar un empleado por ID --- 
app.put('/api/empleados/:id', async (req, res) => { 
  try { 
    const actualizado = await Empleado.findByIdAndUpdate(req.params.id, req.body, { new: 
true, runValidators: true }); 
    if (!actualizado) return res.status(404).json({ mensaje: 'Empleado no encontrado' }); 
    res.json({ mensaje: 'Empleado actualizado con éxito', datos: actualizado }); 
  } catch (error) { 
    res.status(400).json({ mensaje: error.message }); 
  } 
}); 
 
// --- 5. Endpoint DELETE: Eliminar un empleado por ID --- 
app.delete('/api/empleados/:id', async (req, res) => { 
  try { 
    const eliminado = await Empleado.findByIdAndDelete(req.params.id); 
    if (!eliminado) return res.status(404).json({ mensaje: 'Empleado no encontrado' }); 
    res.json({ mensaje: 'Empleado eliminado con éxito' }); 
  } catch (error) { 
    res.status(500).json({ mensaje: error.message }); 
  } 
}); 
 
// Iniciar servidor 
const PORT = process.env.PORT || 3000; 
app.listen(PORT, () => { 
  console.log(` Servidor corriendo en el puerto ${PORT}`); 
}); 
