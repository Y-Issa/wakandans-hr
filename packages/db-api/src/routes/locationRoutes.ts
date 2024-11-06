import express from 'express';

import {
  createLocation,
  deleteLocation,
  getAllLocations,
  getAllLocationsCount,
  getLocationById,
  updateLocation,
} from '../controllers/locationController';

const router = express.Router();

router.get('/locations', (req, res) => getAllLocations(req, res));
router.get('/locations/count', getAllLocationsCount);
router.get('/locations/:id', getLocationById);

router.post('/locations', createLocation);
router.put('/locations/:id', updateLocation);
router.delete('/locations/:id', deleteLocation);

export default router;
